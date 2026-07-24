# Kolay Belge Al — Utility Fonksiyonları Rehberi

## numberToWords Kütüphanesi

### `numberToWords(num: number): string`
Tam sayıları Türkçe sözcüklere çevirir.

**Örnek:**
```typescript
numberToWords(1)         // "Bir"
numberToWords(10)        // "On"
numberToWords(100)       // "Yüz"
numberToWords(1000)      // "Bin"
numberToWords(15450)     // "OnBeşBinDörtYüzElliÜç"
numberToWords(1000000)   // "BirMilyon"
```

**Desteklenen Aralık:** 0 → 999,999,999,999,999

---

### `amountToWords(amount: number, withPrefix?: boolean): string`
Para tutarını "Yalnız ... Türk Lirası ... Kuruş" formatında yazar.

**Parametreler:**
- `amount`: Lira.Kuruş formatında sayı (örn: 15450.50)
- `withPrefix`: "Yalnız" ön ekini ekle (default: true)

**Örnek:**
```typescript
amountToWords(15450.50)
// → "Yalnız OnBeşBinDörtYüzElliÜç Türk Lirası ElliKuruş"

amountToWords(1000, false)
// → "BirBinTürkLirası"

amountToWords(0.99)
// → "Yalnız Sıfır Türk Lirası DoksanDokuzKuruş"
```

---

### `formatCurrency(amount: number): string`
Para birimini Türkçe formatında gösterir (₺ ile).

**Örnek:**
```typescript
formatCurrency(15450.50)    // "₺15.450,50"
formatCurrency(1000000)     // "₺1.000.000,00"
formatCurrency(0.99)        // "₺0,99"
```

---

### `formatDate(iso: string | Date): string`
ISO tarih formatını Türkçe yazılı hale getirir.

**Parametreler:**
- `iso`: ISO 8601 tarih string'i veya Date nesnesi

**Örnek:**
```typescript
formatDate("2026-07-24")           // "24 Temmuz 2026 Çarşamba"
formatDate(new Date())             // "Bugünün tarihi Türkçe formatında"
```

---

### `todayTR(): string`
Bugünün tarihini Türkçe formatında döndürür.

**Örnek:**
```typescript
todayTR()  // "24 Temmuz 2026 Çarşamba"
```

---

### `calculatePercentage(base: number, percent: number)`
Yüzde hesaplayarak sonucu birden çok formatta döndürür.

**Döner Değer:**
```typescript
{
  amount: number;          // Hesaplanmış tutar
  formatted: string;       // ₺ formatında
  words: string;           // Türkçe sözcükler
}
```

**Örnek:**
```typescript
const result = calculatePercentage(100000, 10);
// {
//   amount: 10000,
//   formatted: "₺10.000,00",
//   words: "OnBin Türk Lirası"
// }
```

---

### `calculateCompoundInterest(principal: number, annualRate: number, monthCount: number)`
Bileşik faizi hesaplar.

**Parametreler:**
- `principal`: Ana tutar
- `annualRate`: Yıllık faiz oranı (%)
- `monthCount`: Ay sayısı

**Döner Değer:**
```typescript
{
  principal: number;
  rate: number;
  months: number;
  interest: number;        // Faiz miktarı
  total: number;           // Ana + Faiz
  formattedTotal: string;  // ₺ formatında
}
```

**Örnek:**
```typescript
const result = calculateCompoundInterest(100000, 5, 12);
// {
//   principal: 100000,
//   rate: 5,
//   months: 12,
//   interest: 5116.84,
//   total: 105116.84,
//   formattedTotal: "₺105.116,84"
// }
```

---

## Hooks

### `useAutoSave<T>(form, storageKey, debounceMs?)`
Form verilerini otomatik localStorage'ye kaydeder ve geri yükler.

**Parametreler:**
- `form`: React Hook Form `useForm()` instance
- `storageKey`: localStorage anahtarı
- `debounceMs`: Debounce süresi (default: 2000)

**Döner Değer:** Hiçbiri (side effect hook)

**Örnek:**
```typescript
const form = useForm({ ... });
useAutoSave(form, "kolaybelgeal:ibraname:draft", 2000);

// Otomatik olarak:
// 1. Sayfa yüklendiğinde localStorage'den veri yükler
// 2. Form değişiklikleri 2 saniye sonra localStorage'ye kaydeder
```

---

## PDF & Yazdırma

### `downloadPdf(elementId: string, filename: string)`
HTML öğesini PDF olarak indirir.

**Parametreler:**
- `elementId`: İndirilecek öğenin ID'si
- `filename`: İndirilecek dosyanın adı

**Örnek:**
```typescript
<button onClick={() => downloadPdf("document-print", "ibraname.pdf")}>
  PDF İndir
</button>
```

---

### `printPage(elementId: string)`
HTML öğesini yazdırır.

**Örnek:**
```typescript
<button onClick={() => printPage("document-print")}>
  Yazdır
</button>
```

---

## Bileşenler

### `<A4Document children />`
A4 formatında belge konteyneri.

**Özellikler:**
- Otomatik ölçeklendirme
- Yazdırma desteği
- ID: `document-print` (PDF indirme için)

**Örnek:**
```typescript
<A4Document>
  <h1>İBRANAME</h1>
  <p>Belge içeriği...</p>
</A4Document>
```

---

### `<SplitLayout left right title />`
Split-screen (desktop) / Tabbed (mobile) layout.

**Responsive:**
- Desktop (>1024px): Form (50%) + Belge (50%)
- Mobile (<1024px): Form/Belge sekmeli

**Örnek:**
```typescript
<SplitLayout
  left={<FormContent />}
  right={<PreviewContent />}
  title="İBRANAME"
/>
```

---

### `<Input label error hint />`
Metin input alanı.

**Props:**
- `label?`: Alan etiketi
- `error?`: Hata mesajı
- `hint?`: İpucu metni
- Standart `<input />` özellikleri

**Örnek:**
```typescript
<Input
  label="Ad Soyad"
  placeholder="Tam ad ve soyadınız"
  error={errors.fullName?.message}
  {...register("fullName")}
/>
```

---

### `<Button variant size>`
Stil Button bileşeni.

**Varyantlar:**
- `primary`: Mavi, ana eylem
- `secondary`: Dış hat, ikincil eylem
- `ghost`: Arka plan yok, metin
- `danger`: Kırmızı, tehlikeli eylem

**Boyutlar:**
- `sm`: Küçük
- `md`: Orta (default)
- `lg`: Büyük

**Örnek:**
```typescript
<Button variant="primary" size="lg">
  <Download /> PDF İndir
</Button>

<Button variant="ghost" disabled>
  Geri
</Button>
```

---

### `<Select label error />`
Seçim kutusu.

**Örnek:**
```typescript
<Select label="Tebligat Şekli" {...register("notificationMethod")}>
  <option value="elden">Elden</option>
  <option value="posta">Posta</option>
</Select>
```

---

### `<Textarea label error />`
Çok satırlı metin alanı.

**Örnek:**
```typescript
<Textarea
  label="Talep"
  rows={4}
  {...register("demand")}
  error={errors.demand?.message}
/>
```

---

## State Management (Zustand)

### `useDocumentStore`
Global belge ve taslak yönetimi.

**Methods:**
```typescript
store.addDraft(draft)                // Yeni taslak ekle
store.updateDraft(id, data)          // Taslağı güncelle
store.deleteDraft(id)                // Taslağı sil
store.getDraft(id)                   // Taslak getir
store.setStep(step)                  // Adımı ayarla
store.loadFromStorage()              // localStorage'den yükle
store.saveToStorage()                // localStorage'ye kaydet
```

**Örnek:**
```typescript
const store = useDocumentStore();
const draft = store.addDraft({
  type: "ibraname",
  title: "Ticari Borç İbranamesi",
  data: { /* ... */ },
});
```

---

## Schema Validasyonu (Zod)

### Mevcut Şemalar

```typescript
export const ibraNamesSchema;      // İbraname
export const ihtarnameSchema;      // İhtarname
export const ticariAnlasmaSchema;  // Ticari Anlaşma
export const airbnbSchema;         // Günlük Kiralama
```

### Type Çıkarma
```typescript
type IbraNamesData = z.infer<typeof ibraNamesSchema>;
```

---

## En İyi Uygulamalar

### 1. Form Adımları
```typescript
const stepFields = [
  ["releasingParty"],
  ["releasedParty"],
  ["subject", "amount"],
];

const isValid = await form.trigger(stepFields[currentStep]);
if (isValid) nextStep();
```

### 2. Canlı Üzeleme
```typescript
const data = form.watch(); // Her değişiklik update eder
<PreviewComponent data={data} />
```

### 3. localStorage Yönetimi
```typescript
useAutoSave(form, "kolaybelgeal:type:draft", 2000);
```

### 4. Error Handling
```typescript
<Input
  label="Ad"
  error={errors.fullName?.message}
  {...register("fullName")}
/>
```

---

**Tüm fonksiyonlar TypeScript ile tam tip güvenliğine sahiptir.**
