# KolayBelge — Ücretsiz Resmi Belge Oluşturucu

Kira sözleşmesi gibi belgeleri adım adım formla doldurup canlı A4 önizlemeyle
PDF indirmenizi sağlayan Next.js platformu.

## Kurulum

```bash
npm install
npm run dev
```

Tarayıcıda `http://localhost:3000` adresini açın.

## Teknoloji

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS + Lucide React
- React Hook Form + Zod (adım bazlı validasyon)
- Zustand (adım / mobil sekme / düzenleme modu)
- html2pdf.js (PDF) + print CSS (Yazdır)
- localStorage otomatik taslak kaydı (500ms debounce)

## Klasör Yapısı

```
app/
  page.tsx                      # Şablon seçim ekranı
  olustur/kira-sozlesmesi/      # Split-screen sihirbaz sayfası
components/
  ui/                           # Input, Select, Textarea, Button, Field
  stepper/Stepper.tsx
  layout/MobileTabs.tsx         # Mobilde Form / Önizleme sekmeleri
  forms/kira/                   # Adım bileşenleri (Taşınmaz, Kişi, Finansal, Özel Şartlar, Çıktı)
  preview/A4Preview.tsx         # Responsive A4 ölçekleyici
  preview/KiraSozlesmesiDoc.tsx # Sözleşme metni + mühür damgası
lib/
  schemas/kiraSozlesmesi.ts     # Zod şema, varsayılanlar, hazır maddeler, adımlar
  hooks/useAutoSave.ts          # localStorage otomatik kayıt
  store/useUIStore.ts           # Zustand UI durumu
  utils/sayiyiYaziyaCevir.ts    # "Yalnız ... Türk Lirası" dönüştürücü
  pdf/downloadPdf.ts            # html2pdf.js sarmalayıcı
  templates/registry.ts         # Şablon kataloğu + platform adı
```

## Yeni Belge Türü Eklemek

1. `lib/schemas/` altına yeni Zod şeması ve adım tanımı ekleyin.
2. `components/forms/<tur>/` altına adım bileşenlerini yazın.
3. `components/preview/` altına belge bileşenini ekleyin (id: `belge-a4`).
4. `lib/templates/registry.ts` içinde `aktif: true` yapın ve
   `app/olustur/<slug>/page.tsx` sayfasını oluşturun.

## Notlar

- Platform adını değiştirmek için `lib/templates/registry.ts` içindeki
  `PLATFORM_ADI` sabitini güncelleyin.
- Serbest Düzenleme Modu contentEditable ile çalışır; formda yapılan yeni
  değişiklikler manuel düzenlemelerin üzerine yazar (son adımda kullanın).
- Belgeler hukuki danışmanlık yerine geçmez; uyarı hem belgede hem çıktı
  ekranında yer alır.

## Gelişmiş Özellikler (v2)

✅ **Finansal Utilities**
- `numberToWords()`: Rakam → Türkçe metne dönüştürme
- `useContractCalculator()`: Tarih, dönem, kapora vadeleri otomatik hesapla
- Canlı A4 önizlemede "Yalnız ..." metni eşzamanlı güncellenir

✅ **PDF & Yazdırma**
- A4 standartlarına tam uyum
- Sayfa numarası, tarih, benzersiz Belge ID (UUID)
- QR kod doğrulama (opsiyonel)
- `page-break-inside: avoid` ile madde/imza bölünmesi engellenir
- Print CSS: Form ve navigasyon otomatik gizlenir

✅ **Rich-Text Editör**
- TipTap tabanlı serbest düzenleme modu
- Kalın, italik, üzeri çizili formatı
- Canlı önizlemede contentEditable ile metin değiştirilir
- "Kopyala" butonu ile belge metnini klip tahtaya al

✅ **Madde Kütüphanesi (ClauseLibrary)**
- Belge türüne göre hazır maddeler
- Tek tıkla forma ekle/çıkart
- Madde sırası: yukarı/aşağı düğmeleri
- Özel madde ekleme/düzenleme

✅ **Taslak Yönetimi**
- 2 saniyelik debounce ile otomatik localStorage kayıt
- Sayfa yenilendiğinde "Taslağınız bulundu" uyarısı
- "Taslaklarım" modal paneli: listele, aç, sil
- UUID tabanlı benzersiz taslak ID'leri

✅ **Generic Şablon Motor**
- `ContractTemplate<T>` tipi tüm belge türlerini kapsar
- 3 yeni şablon hazır: İhtarname, Muvafakatname (+ varolan Kira)
- Ana sayfa kategoriye göre dinamik kartlar
- Yeni şablon ekleme: 5 basit adım


## Yeni Özellikler (v3)

✅ **4 Ana Kategori** (`lib/templates/registry.ts`)
- Emlak & Konaklama · Hukuki Bildirimler · Ticari Sözleşmeler · İzin & Muvafakat

✅ **7 Aktif Belge Türü** (hepsi canlı A4 önizleme + serbest düzenleme + PDF)
- Kira Sözleşmesi (mevcut yapı, dokunulmadı)
- Kısa Süreli / Airbnb Kiralama — 7464 sayılı Kanun: izin belgesi no zorunlu, 100 gece sınırı, 1774 sayılı Kimlik Bildirme Kanunu maddesi
- İhtarname — noter/tebligat seçenekleri, süreli talep
- İbraname — TBK m.420 (1 ay kuralı, banka ödemesi, kalem dökümü) / genel ibra
- Ticari Hizmet-Satış Anlaşması — KDV, gecikme faizi (3095 s.K./TTK), cezai şart, KVKK maddesi
- Gizlilik Sözleşmesi (NDA) — tek taraflı/karşılıklı, TTK haksız rekabet, KVKK
- Muvafakatname

✅ **Generic Sihirbaz Motoru** (`components/wizard/`)
- `GenericWizard` + `GenericStepper`: yeni belge türü = şema + belge bileşeni + ~80 satırlık sayfa
- Ortak adımlar: `TarafStep`, `ListeStep`, `GenelCiktiStep` (`components/forms/ortak/`)
- Ortak A4 kabuğu: `BelgeKabuk` + `TarafTablo` + `ImzaBloklari` (mühür, belge no, uyarı otomatik)

✅ **Stripe Ödeme**
- `/pro` fiyatlandırma sayfası → `/api/checkout` → Stripe Checkout (TR yereli)
- `/api/stripe-webhook` ödeme onayı dinleyicisi
- `.env.example` içindeki anahtarları doldurun. STRIPE_PRICE_ID boşsa ₺79 tek seferlik ödeme oluşturulur.
- ⚠️ Stripe, Türkiye merkezli satıcı hesabı açmaz. Seçenekler: Stripe Atlas (ABD şirketi), iyzico, PayTR, Lemon Squeezy, Paddle. `/api/checkout` arayüzü sağlayıcı değişiminde korunabilir.
