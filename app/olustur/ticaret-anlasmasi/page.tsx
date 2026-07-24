"use client";

import { useForm, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  ticaretAnlasmasiSchema,
  TICARET_VARSAYILAN,
  TICARET_ADIMLAR,
  type TicaretAnlasmasiData,
} from "@/lib/schemas/ticaretAnlasmasi";
import { GenericWizard } from "@/components/wizard/GenericWizard";
import { TarafStep, ListeStep, GenelCiktiStep } from "@/components/forms/ortak/OrtakAdimlar";
import { TicaretAnlasmasiDoc } from "@/components/preview/TicaretAnlasmasiDoc";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { getError } from "@/lib/utils/getError";

const STORAGE_KEY = "belge:ticaret-anlasmasi:v1";

function TurKonuStep() {
  const { register, formState: { errors } } = useFormContext<TicaretAnlasmasiData>();
  const e = (p: string) => getError(errors as Record<string, unknown>, p);
  return (
    <div className="space-y-4">
      <Field label="Sözleşme Türü">
        <Select {...register("tur")}>
          <option value="hizmet">Hizmet Sözleşmesi</option>
          <option value="satis">Satış Sözleşmesi</option>
        </Select>
      </Field>
      <Field label="Sözleşmenin Konusu" error={e("konu")}>
        <Textarea rows={4} placeholder="Verilecek hizmeti veya satılacak malı ayrıntılı yazın…" hata={!!e("konu")} {...register("konu")} />
      </Field>
    </div>
  );
}

function FinansStep() {
  const { register, formState: { errors } } = useFormContext<TicaretAnlasmasiData>();
  const e = (p: string) => getError(errors as Record<string, unknown>, p);
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Bedel (₺)" error={e("bedel")}>
          <Input type="number" min={0} step="0.01" hata={!!e("bedel")} {...register("bedel")} />
        </Field>
        <Field label="KDV">
          <Select {...register("kdvDahil")}>
            <option value="haric">KDV Hariç</option>
            <option value="dahil">KDV Dahil</option>
          </Select>
        </Field>
      </div>
      <Field label="Ödeme Planı">
        <Select {...register("odemePlani")}>
          <option value="pesin">Peşin</option>
          <option value="taksit">Taksitli</option>
          <option value="teslimde">Teslimde</option>
          <option value="aylik">Aylık</option>
        </Select>
      </Field>
      <Field label="Ödeme Detayı (opsiyonel)">
        <Input placeholder="Örn: %50 peşin, %50 teslimde" {...register("odemeDetay")} />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Başlangıç Tarihi" error={e("baslangicTarihi")}>
          <Input type="date" hata={!!e("baslangicTarihi")} {...register("baslangicTarihi")} />
        </Field>
        <Field label="Teslim Süresi (gün)" error={e("teslimSuresiGun")}>
          <Input type="number" min={1} hata={!!e("teslimSuresiGun")} {...register("teslimSuresiGun")} />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Gecikme Faizi">
          <Select {...register("gecikmeFaizi")}>
            <option value="yasal">Yasal faiz uygulansın</option>
            <option value="yok">Uygulanmasın</option>
          </Select>
        </Field>
        <Field label="Cezai Şart (₺, opsiyonel)" error={e("cezaiSart")}>
          <Input type="number" min={0} step="0.01" {...register("cezaiSart")} />
        </Field>
      </div>
      <Field label="Yetkili Mahkeme (il)" error={e("yetkiliYer")}>
        <Input placeholder="Örn: Hatay" hata={!!e("yetkiliYer")} {...register("yetkiliYer")} />
      </Field>
    </div>
  );
}

export default function TicaretAnlasmasiSayfasi() {
  const form = useForm<TicaretAnlasmasiData>({
    resolver: zodResolver(ticaretAnlasmasiSchema),
    defaultValues: TICARET_VARSAYILAN,
    mode: "onTouched",
  });

  return (
    <GenericWizard
      form={form}
      baslik="Ticari Hizmet / Satış Anlaşması"
      storageKey={STORAGE_KEY}
      adimlar={TICARET_ADIMLAR}
      varsayilan={TICARET_VARSAYILAN}
      belge={<TicaretAnlasmasiDoc />}
      adimIcerik={(adim, sifirla) => (
        <>
          {adim === 0 && <TurKonuStep />}
          {adim === 1 && <TarafStep yol="saglayici" tuzelDestek />}
          {adim === 2 && <TarafStep yol="alici" tuzelDestek />}
          {adim === 3 && <FinansStep />}
          {adim === 4 && (
            <ListeStep yol="ozelSartlar" etiket="Özel Şart" ekleMetni="Özel Şart Ekle" placeholder="Özel şart metni…" />
          )}
          {adim === 5 && (
            <GenelCiktiStep storageKey={STORAGE_KEY} pdfDosyaAdi="ticari-sozlesme.pdf" onSifirla={sifirla} />
          )}
        </>
      )}
    />
  );
}
