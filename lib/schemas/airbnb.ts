import { z } from "zod";

const tcNoSchema = z
  .string()
  .trim()
  .refine((v) => v === "" || /^\d{10,11}$/.test(v), "Geçerli bir kimlik / pasaport no girin");

const kisiSchema = z.object({
  adSoyad: z.string().trim().min(3, "Ad soyad en az 3 karakter olmalı"),
  tcNo: tcNoSchema,
  telefon: z.string().trim().min(10, "Geçerli bir telefon numarası girin"),
  adres: z.string().trim().min(10, "Adres en az 10 karakter olmalı"),
});

export const airbnbSchema = z
  .object({
    evSahibi: kisiSchema,
    misafir: kisiSchema,
    tasinmaz: z.object({
      adres: z.string().trim().min(10, "Açık adres en az 10 karakter olmalı"),
      ilce: z.string().trim().min(2, "İlçe girin"),
      il: z.string().trim().min(2, "İl girin"),
      /** 7464 sayılı Kanun uyarınca zorunlu turizm amaçlı kiralama izin belgesi */
      izinBelgesiNo: z.string().trim().min(3, "İzin belgesi numarası girin (7464 sayılı Kanun gereği zorunlu)"),
    }),
    konaklama: z.object({
      girisTarihi: z.string().min(1, "Giriş tarihi seçin"),
      cikisTarihi: z.string().min(1, "Çıkış tarihi seçin"),
      misafirSayisi: z.coerce.number().int().min(1, "En az 1 misafir").max(30, "En fazla 30 misafir"),
      gecelikUcret: z.coerce.number().positive("Gecelik ücret 0'dan büyük olmalı"),
      temizlikUcreti: z.coerce.number().min(0, "Negatif olamaz"),
      depozito: z.coerce.number().min(0, "Negatif olamaz"),
      girisSaati: z.string().trim().min(1, "Giriş saati girin"),
      cikisSaati: z.string().trim().min(1, "Çıkış saati girin"),
    }),
    evKurallari: z.array(z.object({ metin: z.string().trim().min(3, "Kural en az 3 karakter olmalı") })),
  })
  .refine(
    (d) => {
      if (!d.konaklama.girisTarihi || !d.konaklama.cikisTarihi) return true;
      const giris = new Date(d.konaklama.girisTarihi);
      const cikis = new Date(d.konaklama.cikisTarihi);
      const gun = Math.round((cikis.getTime() - giris.getTime()) / 86400000);
      return gun >= 1 && gun <= 100;
    },
    {
      message: "Konaklama 1–100 gece arası olmalı (100 günü aşan kiralamalar 7464 sayılı Kanun kapsamı dışındadır)",
      path: ["konaklama", "cikisTarihi"],
    }
  );

export type AirbnbData = z.infer<typeof airbnbSchema>;

export const AIRBNB_VARSAYILAN: AirbnbData = {
  evSahibi: { adSoyad: "", tcNo: "", telefon: "", adres: "" },
  misafir: { adSoyad: "", tcNo: "", telefon: "", adres: "" },
  tasinmaz: { adres: "", ilce: "", il: "", izinBelgesiNo: "" },
  konaklama: {
    girisTarihi: "",
    cikisTarihi: "",
    misafirSayisi: 2,
    gecelikUcret: 0,
    temizlikUcreti: 0,
    depozito: 0,
    girisSaati: "14:00",
    cikisSaati: "11:00",
  },
  evKurallari: [
    { metin: "Konutta sigara içilmesi yasaktır." },
    { metin: "Gece 22:00'den sonra yüksek sesle müzik çalınamaz." },
  ],
};

export const AIRBNB_ADIMLAR = [
  { id: "tasinmaz", baslik: "Taşınmaz ve İzin Belgesi", alanlar: ["tasinmaz"] },
  { id: "evSahibi", baslik: "Ev Sahibi (Kiraya Veren)", alanlar: ["evSahibi"] },
  { id: "misafir", baslik: "Misafir (Kiracı)", alanlar: ["misafir"] },
  { id: "konaklama", baslik: "Konaklama ve Ücretler", alanlar: ["konaklama"] },
  { id: "kurallar", baslik: "Ev Kuralları", alanlar: ["evKurallari"] },
  { id: "cikti", baslik: "İndir", alanlar: [] },
] as const;

/** Gece sayısı ve toplam tutar hesaplama */
export function konaklamaHesapla(d: AirbnbData["konaklama"]) {
  let gece = 0;
  if (d.girisTarihi && d.cikisTarihi) {
    const fark = new Date(d.cikisTarihi).getTime() - new Date(d.girisTarihi).getTime();
    gece = Math.max(0, Math.round(fark / 86400000));
  }
  const konaklamaTutari = gece * (Number(d.gecelikUcret) || 0);
  const toplam = konaklamaTutari + (Number(d.temizlikUcreti) || 0);
  return { gece, konaklamaTutari, toplam };
}
