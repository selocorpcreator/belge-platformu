"use client";

import { useFormContext } from "react-hook-form";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { getError } from "@/lib/utils/getError";
import type { KiraSozlesmesiData } from "@/lib/schemas/kiraSozlesmesi";

export function TasinmazStep() {
  const { register, formState: { errors } } = useFormContext<KiraSozlesmesiData>();
  const e = (p: string) => getError(errors as Record<string, unknown>, p);

  return (
    <div className="space-y-4">
      <Field label="Açık Adres" error={e("tasinmaz.adres")}>
        <Textarea rows={2} placeholder="Mahalle, cadde/sokak, bina ve daire no" hata={!!e("tasinmaz.adres")} {...register("tasinmaz.adres")} />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="İlçe" error={e("tasinmaz.ilce")}>
          <Input placeholder="Defne" hata={!!e("tasinmaz.ilce")} {...register("tasinmaz.ilce")} />
        </Field>
        <Field label="İl" error={e("tasinmaz.il")}>
          <Input placeholder="Hatay" hata={!!e("tasinmaz.il")} {...register("tasinmaz.il")} />
        </Field>
      </div>
      <Field label="Mülk Tipi" error={e("tasinmaz.mulkTipi")}>
        <Select hata={!!e("tasinmaz.mulkTipi")} {...register("tasinmaz.mulkTipi")}>
          <option value="konut">Konut (Mesken)</option>
          <option value="isyeri">İş Yeri</option>
          <option value="depo">Depo</option>
          <option value="diger">Diğer</option>
        </Select>
      </Field>
      <Field label="Demirbaşlar (isteğe bağlı)" hint="Kombi, klima, beyaz eşya gibi teslim edilen demirbaşları virgülle yazın.">
        <Textarea rows={2} placeholder="Kombi, ankastre ocak, klima…" {...register("tasinmaz.demirbaslar")} />
      </Field>
    </div>
  );
}
