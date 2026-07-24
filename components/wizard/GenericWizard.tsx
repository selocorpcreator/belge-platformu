"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { FormProvider, type UseFormReturn, type FieldValues } from "react-hook-form";
import { ArrowLeft, ArrowRight, ChevronLeft, Stamp } from "lucide-react";

import { useAutoSave } from "@/lib/hooks/useAutoSave";
import { useUIStore } from "@/lib/store/useUIStore";
import { PLATFORM_ADI } from "@/lib/templates/registry";

import { GenericStepper } from "@/components/wizard/GenericStepper";
import { MobileTabs } from "@/components/layout/MobileTabs";
import { Button } from "@/components/ui/Button";
import { A4Preview } from "@/components/preview/A4Preview";

type Adim = { readonly id: string; readonly baslik: string; readonly alanlar: readonly string[] };

type Props<T extends FieldValues> = {
  form: UseFormReturn<T>;
  baslik: string;
  storageKey: string;
  adimlar: readonly Adim[];
  /** Aktif adımın form içeriğini döndürür (son adım = çıktı adımı) */
  adimIcerik: (adim: number, onSifirla: () => void) => ReactNode;
  /** Canlı A4 belge bileşeni */
  belge: ReactNode;
  varsayilan: T;
};

/**
 * Kira sayfasındaki split-screen sihirbazın parametreli sürümü.
 * Mevcut kira-sozlesmesi sayfasına dokunulmadan yeni belge türleri için kullanılır.
 * Canlı önizleme her adımda anlık güncellenir; son adımda serbest düzenleme açılabilir.
 */
export function GenericWizard<T extends FieldValues>({
  form,
  baslik,
  storageKey,
  adimlar,
  adimIcerik,
  belge,
  varsayilan,
}: Props<T>) {
  const { sekme, setDuzenlemeModu } = useUIStore();
  const [adim, setAdim] = useState(0);

  // Sayfa açılışında düzenleme modunu kapat (başka belgeden kalmasın)
  useEffect(() => {
    setDuzenlemeModu(false);
  }, [setDuzenlemeModu]);

  useAutoSave(form, storageKey);

  const sonAdim = adimlar.length - 1;

  async function ileri() {
    const alanlar = adimlar[adim].alanlar as unknown as Parameters<typeof form.trigger>[0];
    const gecerli =
      (adimlar[adim].alanlar.length === 0) || (await form.trigger(alanlar));
    if (gecerli) setAdim((a) => Math.min(a + 1, sonAdim));
  }

  function sifirla() {
    form.reset(varsayilan);
    setDuzenlemeModu(false);
    setAdim(0);
  }

  return (
    <FormProvider {...form}>
      <div className="flex h-dvh flex-col">
        {/* Üst bar */}
        <header className="flex items-center justify-between border-b border-cizgi bg-white px-5 py-3 print:hidden">
          <Link href="/" className="flex items-center gap-2 text-lacivert">
            <ChevronLeft size={18} />
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-lacivert text-white">
              <Stamp size={14} />
            </span>
            <span className="text-sm font-bold tracking-tight">{PLATFORM_ADI}</span>
          </Link>
          <span className="text-sm font-medium text-soluk">{baslik}</span>
        </header>

        <div className="flex min-h-0 flex-1">
          {/* SOL PANEL — Form / Wizard */}
          <section
            aria-label="Belge formu"
            className={`w-full flex-col overflow-y-auto border-r border-cizgi bg-white pb-8 lg:flex lg:w-[440px] xl:w-[500px]
              ${sekme === "form" ? "flex" : "hidden"} print:hidden`}
          >
            <GenericStepper adimlar={adimlar} adim={adim} onAdimSec={setAdim} />

            <div className="flex-1 px-5 pt-5">{adimIcerik(adim, sifirla)}</div>

            {adim < sonAdim && (
              <div className="mt-6 flex gap-3 px-5">
                <Button type="button" varyant="hayalet" disabled={adim === 0} onClick={() => setAdim(adim - 1)}>
                  <ArrowLeft size={16} /> Geri
                </Button>
                <Button type="button" className="flex-1" onClick={ileri}>
                  Devam Et <ArrowRight size={16} />
                </Button>
              </div>
            )}
            {adim === sonAdim && (
              <div className="mt-6 px-5">
                <Button type="button" varyant="hayalet" onClick={() => setAdim(adim - 1)}>
                  <ArrowLeft size={16} /> Geri
                </Button>
              </div>
            )}
          </section>

          {/* SAĞ PANEL — Canlı A4 Önizleme */}
          <section
            aria-label="Canlı önizleme"
            className={`min-h-0 flex-1 overflow-y-auto bg-zemin p-4 lg:block lg:p-8
              ${sekme === "onizleme" ? "block" : "hidden"}`}
          >
            <A4Preview>{belge}</A4Preview>
            <p className="mt-4 pb-6 text-center text-xs text-soluk print:hidden">
              Önizleme, formu doldurdukça anlık güncellenir · Veriler yalnızca bu tarayıcıda saklanır
            </p>
          </section>
        </div>

        <MobileTabs />
      </div>
    </FormProvider>
  );
}
