/**
 * Türkçe Sayı-Metin Dönüşüm Kütüphanesi
 * 15450.50 → "OnBeşBinDörtYüzElliTürkLirası ElliKuruş"
 */

const BIRLER = ["", "Bir", "İki", "Üç", "Dört", "Beş", "Altı", "Yedi", "Sekiz", "Dokuz"];
const ONLAR = ["", "On", "Yirmi", "Otuz", "Kırk", "Elli", "Altmış", "Yetmiş", "Seksen", "Doksan"];
const BASAMAKLAR = ["", "Bin", "Milyon", "Milyar", "Trilyon"];

function ucBasamakYaz(n: number): string {
  let s = "";
  const yuzler = Math.floor(n / 100);
  const kalan = n % 100;
  if (yuzler > 0) s += (yuzler > 1 ? BIRLER[yuzler] : "") + "Yüz";
  s += ONLAR[Math.floor(kalan / 10)] + BIRLER[kalan % 10];
  return s;
}

/**
 * Bir sayıyı Türkçe okunuşa çevirir.
 * @param sayi Dönüştürülecek sayı
 * @returns Türkçe okunuş (örn: "OnBeşBin")
 */
export function sayiyiYaziyaCevir(sayi: number): string {
  if (!Number.isFinite(sayi)) return "";
  const tam = Math.floor(Math.abs(sayi));
  if (tam === 0) return "Sıfır";

  const gruplar: number[] = [];
  let t = tam;
  while (t > 0) {
    gruplar.push(t % 1000);
    t = Math.floor(t / 1000);
  }

  let sonuc = "";
  for (let i = gruplar.length - 1; i >= 0; i--) {
    const g = gruplar[i];
    if (g === 0) continue;
    if (i === 1 && g === 1) sonuc += "Bin";
    else sonuc += ucBasamakYaz(g) + BASAMAKLAR[i];
  }
  return sonuc;
}

/**
 * Tutarı "Yalnız ... Türk Lirası ... Kuruş" formatında yazar.
 * @param tutar Dönüştürülecek tutar (örn: 35000.50)
 * @returns "Yalnız OtuzBeşBin Türk Lirası ElliKuruş"
 */
export function tutarYaziyaCevir(tutar: number): string {
  if (!Number.isFinite(tutar) || tutar <= 0) return "";
  const tam = Math.floor(tutar);
  const kurus = Math.round((tutar - tam) * 100);
  let s = "Yalnız " + sayiyiYaziyaCevir(tam) + " Türk Lirası";
  if (kurus > 0) s += " " + sayiyiYaziyaCevir(kurus) + " Kuruş";
  return s;
}

/**
 * Tutarı para birimi formatında gösterir.
 * @param tutar Dönüştürülecek tutar
 * @returns "₺35.000,00"
 */
export function tutarBicimle(tutar: number): string {
  if (!Number.isFinite(tutar)) return "";
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 2,
  }).format(tutar);
}

/**
 * Yüzde hesapla ve Türkçe yaz
 * @param ana Temel tutar
 * @param yuzde Yüzde oranı
 * @returns { tam, kurus, yazili }
 */
export function yuzdeHesapla(ana: number, yuzde: number) {
  const sonuc = (ana * yuzde) / 100;
  const tam = Math.floor(sonuc);
  const kurus = Math.round((sonuc - tam) * 100);
  return {
    tam,
    kurus,
    sonuc,
    yazili: `${tutarBicimle(sonuc)} (${tutarYaziyaCevir(sonuc)})`,
  };
}

/**
 * Bileşik faiz hesapla
 */
export function faizHesapla(ana: number, yillikFaiz: number, aylar: number) {
  const aylikFaiz = yillikFaiz / 12 / 100;
  const tutar = ana * Math.pow(1 + aylikFaiz, aylar);
  const faiz = tutar - ana;
  return { tutar, faiz, yazili: tutarYaziyaCevir(tutar) };
}
