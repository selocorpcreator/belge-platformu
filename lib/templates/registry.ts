export const PLATFORM_ADI = "KolayBelgeAl";

/** 4 ana kategori — ana sayfa bu sıraya göre listeler */
export const KATEGORILER = [
  "Emlak & Konaklama",
  "Hukuki Bildirimler",
  "Ticari Sözleşmeler",
  "İzin & Muvafakat",
] as const;

export type Kategori = (typeof KATEGORILER)[number];

export type SablonTanimi = {
  slug: string;
  ad: string;
  aciklama: string;
  kategori: Kategori;
  ikon: "home" | "mail-warning" | "shield" | "file-signature" | "stamp" | "check" | "briefcase" | "key";
  aktif: boolean;
  sira: number;
};

export const SABLONLAR: SablonTanimi[] = [
  {
    slug: "kira-sozlesmesi",
    ad: "Konut / İş Yeri Kira Sözleşmesi",
    aciklama: "TBK'ya uygun; taraflar, kira bedeli ve özel şartlarla eksiksiz kira kontratı.",
    kategori: "Emlak & Konaklama",
    ikon: "home",
    aktif: true,
    sira: 1,
  },
  {
    slug: "airbnb-kira",
    ad: "Kısa Süreli (Airbnb) Kiralama",
    aciklama: "7464 sayılı Kanun'a uygun turizm amaçlı kısa süreli konut kiralama sözleşmesi.",
    kategori: "Emlak & Konaklama",
    ikon: "key",
    aktif: true,
    sira: 2,
  },
  {
    slug: "ihtarname",
    ad: "İhtarname",
    aciklama: "Karşı tarafa resmi bildirimde bulunmak için ihtarname metni oluşturun.",
    kategori: "Hukuki Bildirimler",
    ikon: "mail-warning",
    aktif: true,
    sira: 3,
  },
  {
    slug: "ibraname",
    ad: "İbraname",
    aciklama: "İş ilişkisi veya genel alacak-borç için TBK m.420'ye uygun ibraname.",
    kategori: "Hukuki Bildirimler",
    ikon: "file-signature",
    aktif: true,
    sira: 4,
  },
  {
    slug: "ticaret-anlasmasi",
    ad: "Ticari Hizmet / Satış Anlaşması",
    aciklama: "Bedel, teslim, fesih ve gecikme şartlarıyla ticari sözleşme hazırlayın.",
    kategori: "Ticari Sözleşmeler",
    ikon: "briefcase",
    aktif: true,
    sira: 5,
  },
  {
    slug: "gizlilik-sozlesmesi",
    ad: "Gizlilik Sözleşmesi (NDA)",
    aciklama: "Tek taraflı veya karşılıklı gizlilik; cezai şart ve KVKK uyumlu.",
    kategori: "Ticari Sözleşmeler",
    ikon: "shield",
    aktif: true,
    sira: 6,
  },
  {
    slug: "muvafakatname",
    ad: "Muvafakatname",
    aciklama: "İzin verilen konu ve koşulları belgeleyen muvafakat sözleşmesi.",
    kategori: "İzin & Muvafakat",
    ikon: "check",
    aktif: true,
    sira: 7,
  },
];

export function sablonBul(slug: string): SablonTanimi | undefined {
  return SABLONLAR.find((s) => s.slug === slug);
}

export function aktifSablonlar(): SablonTanimi[] {
  return SABLONLAR.filter((s) => s.aktif).sort((a, b) => a.sira - b.sira);
}

/** 4 ana başlık sırası korunarak gruplar */
export function kategoriyeGoreGrupla(): [Kategori, SablonTanimi[]][] {
  return KATEGORILER.map((k) => [
    k,
    SABLONLAR.filter((s) => s.aktif && s.kategori === k).sort((a, b) => a.sira - b.sira),
  ]);
}
