"use client";

import { useMemo } from "react";

/**
 * Sözleşme tarihleri, dönem sonları, ve dönemsel artış takvimini hesaplar
 */
export function useContractCalculator(baslangicTarihi: string, sureMt: number) {
  return useMemo(() => {
    if (!baslangicTarihi || !sureMt || sureMt <= 0) {
      return null;
    }

    try {
      const bas = new Date(baslangicTarihi + "T00:00:00");
      if (isNaN(bas.getTime())) return null;

      // Bitiş tarihi
      const son = new Date(bas);
      son.setMonth(son.getMonth() + sureMt);

      // Yılık dönem tarihleri
      const donemler: { donemNo: number; baslangic: Date; bitis: Date; aylar: number }[] = [];
      for (let i = 0; i < Math.ceil(sureMt / 12); i++) {
        const donemBas = new Date(bas);
        donemBas.setMonth(donemBas.getMonth() + i * 12);

        const donemSon = new Date(donemBas);
        donemSon.setMonth(donemSon.getMonth() + 12);

        if (donemBas.getTime() < son.getTime()) {
          const aylar = Math.ceil(
            (Math.min(donemSon.getTime(), son.getTime()) - donemBas.getTime()) / (1000 * 60 * 60 * 24 * 30.44)
          );
          donemler.push({
            donemNo: i + 1,
            baslangic: donemBas,
            bitis: donemSon.getTime() > son.getTime() ? son : donemSon,
            aylar: Math.min(aylar, 12),
          });
        }
      }

      // Kapora ve depozito vadeleri
      const kaporaVadesi = new Date(bas);
      kaporaVadesi.setDate(kaporaVadesi.getDate() + 7);

      const depozitoBitis = new Date(son);
      depozitoBitis.setDate(depozitoBitis.getDate() + 30);

      return {
        baslangic: bas,
        bitis: son,
        toplamGun: Math.floor((son.getTime() - bas.getTime()) / (1000 * 60 * 60 * 24)),
        toplamAy: sureMt,
        donemler,
        kaporaVadesi,
        depozitoBitis,
        kaporaGunu: kaporaVadesi.getDate(),
      };
    } catch {
      return null;
    }
  }, [baslangicTarihi, sureMt]);
}

/**
 * Tarih formatı: "2026-07-24" → "24 Temmuz 2026"
 */
export function tarihBicimle(iso: string | undefined): string {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00");
  if (isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(d);
}

/**
 * Bugünün tarihi Türkçe formatında
 */
export function bugunTr(): string {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date());
}

/**
 * Benzersiz Belge No: "BLG-20260724-ABCD"
 */
export function belgeNoUret(): string {
  const d = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const rnd = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `BLG-${ymd}-${rnd}`;
}

/**
 * İki tarih arasındaki gün sayısı
 */
export function gunFarki(bas: Date, son: Date): number {
  return Math.floor((son.getTime() - bas.getTime()) / (1000 * 60 * 60 * 24));
}

/**
 * Aylar sonra tarihi döndürür
 */
export function aylarSonraTarihi(bas: Date, aylar: number): Date {
  const son = new Date(bas);
  son.setMonth(son.getMonth() + aylar);
  return son;
}
