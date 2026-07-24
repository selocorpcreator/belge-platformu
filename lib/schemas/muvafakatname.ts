import { z } from "zod";
import type { ContractTemplate } from "@/types/contract";

const tcNoSchema = z
  .string()
  .trim()
  .refine((v) => v === "" || /^[1-9]\d{10}$/.test(v), "Geçerli bir T.C. Kimlik No girin");

const kisiSchema = z.object({
  adSoyad: z.string().trim().min(3, "Ad soyad en az 3 karakter olmalı"),
  tcNo: tcNoSchema,
  telefon: z.string().trim().min(10, "Geçerli bir telefon numarası girin"),
  adres: z.string().trim().min(10, "Adres en az 10 karakter olmalı"),
});

export const muvafakatnameSchema = z.object({
  muvafakatEden: kisiSchema,
  taraf: kisiSchema,
  izinVerilenKonu: z.string().trim().min(10, "İzin verilen konu en az 10 karakter olmalı"),
  kosullar: z.array(z.object({ metin: z.string().min(5, "Şart en az 5 karakter olmalı") })),
  gecerliliktarihi: z.string().min(1, "Geçerlilik tarihi seçin"),
  gecerliliktarihi_bitis: z.string().optional(),
  gecerlilikturu: z.enum(["surezli", "suressiz"]),
  iptalSartlari: z.string().trim().optional(),
});

export type MuvafakatnameData = z.infer<typeof muvafakatnameSchema>;

export const MUVAFAKATNAME_VARSAYILAN: MuvafakatnameData = {
  muvafakatEden: { adSoyad: "", tcNo: "", telefon: "", adres: "" },
  taraf: { adSoyad: "", tcNo: "", telefon: "", adres: "" },
  izinVerilenKonu: "",
  kosullar: [{ metin: "" }],
  gecerliliktarihi: "",
  gecerliliktarihi_bitis: "",
  gecerlilikturu: "suressiz",
  iptalSartlari: "",
};

export const MUVAFAKATNAME_ADIMLAR = [
  { id: "muvafakat", baslik: "Muvafakat Eden", alanlar: ["muvafakatEden"] },
  { id: "taraf", baslik: "Diğer Taraf", alanlar: ["taraf"] },
  { id: "konu", baslik: "İzin Verilen Konu", alanlar: ["izinVerilenKonu"] },
  { id: "kosullar", baslik: "Koşullar", alanlar: ["kosullar"] },
  { id: "gecerlilik", baslik: "Geçerlilik", alanlar: ["gecerliliktarihi", "gecerlilikturu"] },
  { id: "cikti", baslik: "İndir", alanlar: [] },
];

export const MUVAFAKATNAME_HAZIR: ContractTemplate<MuvafakatnameData>["hazirMaddeler"] = [
  {
    id: "bilgisizlik",
    baslik: "Bilgisizlik Kaydı",
    metin: "Taraf, muvafakatı verirken söz konusu konudan haberdar olduğunu ve gerekli danışmanlığı aldığını beyan eder.",
  },
  {
    id: "sorumluizleme",
    baslik: "Sorumluluk Reddi",
    metin: "Muvafakat Eden, verilen muvafakat nedeniyle doğacak zararlardan sorumlu tutulamaz.",
  },
  {
    id: "yetki",
    baslik: "Yetki Beyanı",
    metin: "Muvafakat Eden, bu muvafakatnameyi vermeye yasal yetki sahibi olduğunu taahhüt eder.",
  },
];
