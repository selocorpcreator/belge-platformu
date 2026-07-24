"use client";

import { useForm, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  muvafakatnameSchema,
  MUVAFAKATNAME_VARSAYILAN,
  MUVAFAKATNAME_ADIMLAR,
  type MuvafakatnameData,
} from "@/lib/schemas/muvafakatname";
import { GenericWizard } from "@/components/wizard/GenericWizard";
import { TarafStep, ListeStep, GenelCiktiStep } from "@/components/forms/ortak/OrtakAdimlar";
import { MuvafakatnameDoc } from "@/components/preview/MuvafakatnameDoc";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { getError } from "@/lib/utils/getError";

const STORAGE_KEY = "belge:muvafakatname:v1";

function KonuStep() {
  const { register, formState: { errors } } = useFormContext<MuvafakatnameData>();
  const e = (p: string) => getError(errors as Record<string, unknown>, p);
  return (
    <Field label="İzin Verilen Konu" error={e("izinVerilenKonu")}>
      <Textarea rows={4} placeholder="Hangi konuda muvafakat veriyorsunuz?" hata={!!e("izinVerilenKonu")} {...register("izinVerilenKonu")} />
    </Field>
  );
}

function GecerlilikStep() {
  const { register, watch, formState: { errors } } = useFormContext<MuvafakatnameData>();
  const e = (p: string) => getError(errors as Record<string, unknown>, p);
  const turu = watch("gecerlilikturu");
  return (
    <div className="space-y-4">
      <Field label="Geçerlilik Başlangıcı" error={e("gecerliliktarihi")}>
        <Input type="date" hata={!!e("gecerliliktarihi")} {...register("gecerliliktarihi")} />
      </Field>
      <Field label="Geçerlilik Türü">
        <Select {...register("gecerlilikturu")}>
          <option value="suressiz">Süresiz</option>
          <option value="surezli">Belirli süreli</option>
        </Select>
      </Field>
      {turu === "surezli" && (
        <Field label="Bitiş Tarihi">
          <Input type="date" {...register("gecerliliktarihi_bitis")} />
        </Field>
      )}
      <Field label="İptal / Geri Alma Şartları (opsiyonel)">
        <Textarea rows={2} placeholder="Muvafakat hangi şartlarda geri alınabilir?" {...register("iptalSartlari")} />
      </Field>
    </div>
  );
}

export default function MuvafakatnameSayfasi() {
  const form = useForm<MuvafakatnameData>({
    resolver: zodResolver(muvafakatnameSchema),
    defaultValues: MUVAFAKATNAME_VARSAYILAN,
    mode: "onTouched",
  });

  return (
    <GenericWizard
      form={form}
      baslik="Muvafakatname"
      storageKey={STORAGE_KEY}
      adimlar={MUVAFAKATNAME_ADIMLAR}
      varsayilan={MUVAFAKATNAME_VARSAYILAN}
      belge={<MuvafakatnameDoc />}
      adimIcerik={(adim, sifirla) => (
        <>
          {adim === 0 && <TarafStep yol="muvafakatEden" />}
          {adim === 1 && <TarafStep yol="taraf" />}
          {adim === 2 && <KonuStep />}
          {adim === 3 && (
            <ListeStep yol="kosullar" etiket="Koşul" ekleMetni="Koşul Ekle" placeholder="Muvafakat koşulu…" />
          )}
          {adim === 4 && <GecerlilikStep />}
          {adim === 5 && (
            <GenelCiktiStep storageKey={STORAGE_KEY} pdfDosyaAdi="muvafakatname.pdf" onSifirla={sifirla} />
          )}
        </>
      )}
    />
  );
}
