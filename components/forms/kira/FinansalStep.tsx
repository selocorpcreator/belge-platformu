"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { getError } from "@/lib/utils/getError";
import { tutarYaziyaCevir } from "@/lib/utils/sayiyiYaziyaCevir";
import type { KiraSozlesmesiData } from "@/lib/schemas/kiraSozlesmesi";

export function FinansalStep() {
  const { register, control, formState: { errors } } = useFormContext<KiraSozlesmesiData>();
  const e = (p: string) => getError(errors as Record<string, unknown>, p);

  const kiraBedeli = useWatch({ control, name: "finansal.kiraBedeli" });
  const depozito = useWatch({ control, name: "finansal.depozito" });
  const odemeSekli = useWatch({ control, name: "finansal.odemeSekli" });

  return (
    <div className="space-y-4">
      <Field label="Aylık Kira Bedeli (₺)" error={e("finansal.kiraBedeli")} hint={tutarYaziyaCevir(Number(kiraBedeli))}>
        <Input type="number" min={0} step="0.01" placeholder="35000" hata={!!e("finansal.kiraBedeli")} {...register("finansal.kiraBedeli")} />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Ödeme Günü" error={e("finansal.odemeGunu")} hint="Her ayın kaçında?">
          <Input type="number" min={1} max={31} hata={!!e("finansal.odemeGunu")} {...register("finansal.odemeGunu")} />
        </Field>
        <Field label="Ödeme Şekli" error={e("finansal.odemeSekli")}>
          <Select hata={!!e("finansal.odemeSekli")} {...register("finansal.odemeSekli")}>
            <option value="havale">Banka Havalesi / EFT</option>
            <option value="nakit">Nakit</option>
            <option value="diger">Diğer</option>
          </Select>
        </Field>
      </div>

      {odemeSekli === "havale" && (
        <Field label="IBAN (isteğe bağlı)">
          <Input placeholder="TR__ ____ ____ ____ ____ ____ __" {...register("finansal.iban")} />
        </Field>
      )}

      <Field label="Depozito Tutarı (₺)" error={e("finansal.depozito")} hint={tutarYaziyaCevir(Number(depozito))}>
        <Input type="number" min={0} step="0.01" placeholder="0" hata={!!e("finansal.depozito")} {...register("finansal.depozito")} />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Başlangıç Tarihi" error={e("finansal.baslangicTarihi")}>
          <Input type="date" hata={!!e("finansal.baslangicTarihi")} {...register("finansal.baslangicTarihi")} />
        </Field>
        <Field label="Süre (Ay)" error={e("finansal.sureAy")}>
          <Input type="number" min={1} max={120} hata={!!e("finansal.sureAy")} {...register("finansal.sureAy")} />
        </Field>
      </div>
    </div>
  );
}
