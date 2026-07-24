import { z } from "zod";

const noSchema = z
  .string()
  .trim()
  .refine((v) => v === "" || /^\d{10,11}$/.test(v), "T.C. Kimlik No (11) veya Vergi No (10) girin");

const tarafSchema = z.object({
  adSoyad: z.string().trim().min(3, "Ad soyad / unvan en az 3 karakter olmalı"),
  tcNo: noSchema,
  telefon: z.string().trim().min(10, "Geçerli bir telefon numarası girin"),
  adres: z.string().trim().min(10, "Adres en az 10 karakter olmalı"),
});

export const ticaretAnlasmasiSchema = z.object({
  tur: z.enum(["hizmet", "satis"]),
  saglayici: tarafSchema, // hizmet veren / satıcı
  alici: tarafSchema, // hizmet alan / alıcı
  konu: z.string().trim().min(10, "Sözleşme konusu en az 10 karakter olmalı"),
  bedel: z.coerce.number().positive("Bedel 0'dan büyük olmalı"),
  kdvDahil: z.enum(["dahil", "haric"]),
  odemePlani: z.enum(["pesin", "taksit", "teslimde", "aylik"]),
  odemeDetay: z.string().trim().optional(),
  baslangicTarihi: z.string().min(1, "Başlangıç tarihi seçin"),
  teslimSuresiGun: z.coerce.number().int().min(1, "En az 1 gün").max(3650, "En fazla 3650 gün"),
  gecikmeFaizi: z.enum(["yasal", "yok"]),
  cezaiSart: z.coerce.number().min(0, "Negatif olamaz"),
  yetkiliYer: z.string().trim().min(2, "Yetkili il girin"),
  ozelSartlar: z.array(z.object({ metin: z.string().trim().min(3, "Madde en az 3 karakter olmalı") })),
});

export type TicaretAnlasmasiData = z.infer<typeof ticaretAnlasmasiSchema>;

export const TICARET_VARSAYILAN: TicaretAnlasmasiData = {
  tur: "hizmet",
  saglayici: { adSoyad: "", tcNo: "", telefon: "", adres: "" },
  alici: { adSoyad: "", tcNo: "", telefon: "", adres: "" },
  konu: "",
  bedel: 0,
  kdvDahil: "haric",
  odemePlani: "pesin",
  odemeDetay: "",
  baslangicTarihi: "",
  teslimSuresiGun: 30,
  gecikmeFaizi: "yasal",
  cezaiSart: 0,
  yetkiliYer: "",
  ozelSartlar: [],
};

export const TICARET_ADIMLAR = [
  { id: "tur", baslik: "Sözleşme Türü ve Konu", alanlar: ["tur", "konu"] },
  { id: "saglayici", baslik: "Hizmet Veren / Satıcı", alanlar: ["saglayici"] },
  { id: "alici", baslik: "Hizmet Alan / Alıcı", alanlar: ["alici"] },
  { id: "finans", baslik: "Bedel ve Ödeme", alanlar: ["bedel", "kdvDahil", "odemePlani", "baslangicTarihi", "teslimSuresiGun", "yetkiliYer"] },
  { id: "ozel", baslik: "Özel Şartlar", alanlar: ["ozelSartlar"] },
  { id: "cikti", baslik: "İndir", alanlar: [] },
] as const;
