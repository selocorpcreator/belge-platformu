"use client";

import { useForm, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  ihtarnameSchema,
  IHTARNAME_VARSAYILAN,
  IHTARNAME_ADIMLAR,
  type IhtarnameData,
} from "@/lib/schemas/ihtarname";
import { GenericWizard } from "@/components/wizard/GenericWizard";
import { TarafStep, ListeStep, GenelCiktiStep } from "@/components/forms/ortak/OrtakAdimlar";
import { IhtarnameDoc } from "@/components/preview/IhtarnameDoc";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { getError } from "@/lib/utils/getError";

const STORAGE_KEY = "belge:ihtarname:v1";

function KonuStep() {
  const { register, formState: { errors } } = useFormContext<IhtarnameData>();
  const e = (p: string) => getError(errors as Record<string, unknown>, p);
  return (
    <div className="space-y-4">
      <Field label="İhtar Konusu" error={e("ihtarKonusu")}>
        <Textarea rows={2} placeholder="Örn: Ödenmeyen kira bedellerinin ödenmesi talebi" hata={!!e("ihtarKonusu")} {...register("ihtarKonusu")} />
      </Field>
      <ListeStep yol="ihtarOlaylar" etiket="Olay" ekleMetni="Olay Ekle" placeholder="Yaşanan olayı tarihiyle birlikte açıklayın…" />
    </div>
  );
}

function TalepStep() {
  const { register, formState: { errors } } = useFormContext<IhtarnameData>();
  const e = (p: string) => getError(errors as Record<string, unknown>, p);
  return (
    <div className="space-y-4">
      <Field label="Talep" error={e("talep")}>
        <Textarea rows={3} placeholder="Muhataptan ne talep ediyorsunuz?" hata={!!e("talep")} {...register("talep")} />
      </Field>
      <Field label="Süre (gün)" error={e("talipSure")} hint="Tebliğden itibaren tanınan süre.">
        <Input type="number" min={1} max={365} hata={!!e("talipSure")} {...register("talipSure")} />
      </Field>
      <Field label="Tebligat Şekli" error={e("tebligatSekli")}>
        <Select {...register("tebligatSekli")}>
          <option value="posta">İadeli taahhütlü posta</option>
          <option value="emniyetveri">Noter aracılığıyla</option>
          <option value="elden">Elden imza karşılığı</option>
          <option value="diger">Diğer</option>
        </Select>
      </Field>
    </div>
  );
}

export default function IhtarnameSayfasi() {
  const form = useForm<IhtarnameData>({
    resolver: zodResolver(ihtarnameSchema),
    defaultValues: IHTARNAME_VARSAYILAN,
    mode: "onTouched",
  });

  return (
    <GenericWizard
      form={form}
      baslik="İhtarname"
      storageKey={STORAGE_KEY}
      adimlar={IHTARNAME_ADIMLAR}
      varsayilan={IHTARNAME_VARSAYILAN}
      belge={<IhtarnameDoc />}
      adimIcerik={(adim, sifirla) => (
        <>
          {adim === 0 && <TarafStep yol="ihtatEden" />}
          {adim === 1 && <TarafStep yol="muhatap" />}
          {adim === 2 && <KonuStep />}
          {adim === 3 && <TalepStep />}
          {adim === 4 && (
            <GenelCiktiStep storageKey={STORAGE_KEY} pdfDosyaAdi="ihtarname.pdf" onSifirla={sifirla} />
          )}
        </>
      )}
    />
  );
}
