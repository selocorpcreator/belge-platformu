"use client";

import { useFormContext } from "react-hook-form";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { getError } from "@/lib/utils/getError";
import type { KiraSozlesmesiData } from "@/lib/schemas/kiraSozlesmesi";

/** Kiraya Veren ve Kiracı adımları aynı alan setini kullanır */
export function KisiStep({ taraf }: { taraf: "kirayaVeren" | "kiraci" }) {
  const { register, formState: { errors } } = useFormContext<KiraSozlesmesiData>();
  const e = (p: string) => getError(errors as Record<string, unknown>, p);

  return (
    <div className="space-y-4">
      <Field label="Ad Soyad" error={e(`${taraf}.adSoyad`)}>
        <Input placeholder="Ad Soyad" hata={!!e(`${taraf}.adSoyad`)} {...register(`${taraf}.adSoyad`)} />
      </Field>
      <Field label="T.C. Kimlik No" error={e(`${taraf}.tcNo`)} hint="Boş bırakabilirsiniz; belgede noktalı alan olarak görünür.">
        <Input inputMode="numeric" maxLength={11} placeholder="___________" hata={!!e(`${taraf}.tcNo`)} {...register(`${taraf}.tcNo`)} />
      </Field>
      <Field label="Telefon" error={e(`${taraf}.telefon`)}>
        <Input inputMode="tel" placeholder="05xx xxx xx xx" hata={!!e(`${taraf}.telefon`)} {...register(`${taraf}.telefon`)} />
      </Field>
      <Field label="Tebligat Adresi" error={e(`${taraf}.adres`)}>
        <Textarea rows={2} placeholder="Yazışma / tebligat adresi" hata={!!e(`${taraf}.adres`)} {...register(`${taraf}.adres`)} />
      </Field>
    </div>
  );
}
