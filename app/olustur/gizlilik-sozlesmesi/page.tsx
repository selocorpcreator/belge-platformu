"use client";

import { useForm, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { ndaSchema, NDA_VARSAYILAN, NDA_ADIMLAR, type NdaData } from "@/lib/schemas/nda";
import { GenericWizard } from "@/components/wizard/GenericWizard";
import { TarafStep, ListeStep, GenelCiktiStep } from "@/components/forms/ortak/OrtakAdimlar";
import { NdaDoc } from "@/components/preview/NdaDoc";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { getError } from "@/lib/utils/getError";

const STORAGE_KEY = "belge:nda:v1";

function TurAmacStep() {
  const { register, formState: { errors } } = useFormContext<NdaData>();
  const e = (p: string) => getError(errors as Record<string, unknown>, p);
  return (
    <div className="space-y-4">
      <Field label="Gizlilik Türü">
        <Select {...register("tur")}>
          <option value="karsilikli">Karşılıklı (iki taraf da bilgi paylaşır)</option>
          <option value="tek">Tek taraflı (yalnızca açıklayan taraf paylaşır)</option>
        </Select>
      </Field>
      <Field label="Sözleşme Amacı" error={e("amac")}>
        <Textarea rows={3} placeholder="Örn: Mobil uygulama geliştirme projesi kapsamında iş birliği görüşmeleri" hata={!!e("amac")} {...register("amac")} />
      </Field>
    </div>
  );
}

function SartlarStep() {
  const { register, formState: { errors } } = useFormContext<NdaData>();
  const e = (p: string) => getError(errors as Record<string, unknown>, p);
  return (
    <div className="space-y-4">
      <Field label="Gizlilik Süresi (yıl)" error={e("sureYil")} hint="Sözleşme bittikten sonra yükümlülüğün devam edeceği süre.">
        <Input type="number" min={1} max={20} hata={!!e("sureYil")} {...register("sureYil")} />
      </Field>
      <Field label="Cezai Şart (₺, opsiyonel)" error={e("cezaiSart")}>
        <Input type="number" min={0} step="0.01" {...register("cezaiSart")} />
      </Field>
      <Field label="Yetkili Mahkeme (il)" error={e("yetkiliYer")}>
        <Input placeholder="Örn: İstanbul" hata={!!e("yetkiliYer")} {...register("yetkiliYer")} />
      </Field>
    </div>
  );
}

export default function NdaSayfasi() {
  const form = useForm<NdaData>({
    resolver: zodResolver(ndaSchema),
    defaultValues: NDA_VARSAYILAN,
    mode: "onTouched",
  });

  return (
    <GenericWizard
      form={form}
      baslik="Gizlilik Sözleşmesi (NDA)"
      storageKey={STORAGE_KEY}
      adimlar={NDA_ADIMLAR}
      varsayilan={NDA_VARSAYILAN}
      belge={<NdaDoc />}
      adimIcerik={(adim, sifirla) => (
        <>
          {adim === 0 && <TurAmacStep />}
          {adim === 1 && <TarafStep yol="acilklayan" tuzelDestek />}
          {adim === 2 && <TarafStep yol="alan" tuzelDestek />}
          {adim === 3 && <SartlarStep />}
          {adim === 4 && (
            <ListeStep yol="ekMaddeler" etiket="Ek Madde" ekleMetni="Ek Madde Ekle" placeholder="Ek madde metni…" />
          )}
          {adim === 5 && (
            <GenelCiktiStep storageKey={STORAGE_KEY} pdfDosyaAdi="gizlilik-sozlesmesi.pdf" onSifirla={sifirla} />
          )}
        </>
      )}
    />
  );
}
