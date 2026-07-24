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

export const ihtarnameSchema = z.object({
  ihtatEden: kisiSchema,
  muhatap: kisiSchema,
  ihtarKonusu: z.string().trim().min(10, "İhtar konusu en az 10 karakter olmalı"),
  ihtarOlaylar: z.array(z.object({ metin: z.string().min(5, "Olay açıklaması en az 5 karakter olmalı") })),
  talep: z.string().trim().min(10, "Talep en az 10 karakter olmalı"),
  talipSure: z.coerce.number().int().min(1, "En az 1 gün").max(365, "En fazla 365 gün"),
  tebligatSekli: z.enum(["posta", "elden", "emniyetveri", "diger"]),
  diger: z.string().trim().optional(),
});

export type IhtarnameData = z.infer<typeof ihtarnameSchema>;

export const IHTARNAME_VARSAYILAN: IhtarnameData = {
  ihtatEden: { adSoyad: "", tcNo: "", telefon: "", adres: "" },
  muhatap: { adSoyad: "", tcNo: "", telefon: "", adres: "" },
  ihtarKonusu: "",
  ihtarOlaylar: [{ metin: "" }],
  talep: "",
  talipSure: 15,
  tebligatSekli: "posta",
  diger: "",
};

export const IHTARNAME_ADIMLAR = [
  { id: "eden", baslik: "İhtar Eden", alanlar: ["ihtatEden"] },
  { id: "muhatap", baslik: "Muhatap", alanlar: ["muhatap"] },
  { id: "konu", baslik: "Konu ve Olaylar", alanlar: ["ihtarKonusu", "ihtarOlaylar"] },
  { id: "talep", baslik: "Talep ve Süre", alanlar: ["talep", "talipSure", "tebligatSekli"] },
  { id: "cikti", baslik: "İndir", alanlar: [] },
];

export const IHTARNAME_HAZIR: ContractTemplate<IhtarnameData>["hazirMaddeler"] = [
  {
    id: "protesto",
    baslik: "Protesto Beyanı",
    metin: "Muhatap, bu ihtarnamede belirtilen hususlara karşı itiraz etmeyi ve hukuki yolları kullanmayı saklı tutar.",
  },
  {
    id: "adli-yardim",
    baslik: "Adli Yardım Açıklaması",
    metin: "İhtar Eden, muhataptan herhangi bir karşı talep bulunması halinde adli yardım isteyebilir.",
  },
  {
    id: "faiz-bilgisi",
    baslik: "Yasal Faiz Uyarısı",
    metin: "Talep edilen tutar ödenmez ise, yasal faiz hükümleri uygulanacaktır.",
  },
];
