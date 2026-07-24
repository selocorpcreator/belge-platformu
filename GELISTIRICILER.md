# KolayBelge — Geliştirici Rehberi

Yeni belge türleri ve özellikler eklemek için bu rehberi kullanın.

## 📂 Klasör Yapısı

```
app/
  page.tsx                          # Ana sayfa (dinamik şablon seçimi)
  olustur/[slug]/page.tsx           # Sihirbaz sayfası
components/
  ui/                               # Form bileşenleri (Input, Select, Button, Field)
  stepper/Stepper.tsx               # Adım göstergesi
  layout/MobileTabs.tsx             # Mobil sekme değiştirici
  forms/                            # Belge türü form adımları
  preview/                          # A4 önizleme bileşenleri
  editor/RichTextEditor.tsx         # TipTap tabanlı editör
  clauses/ClauseLibrary.tsx         # Hazır madde kütüphanesi
  storage/DraftsPanel.tsx           # Taslak yönetim paneli
lib/
  schemas/                          # Zod şemaları + varsayılan değerler
  hooks/
    useAutoSave.ts                  # localStorage otomatik kayıt
    useContractCalculator.ts        # Tarih ve dönem hesaplamaları
  store/
    useUIStore.ts                   # UI durumu (adım, sekme)
    useDraftsStore.ts               # Taslak yönetimi
  utils/
    numberToWords.ts                # Sayı → Türkçe metne çevirme
    tarih.ts                        # Tarih işlemleri
  pdf/
    pdfGenerator.ts                 # PDF oluşturma, sayfa numarası, QR kod
  templates/
    registry.ts                     # Şablon kataloğu
types/
  contract.ts                       # Generic ContractTemplate tipi
  html2pdf.d.ts                     # html2pdf.js tür tanımı
```

## 🆕 Yeni Belge Türü Ekleme Adımları

### 1. Şema Oluştur

`lib/schemas/yeniBelge.ts` dosyası oluştur:

```typescript
import { z } from "zod";
import type { ContractTemplate } from "@/types/contract";

export const yeniBelgeSchema = z.object({
  // Form alanlarını tanımla
  taraf: z.object({
    adSoyad: z.string().min(3),
    // ...
  }),
});

export type YeniBelgeData = z.infer<typeof yeniBelgeSchema>;

export const YENI_BELGE_VARSAYILAN: YeniBelgeData = {
  taraf: { adSoyad: "" },
};

export const YENI_BELGE_ADIMLAR = [
  { id: "taraf", baslik: "Taraf", alanlar: ["taraf"] },
  { id: "cikti", baslik: "İndir", alanlar: [] },
];

export const YENI_BELGE_HAZIR: ContractTemplate["hazirMaddeler"] = [
  // Hazır maddeler
];
```

### 2. Form Bileşenlerini Yaz

`components/forms/yeni/TarafStep.tsx`:

```typescript
"use client";

import { useFormContext } from "react-hook-form";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { getError } from "@/lib/utils/getError";
import type { YeniBelgeData } from "@/lib/schemas/yeniBelge";

export function TarafStep() {
  const { register, formState: { errors } } = useFormContext<YeniBelgeData>();
  return (
    <Field label="Ad Soyad">
      <Input {...register("taraf.adSoyad")} />
    </Field>
  );
}
```

### 3. Belge Bileşeni Yaz

`components/preview/YeniBelgeDoc.tsx`:

```typescript
"use client";

import { useFormContext, useWatch } from "react-hook-form";
import type { YeniBelgeData } from "@/lib/schemas/yeniBelge";

export function YeniBelgeDoc() {
  const { control } = useFormContext<YeniBelgeData>();
  const data = useWatch({ control }) as YeniBelgeData;

  return (
    <div id="belge-a4" className="...">
      {/* Belge içeriği */}
    </div>
  );
}
```

### 4. Sihirbaz Sayfası Oluştur

`app/olustur/yeni-belge/page.tsx`:

```typescript
"use client";

import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  yeniBelgeSchema,
  YENI_BELGE_VARSAYILAN,
  YENI_BELGE_ADIMLAR,
  type YeniBelgeData,
} from "@/lib/schemas/yeniBelge";
import { useAutoSave } from "@/lib/hooks/useAutoSave";
// ... import diğer bileşenler ...

export default function YeniBelgeSayfasi() {
  const form = useForm<YeniBelgeData>({
    resolver: zodResolver(yeniBelgeSchema),
    defaultValues: YENI_BELGE_VARSAYILAN,
  });

  useAutoSave(form, "belge:yeni-belge:v1");

  // ... sayfa kodu ...
}
```

### 5. Registry'yi Güncelle

`lib/templates/registry.ts` içinde:

```typescript
{
  slug: "yeni-belge",
  ad: "Yeni Belge Adı",
  aciklama: "Açıklaması",
  kategori: "Kategori",
  ikon: "home",
  aktif: true,
  sira: 6,
}
```

## 🎨 Tasarım Düzeni

### Renkler (Tailwind)

```
lacivert (#22314E)        → Birincil renk (başlıklar, düğmeler)
lacivert-koyu (#182338)   → Hover durumu
zemin (#EDEFF3)           → Arka plan
kagit (#FFFFFF)           → Belge arkaplanı
muhur (#B3261E)           → Uyarı/hata (kırmızı)
cizgi (#D8DDE5)           → Kenarlıklar
metin (#1B2430)           → Ana metin
soluk (#5B6472)           → İpucu metni
```

### Yazı Tipi

- **Belgeler:** `font-belge` (Georgia, serif) — resmi dokümanlar
- **UI:** Tailwind varsayılanı (sans-serif)

## 💾 localStorage Yapısı

```
belge:yeni-belge:v1           → Form verileri (otomatik kaydedilir)
belge:yeni-belge:no           → Belge numarası (bir kez)
KolayBelge:taslaklarim        → Tüm taslaklı belgeler
```

## 🔄 Custom Hook'lar

### useAutoSave

```typescript
const { taslakBulundu, taslakDevamEtmek, setTaslakDevamEtmek } = useAutoSave(
  form,
  "belge:xyz:v1",
  { debounceMs: 2000 }
);
```

### useContractCalculator

```typescript
const hesap = useContractCalculator("2026-07-24", 12);
// {
//   baslangic: Date,
//   bitis: Date,
//   toplamAy: 12,
//   donemler: [{ donemNo, baslangic, bitis, aylar }],
//   kaporaVadesi: Date,
//   depozitoBitis: Date,
// }
```

## 📄 PDF & Yazdırma

### Sayfa Numarası ve QR Kod

`components/preview/YeniBelgeDoc.tsx` içinde:

```typescript
import { generateQRCodeURL, generatePdfFooter } from "@/lib/pdf/pdfGenerator";

const qrUrl = await generateQRCodeURL(`belge:${belgeSeriNo}`);
const footer = generatePdfFooter(1, 1, tarih, belgeSeriNo, qrUrl);
```

### Print CSS

`@media print` kuralları `app/globals-print.css` içinde tanımlanır:

```css
@media print {
  .no-break {
    page-break-inside: avoid;
  }
  .signature-block {
    page-break-inside: avoid;
  }
}
```

## 🧮 Sayısal Yardımcılar

```typescript
import { 
  sayiyiYaziyaCevir,      // 35000 → "OtuzBeşBin"
  tutarYaziyaCevir,       // 35000.50 → "Yalnız OtuzBeşBin Türk Lirası ElliKuruş"
  tutarBicimle,           // 35000 → "₺35.000,00"
  yuzdeHesapla,           // %10 hesapla
  faizHesapla,            // Bileşik faiz
} from "@/lib/utils/numberToWords";

import {
  tarihBicimle,           // "2026-07-24" → "24 Temmuz 2026"
  bugunTr,                // Bugünün tarihi
  belgeNoUret,            // UUID ile benzersiz belge no
  gunFarki,               // İki tarih arasındaki fark
  aylarSonraTarihi,       // N ay sonrasının tarihi
} from "@/lib/hooks/useContractCalculator";
```

## 📝 Notlar

- Form alanlarındaki **türkçe isimlendirme** (e.g., `taraf.adSoyad`) sağlayan `getError` hook'u kullan.
- **Mobil:** Split-screen > sekmeli (`Form` / `Önizleme`) — `MobileTabs` bileşeni otomatik yönetir.
- **Düzenleme Modu:** `contentEditable` ile `KiraSozlesmesiDoc` gibi `id="belge-a4"` olan öğeyi işaretlemek yeterli.
- **Taslaklar:** `useDraftsStore` ile otomatik yönetilir; UUID ile benzersiz ID oluşturulur.

## 🚀 Kurulum ve Çalıştırma

```bash
npm install
npm run dev
```

`http://localhost:3000` → Ana sayfa (tüm şablonları görür)
`http://localhost:3000/olustur/kira-sozlesmesi` → Kira sözleşmesi sihirbazı

