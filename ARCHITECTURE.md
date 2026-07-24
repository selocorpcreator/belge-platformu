# Kolay Belge Al — Mimari Dokümantasyon

## Sistem Mimarisi

### 3 Katmanlı Yapı

```
┌─────────────────────────────────────┐
│   Pages (app/olustur/**/page.tsx)   │  ← Sihirbaz koordinatörü
├─────────────────────────────────────┤
│  Form + Preview Components          │  ← UI katmanı
├─────────────────────────────────────┤
│  Hooks (useAutoSave) + Store        │  ← State & Storage
├─────────────────────────────────────┤
│  Schemas (Zod) + Utils (numberToWords) │  ← Business Logic
└─────────────────────────────────────┘
```

## Veri Akışı

### 1. Form → State
```
user input
    ↓
React Hook Form
    ↓
Zod validation
    ↓
useAutoSave (localStorage)
```

### 2. Form → Preview
```
form.watch()
    ↓
<IbraNamesPreview data={form.watch()} />
    ↓
A4Document (canlı güncelleme)
```

### 3. Preview → PDF
```
PDF İndir
    ↓
downloadPdf("document-print", "ibraname.pdf")
    ↓
html2pdf.js (A4 formatında)
```

## Kullanılan Kütüphaneler

### React Hook Form
Form state yönetimi ve validasyon:
```typescript
const form = useForm({
  resolver: zodResolver(ibraNamesSchema),
  defaultValues: IBRA_NAMES_DEFAULTS,
  mode: "onTouched",
});
```

### Zod
Runtime tür doğrulaması:
```typescript
export const ibraNamesSchema = z.object({
  subject: z.string().trim().min(10),
  amount: z.coerce.number().positive(),
});
```

### Zustand
Global state yönetimi:
```typescript
export const useDocumentStore = create<DocumentState>((set, get) => ({
  drafts: [],
  addDraft: (draft) => { /* ... */ },
}));
```

### html2pdf.js
HTML → PDF dönüştürme:
```typescript
html2pdf()
  .set({ margin: 10, filename: "ibraname.pdf", ... })
  .from(element)
  .save();
```

## Key Functions

### `numberToWords(num: number): string`
Rakamı Türkçe sözcüklere çevirir.
```typescript
numberToWords(15450) // → "OnBeşBinDörtYüzElliÜç"
```

### `amountToWords(amount: number): string`
Para tutarını "Yalnız ... Türk Lirası" formatında yazar.
```typescript
amountToWords(15450.50) // → "Yalnız OnBeşBinDörtYüzElli Türk Lirası ElliKuruş"
```

### `formatDate(iso: string): string`
ISO tarih formatını Türkçe yazılı hale getirir.
```typescript
formatDate("2026-07-24") // → "24 Temmuz 2026 Çarşamba"
```

### `useAutoSave<T>(form, storageKey, debounceMs)`
Form verilerini otomatik localStorage'ye kaydeder.

**Parametreler:**
- `form`: React Hook Form instance
- `storageKey`: localStorage anahtarı (örn: "kolaybelgeal:ibraname:draft")
- `debounceMs`: Debounce süresi (default: 2000ms)

**Özellikler:**
- Sayfa yüklendiğinde kaydedilmiş veriyi otomatik geri yükler
- Form değişiklikleri debounce ederek localStorage'ye kaydeder

### `<SplitLayout left right title />`
Split-screen layout bileşeni.

**Responsive:**
- Desktop: Form (sol %50) + Belge (sağ %50)
- Mobile: Form/Belge sekmeli görünüm

### `<A4Document children />`
A4 formatında belge konteyneri.

**Özellikler:**
- Otomatik ölçeklendirme
- Print CSS desteği
- ID: `document-print` (PDF indirme için)

## Belge Akışı (Workflow)

```
1. ANA SAYFA (/)
   ↓
   Kullanıcı "İbraname" seçer
   ↓
2. İBRANAME SAYFASI (/olustur/ibraname)
   ├── Sol Panel
   │   ├── Stepper (4 adım)
   │   ├── Form Adımları (IbraNamesStep1-3)
   │   └── İleri/Geri Butonları
   │
   └── Sağ Panel
       └── A4 Önizleme (canlı güncelleme)
   ↓
3. ADIM 0 - İBRA EDEN
   → releasingParty (fullName, idNumber, phone, address)
   ↓
4. ADIM 1 - İBRA EDİLEN
   → releasedParty (fullName, idNumber, phone, address)
   ↓
5. ADIM 2 - DETAYLAR
   → subject, amount, description, date
   ↓
6. ADIM 3 - ÇIKTI
   ├── PDF İndir
   └── Yazdır
```

## Form Validasyonu

### Zod Şeması Örneği
```typescript
const ibraNamesSchema = z.object({
  releasingParty: z.object({
    fullName: z.string().min(3, "En az 3 karakter"),
    phone: z.string().min(10, "Geçerli telefon"),
  }),
  subject: z.string().min(10, "En az 10 karakter"),
  amount: z.coerce.number().positive("0'dan büyük olmalı"),
});
```

### React Hook Form Entegrasyonu
```typescript
const form = useForm({
  resolver: zodResolver(ibraNamesSchema),
  mode: "onTouched", // Sadece touched alanlar kontrol edilir
});

// Adım bazlı validasyon
const isValid = await form.trigger(["releasingParty"]);
```

## localStorage Yapısı

```
kolaybelgeal:ibraname:draft = {
  "releasingParty": { "fullName": "...", ... },
  "subject": "...",
  "amount": 15000,
  ...
}
```

## Print CSS

```css
@media print {
  /* Sadece #document-print görünür */
  body * { visibility: hidden; }
  #document-print, #document-print * { visibility: visible; }
  
  /* Sayfa kesmeleri */
  .no-page-break { page-break-inside: avoid; }
  h1, h2, h3 { page-break-after: avoid; }
}
```

## Error Handling

### Form Hataları
```typescript
<Input
  error={errors.releasingParty?.fullName?.message}
/>
```

### Tür Güvenliği
```typescript
type IbraNamesData = z.infer<typeof ibraNamesSchema>;
```

## Performance Optimizasyonları

1. **useWatch + Split Screen**: Form değişiklikleri sadece belge componentini re-render eder
2. **Debounced autoSave**: 2 saniyelik debounce localStorage yazma sayısını azaltır
3. **Lazy Loading**: html2pdf.js dynamic import ile yüklenilir
4. **Form Mode**: `onTouched` modu gereksiz validasyonları azaltır

## Security Considerations

1. **localStorage**: Hassas veriler kontrol edilmeli
2. **Input Validation**: Zod ile sunucu tarafından doğrulama gerekli
3. **XSS Prevention**: React otomatik olarak XSS'e karşı koruma sağlar
4. **CSRF**: Next.js built-in koruma

## Geliştirilecek Alanlar

- [ ] Veritabanı entegrasyonu (Supabase/Firebase)
- [ ] Kullanıcı hesapları
- [ ] Belge geçmişi
- [ ] Şablon customizasyonu
- [ ] E-İmza entegrasyonu
- [ ] Çoklu dil desteği

---

**Son Güncelleme**: Temmuz 2026
