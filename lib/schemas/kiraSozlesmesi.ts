import { z } from "zod";

const tcNoSchema = z
  .string()
  .trim()
  .refine((v) => v === "" || /^[1-9]\d{10}$/.test(v), "Geçerli bir T.C. Kimlik No girin (11 hane)");

const kisiSchema = z.object({
  adSoyad: z.string().trim().min(3, "Ad soyad en az 3 karakter olmalı"),
  tcNo: tcNoSchema,
  telefon: z.string().trim().min(10, "Geçerli bir telefon numarası girin"),
  adres: z.string().trim().min(10, "Tebligat adresi en az 10 karakter olmalı"),
});

export const kiraSozlesmesiSchema = z.object({
  tasinmaz: z.object({
    adres: z.string().trim().min(10, "Açık adres en az 10 karakter olmalı"),
    ilce: z.string().trim().min(2, "İlçe girin"),
    il: z.string().trim().min(2, "İl girin"),
    mulkTipi: z.enum(["konut", "isyeri", "depo", "diger"]),
    demirbaslar: z.string().trim().optional(),
  }),
  kirayaVeren: kisiSchema,
  kiraci: kisiSchema,
  finansal: z.object({
    kiraBedeli: z.coerce.number().positive("Kira bedeli 0'dan büyük olmalı"),
    odemeGunu: z.coerce.number().int().min(1, "1-31 arası olmalı").max(31, "1-31 arası olmalı"),
    depozito: z.coerce.number().min(0, "Negatif olamaz"),
    odemeSekli: z.enum(["havale", "nakit", "diger"]),
    iban: z.string().trim().optional(),
    baslangicTarihi: z.string().min(1, "Başlangıç tarihi seçin"),
    sureAy: z.coerce.number().int().min(1, "En az 1 ay").max(120, "En fazla 120 ay"),
  }),
  opsiyonelMaddeler: z.array(z.string()),
  ozelSartlar: z.array(z.object({ metin: z.string().trim().min(3, "Madde en az 3 karakter olmalı") })),
});

export type KiraSozlesmesiData = z.infer<typeof kiraSozlesmesiSchema>;

export const KIRA_VARSAYILAN: KiraSozlesmesiData = {
  tasinmaz: { adres: "", ilce: "", il: "", mulkTipi: "konut", demirbaslar: "" },
  kirayaVeren: { adSoyad: "", tcNo: "", telefon: "", adres: "" },
  kiraci: { adSoyad: "", tcNo: "", telefon: "", adres: "" },
  finansal: {
    kiraBedeli: 0,
    odemeGunu: 1,
    depozito: 0,
    odemeSekli: "havale",
    iban: "",
    baslangicTarihi: "",
    sureAy: 12,
  },
  opsiyonelMaddeler: [],
  ozelSartlar: [],
};

export const HAZIR_MADDELER: { id: string; baslik: string; metin: string }[] = [
  {
    id: "evcil-hayvan",
    baslik: "Evcil Hayvan İzni",
    metin: "Kiracı, kiralanan taşınmazda komşuları rahatsız etmemek ve taşınmaza zarar vermemek kaydıyla evcil hayvan besleyebilir.",
  },
  {
    id: "alt-kiralama-yasagi",
    baslik: "Alt Kiralama Yasağı",
    metin: "Kiracı, kiraya verenin yazılı izni olmaksızın taşınmazı kısmen veya tamamen üçüncü kişilere kiralayamaz, kullanım hakkını devredemez.",
  },
  {
    id: "tadilat-izni",
    baslik: "Tadilat İzni Şartı",
    metin: "Kiracı, taşınmazda esaslı tadilat ve değişiklikleri ancak kiraya verenin yazılı izni ile yapabilir; yapılan sabit tadilatlar için bedel talep edemez.",
  },
  {
    id: "sigorta",
    baslik: "Sigorta Yükümlülüğü",
    metin: "Zorunlu Deprem Sigortası (DASK) kiraya veren tarafından; eşya ve mesuliyet sigortaları dilerse kiracı tarafından yaptırılır.",
  },
  {
    id: "aidat",
    baslik: "Aidat ve Ortak Giderler",
    metin: "Site/apartman aidatı ile ortak kullanım giderleri kiracı tarafından, demirbaş niteliğindeki büyük onarım giderleri kiraya veren tarafından karşılanır.",
  },
  {
    id: "sigara-yasagi",
    baslik: "Kapalı Alanda Sigara Yasağı",
    metin: "Kiracı, taşınmazın kapalı alanlarında sigara ve benzeri tütün ürünleri kullanmamayı kabul eder.",
  },
];

export const KIRA_ADIMLARI = [
  { id: "tasinmaz", baslik: "Taşınmaz", alanlar: ["tasinmaz"] },
  { id: "kirayaVeren", baslik: "Kiraya Veren", alanlar: ["kirayaVeren"] },
  { id: "kiraci", baslik: "Kiracı", alanlar: ["kiraci"] },
  { id: "finansal", baslik: "Finansal Şartlar", alanlar: ["finansal"] },
  { id: "ozel", baslik: "Özel Şartlar", alanlar: ["ozelSartlar"] },
  { id: "cikti", baslik: "İndir", alanlar: [] },
] as const;
