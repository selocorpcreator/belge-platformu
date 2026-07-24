import { z } from "zod";

const tcNoSchema = z
  .string()
  .trim()
  .refine((v) => v === "" || /^\d{10,11}$/.test(v), "Geçerli bir T.C. Kimlik No / Vergi No girin");

const kisiSchema = z.object({
  adSoyad: z.string().trim().min(3, "Ad soyad / unvan en az 3 karakter olmalı"),
  tcNo: tcNoSchema,
  telefon: z.string().trim().min(10, "Geçerli bir telefon numarası girin"),
  adres: z.string().trim().min(10, "Adres en az 10 karakter olmalı"),
});

export const ibranameSchema = z.object({
  /** "is": işçi-işveren ibranamesi (TBK m.420) · "genel": genel alacak-borç ibrası */
  tur: z.enum(["is", "genel"]),
  ibraEden: kisiSchema, // alacaklı / işçi
  ibraEdilen: kisiSchema, // borçlu / işveren
  // İş ilişkisi alanları
  iseGirisTarihi: z.string().optional(),
  istenAyrilisTarihi: z.string().optional(),
  gorev: z.string().trim().optional(),
  odemeKalemleri: z.array(
    z.object({
      kalem: z.string().trim().min(2, "Kalem adı girin"),
      tutar: z.coerce.number().min(0, "Negatif olamaz"),
    })
  ),
  odemeSekli: z.enum(["banka", "nakit"]),
  // Genel ibra alanları
  konu: z.string().trim().optional(),
  ekBeyanlar: z.array(z.object({ metin: z.string().trim().min(3, "Beyan en az 3 karakter olmalı") })),
});

export type IbranameData = z.infer<typeof ibranameSchema>;

export const IBRANAME_VARSAYILAN: IbranameData = {
  tur: "is",
  ibraEden: { adSoyad: "", tcNo: "", telefon: "", adres: "" },
  ibraEdilen: { adSoyad: "", tcNo: "", telefon: "", adres: "" },
  iseGirisTarihi: "",
  istenAyrilisTarihi: "",
  gorev: "",
  odemeKalemleri: [
    { kalem: "Kıdem Tazminatı", tutar: 0 },
    { kalem: "İhbar Tazminatı", tutar: 0 },
    { kalem: "Yıllık İzin Ücreti", tutar: 0 },
  ],
  odemeSekli: "banka",
  konu: "",
  ekBeyanlar: [],
};

export const IBRANAME_ADIMLAR = [
  { id: "tur", baslik: "İbra Türü", alanlar: ["tur"] },
  { id: "ibraEden", baslik: "İbra Eden", alanlar: ["ibraEden"] },
  { id: "ibraEdilen", baslik: "İbra Edilen", alanlar: ["ibraEdilen"] },
  { id: "detay", baslik: "Detaylar ve Ödemeler", alanlar: ["odemeKalemleri", "odemeSekli"] },
  { id: "beyan", baslik: "Ek Beyanlar", alanlar: ["ekBeyanlar"] },
  { id: "cikti", baslik: "İndir", alanlar: [] },
] as const;
