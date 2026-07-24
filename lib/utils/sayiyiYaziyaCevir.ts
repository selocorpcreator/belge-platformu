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

/** 35000 -> "OtuzBeşBin" */
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
    if (i === 1 && g === 1) sonuc += "Bin"; // "BirBin" denmez
    else sonuc += ucBasamakYaz(g) + BASAMAKLAR[i];
  }
  return sonuc;
}

/** 35000.5 -> "Yalnız OtuzBeşBin Türk Lirası Elli Kuruş" */
export function tutarYaziyaCevir(tutar: number): string {
  if (!Number.isFinite(tutar) || tutar <= 0) return "";
  const tam = Math.floor(tutar);
  const kurus = Math.round((tutar - tam) * 100);
  let s = "Yalnız " + sayiyiYaziyaCevir(tam) + " Türk Lirası";
  if (kurus > 0) s += " " + sayiyiYaziyaCevir(kurus) + " Kuruş";
  return s;
}

/** 35000 -> "₺35.000,00" */
export function tutarBicimle(tutar: number): string {
  if (!Number.isFinite(tutar)) return "";
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 2,
  }).format(tutar);
}
