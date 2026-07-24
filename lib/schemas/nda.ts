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

export const ndaSchema = z.object({
  /** "karsilikli": iki taraf da bilgi paylaşır · "tek": sadece açıklayan taraf paylaşır */
  tur: z.enum(["karsilikli", "tek"]),
  acilklayan: tarafSchema, // Açıklayan Taraf
  alan: tarafSchema, // Alan Taraf
  amac: z.string().trim().min(10, "Sözleşme amacı en az 10 karakter olmalı"),
  sureYil: z.coerce.number().int().min(1, "En az 1 yıl").max(20, "En fazla 20 yıl"),
  cezaiSart: z.coerce.number().min(0, "Negatif olamaz"),
  yetkiliYer: z.string().trim().min(2, "Yetkili il girin"),
  ekMaddeler: z.array(z.object({ metin: z.string().trim().min(3, "Madde en az 3 karakter olmalı") })),
});

export type NdaData = z.infer<typeof ndaSchema>;

export const NDA_VARSAYILAN: NdaData = {
  tur: "karsilikli",
  acilklayan: { adSoyad: "", tcNo: "", telefon: "", adres: "" },
  alan: { adSoyad: "", tcNo: "", telefon: "", adres: "" },
  amac: "",
  sureYil: 3,
  cezaiSart: 0,
  yetkiliYer: "",
  ekMaddeler: [],
};

export const NDA_ADIMLAR = [
  { id: "tur", baslik: "Tür ve Amaç", alanlar: ["tur", "amac"] },
  { id: "acilklayan", baslik: "Açıklayan Taraf", alanlar: ["acilklayan"] },
  { id: "alan", baslik: "Alan Taraf", alanlar: ["alan"] },
  { id: "sartlar", baslik: "Süre ve Yaptırım", alanlar: ["sureYil", "cezaiSart", "yetkiliYer"] },
  { id: "ek", baslik: "Ek Maddeler", alanlar: ["ekMaddeler"] },
  { id: "cikti", baslik: "İndir", alanlar: [] },
] as const;
