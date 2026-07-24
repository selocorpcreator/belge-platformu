"use client";

import Link from "next/link";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, ChevronLeft, Stamp } from "lucide-react";

import {
  kiraSozlesmesiSchema,
  KIRA_VARSAYILAN,
  KIRA_ADIMLARI,
  type KiraSozlesmesiData,
} from "@/lib/schemas/kiraSozlesmesi";
import { useAutoSave } from "@/lib/hooks/useAutoSave";
import { useUIStore } from "@/lib/store/useUIStore";
import { PLATFORM_ADI } from "@/lib/templates/registry";

import { Stepper } from "@/components/stepper/Stepper";
import { MobileTabs } from "@/components/layout/MobileTabs";
import { Button } from "@/components/ui/Button";
import { A4Preview } from "@/components/preview/A4Preview";
import { KiraSozlesmesiDoc } from "@/components/preview/KiraSozlesmesiDoc";

import { TasinmazStep } from "@/components/forms/kira/TasinmazStep";
import { KisiStep } from "@/components/forms/kira/KisiStep";
import { FinansalStep } from "@/components/forms/kira/FinansalStep";
import { OzelSartlarStep } from "@/components/forms/kira/OzelSartlarStep";
import { CiktiStep } from "@/components/forms/kira/CiktiStep";

const STORAGE_KEY = "belge:kira-sozlesmesi:v1";

export default function KiraSozlesmesiSayfasi() {
  const { adim, setAdim, sekme, setSekme, setDuzenlemeModu } = useUIStore();

  const form = useForm<KiraSozlesmesiData>({
    resolver: zodResolver(kiraSozlesmesiSchema),
    defaultValues: KIRA_VARSAYILAN,
    mode: "onTouched",
  });

  useAutoSave(form, STORAGE_KEY);

  const sonAdim = KIRA_ADIMLARI.length - 1;

  async function ileri() {
    const alanlar = KIRA_ADIMLARI[adim].alanlar as unknown as (keyof KiraSozlesmesiData)[];
    const gecerli = alanlar.length === 0 || (await form.trigger(alanlar));
    if (gecerli) setAdim(Math.min(adim + 1, sonAdim));
  }

  function sifirla() {
    form.reset(KIRA_VARSAYILAN);
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
          <span className="text-sm font-medium text-soluk">Konut Kira Sözleşmesi</span>
        </header>

        <div className="flex min-h-0 flex-1">
          {/* SOL PANEL — Form / Wizard */}
          <section
            aria-label="Belge formu"
            className={`w-full flex-col overflow-y-auto border-r border-cizgi bg-white pb-8 lg:flex lg:w-[440px] xl:w-[500px]
              ${sekme === "form" ? "flex" : "hidden"} print:hidden`}
          >
            <Stepper />

            <div className="flex-1 px-5 pt-5">
              {adim === 0 && <TasinmazStep />}
              {adim === 1 && <KisiStep taraf="kirayaVeren" />}
              {adim === 2 && <KisiStep taraf="kiraci" />}
              {adim === 3 && <FinansalStep />}
              {adim === 4 && <OzelSartlarStep />}
              {adim === 5 && <CiktiStep storageKey={STORAGE_KEY} onSifirla={sifirla} />}
            </div>

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
            <A4Preview>
              <KiraSozlesmesiDoc />
            </A4Preview>
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
