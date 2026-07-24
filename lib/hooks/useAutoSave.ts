"use client";

import { useEffect, useRef, useState } from "react";
import type { UseFormReturn, FieldValues } from "react-hook-form";

type UseAutoSaveOptions = {
  debounceMs?: number;
  onTaslakBulundu?: () => void;
};

/**
 * Form verisini debounce ile localStorage'a yazar.
 * Sayfa yenilendiğinde kayıtlı taslağı geri yükler.
 */
export function useAutoSave<T extends FieldValues>(
  form: UseFormReturn<T>,
  storageKey: string,
  options?: UseAutoSaveOptions
) {
  const yuklendi = useRef(false);
  const [taslakBulundu, setTaslakBulundu] = useState(false);

  const debounceMs = options?.debounceMs ?? 2000;

  // Taslak algıla ve yükle
  useEffect(() => {
    if (yuklendi.current) return;
    yuklendi.current = true;

    try {
      const kayit = localStorage.getItem(storageKey);
      if (kayit) {
        setTaslakBulundu(true);
        options?.onTaslakBulundu?.();
        form.reset(JSON.parse(kayit));
      }
    } catch {
      // Bozuk veri yok sayılır
    }
  }, [form, storageKey, options]);

  // Değişiklikleri kaydet (debounce)
  useEffect(() => {
    let zamanlayici: ReturnType<typeof setTimeout>;
    const abonelik = form.watch((deger) => {
      clearTimeout(zamanlayici);
      zamanlayici = setTimeout(() => {
        try {
          localStorage.setItem(storageKey, JSON.stringify(deger));
        } catch {
          // Kota dolarsa sessiz geç
        }
      }, debounceMs);
    });
    return () => {
      clearTimeout(zamanlayici);
      abonelik.unsubscribe();
    };
  }, [form, storageKey, debounceMs]);

  const taslakSil = () => {
    localStorage.removeItem(storageKey);
    setTaslakBulundu(false);
  };

  return {
    taslakBulundu,
    taslakSil,
  };
}
