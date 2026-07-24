import type { ZodSchema } from "zod";
import type { ReactNode } from "react";
import type { UseFormReturn, FieldValues } from "react-hook-form";

/**
 * Genel sözleşme şablon tipi
 * Tüm belge türleri bu arayüzü implement eder
 */
export interface ContractTemplate<T extends FieldValues = Record<string, unknown>> {
  // Meta
  id: string;
  ad: string;
  aciklama: string;
  kategori: string;
  ikon: "home" | "mail-warning" | "shield" | "file-signature" | "stamp" | "check";
  slug: string;
  aktif: boolean;
  sira: number;

  // Şema ve varsayılanlar
  schema: ZodSchema;
  varsayilanDegerler: T;

  // Form adımları (wizard)
  adimlar: {
    id: string;
    baslik: string;
    alanlar: (keyof T)[];
  }[];

  // Hazır maddeler kütüphanesi
  hazirMaddeler: {
    id: string;
    baslik: string;
    metin: string;
  }[];

  // Dinamik bileşenler
  formBilesenler: Record<string, React.ComponentType<{ form: UseFormReturn<T> }>>;
  belgeBilesen: React.ComponentType<{ veri: T; duzenlemeModu?: boolean }>;

  // Metadata
  kahangiVeriAlaniBugununMuhur?: (veri: T) => string;
  kahangiVeriAlaniTarih?: (veri: T) => string;
}

/**
 * Sözleşme türleri (kolay seçim için)
 */
export type ContractType = "kira-sozlesmesi" | "ihtarname" | "muvafakatname" | "gizlilik-sozlesmesi";

/**
 * Madde ekleme/silme için generic hook
 */
export type ClauseManagerOptions = {
  onEkle?: (madde: string) => void;
  onSil?: (indeks: number) => void;
  onTasiYukari?: (indeks: number) => void;
  onTasiAsagi?: (indeks: number) => void;
  onDuzelt?: (indeks: number, metin: string) => void;
};
