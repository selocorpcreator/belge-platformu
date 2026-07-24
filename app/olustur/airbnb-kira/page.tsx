"use client";

import { useForm, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Info } from "lucide-react";

import {
  airbnbSchema,
  AIRBNB_VARSAYILAN,
  AIRBNB_ADIMLAR,
  konaklamaHesapla,
  type AirbnbData,
} from "@/lib/schemas/airbnb";
import { GenericWizard } from "@/components/wizard/GenericWizard";
import { TarafStep, ListeStep, GenelCiktiStep } from "@/components/forms/ortak/OrtakAdimlar";
import { AirbnbDoc } from "@/components/preview/AirbnbDoc";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { getError } from "@/lib/utils/getError";
import { tutarBicimle } from "@/lib/utils/sayiyiYaziyaCevir";

const STORAGE_KEY = "belge:airbnb-kira:v1";

function TasinmazStep() {
  const { register, formState: { errors } } = useFormContext<AirbnbData>();
  const e = (p: string) => getError(errors as Record<string, unknown>, p);
  return (
    <div className="space-y-4">
      <p className="flex items-start gap-2 rounded-lg border border-lacivert/20 bg-lacivert/5 p-3 text-xs leading-relaxed text-metin">
        <Info size={15} className="mt-0.5 shrink-0 text-lacivert" />
        <span>
          <strong>7464 sayılı Kanun:</strong> Konutunuzu 100 günden kısa süreyle kiralamak için Kültür
          ve Turizm Bakanlığından <strong>turizm amaçlı kiralama izin belgesi</strong> almanız zorunludur.
          Belgesiz kiralamada idari para cezası uygulanır.
        </span>
      </p>
      <Field label="Açık Adres" error={e("tasinmaz.adres")}>
        <Textarea rows={2} placeholder="Mahalle, sokak, bina ve daire no" hata={!!e("tasinmaz.adres")} {...register("tasinmaz.adres")} />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="İlçe" error={e("tasinmaz.ilce")}>
          <Input hata={!!e("tasinmaz.ilce")} {...register("tasinmaz.ilce")} />
        </Field>
        <Field label="İl" error={e("tasinmaz.il")}>
          <Input hata={!!e("tasinmaz.il")} {...register("tasinmaz.il")} />
        </Field>
      </div>
      <Field label="Turizm Amaçlı Kiralama İzin Belgesi No" error={e("tasinmaz.izinBelgesiNo")}>
        <Input placeholder="Bakanlıktan alınan izin belgesi numarası" hata={!!e("tasinmaz.izinBelgesiNo")} {...register("tasinmaz.izinBelgesiNo")} />
      </Field>
    </div>
  );
}

function KonaklamaStep() {
  const { register, watch, formState: { errors } } = useFormContext<AirbnbData>();
  const e = (p: string) => getError(errors as Record<string, unknown>, p);
  const konaklama = watch("konaklama");
  const { gece, toplam } = konaklamaHesapla(konaklama ?? AIRBNB_VARSAYILAN.konaklama);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Giriş Tarihi" error={e("konaklama.girisTarihi")}>
          <Input type="date" hata={!!e("konaklama.girisTarihi")} {...register("konaklama.girisTarihi")} />
        </Field>
        <Field label="Çıkış Tarihi" error={e("konaklama.cikisTarihi")}>
          <Input type="date" hata={!!e("konaklama.cikisTarihi")} {...register("konaklama.cikisTarihi")} />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Giriş Saati" error={e("konaklama.girisSaati")}>
          <Input type="time" hata={!!e("konaklama.girisSaati")} {...register("konaklama.girisSaati")} />
        </Field>
        <Field label="Çıkış Saati" error={e("konaklama.cikisSaati")}>
          <Input type="time" hata={!!e("konaklama.cikisSaati")} {...register("konaklama.cikisSaati")} />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Misafir Sayısı" error={e("konaklama.misafirSayisi")}>
          <Input type="number" min={1} max={30} hata={!!e("konaklama.misafirSayisi")} {...register("konaklama.misafirSayisi")} />
        </Field>
        <Field label="Gecelik Ücret (₺)" error={e("konaklama.gecelikUcret")}>
          <Input type="number" min={0} step="0.01" hata={!!e("konaklama.gecelikUcret")} {...register("konaklama.gecelikUcret")} />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Temizlik Ücreti (₺)" error={e("konaklama.temizlikUcreti")}>
          <Input type="number" min={0} step="0.01" {...register("konaklama.temizlikUcreti")} />
        </Field>
        <Field label="Depozito (₺)" error={e("konaklama.depozito")}>
          <Input type="number" min={0} step="0.01" {...register("konaklama.depozito")} />
        </Field>
      </div>
      {gece > 0 && (
        <p className="rounded-lg bg-lacivert/5 p-3 text-sm text-metin">
          <strong>{gece} gece</strong> · Toplam: <strong>{tutarBicimle(toplam)}</strong>
        </p>
      )}
    </div>
  );
}

export default function AirbnbSayfasi() {
  const form = useForm<AirbnbData>({
    resolver: zodResolver(airbnbSchema),
    defaultValues: AIRBNB_VARSAYILAN,
    mode: "onTouched",
  });

  return (
    <GenericWizard
      form={form}
      baslik="Kısa Süreli (Airbnb) Kiralama Sözleşmesi"
      storageKey={STORAGE_KEY}
      adimlar={AIRBNB_ADIMLAR}
      varsayilan={AIRBNB_VARSAYILAN}
      belge={<AirbnbDoc />}
      adimIcerik={(adim, sifirla) => (
        <>
          {adim === 0 && <TasinmazStep />}
          {adim === 1 && <TarafStep yol="evSahibi" />}
          {adim === 2 && <TarafStep yol="misafir" />}
          {adim === 3 && <KonaklamaStep />}
          {adim === 4 && (
            <ListeStep yol="evKurallari" etiket="Kural" ekleMetni="Kural Ekle" placeholder="Ev kuralı…" />
          )}
          {adim === 5 && (
            <GenelCiktiStep storageKey={STORAGE_KEY} pdfDosyaAdi="kisa-sureli-kiralama.pdf" onSifirla={sifirla} />
          )}
        </>
      )}
    />
  );
}
