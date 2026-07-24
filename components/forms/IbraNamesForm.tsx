"use client";

import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { amountToWords } from "@/lib/utils/numberToWords";
import type { IbraNamesData } from "@/lib/schemas";

type StepProps = {
  step: number;
};

export function IbraNamesStep1({ step }: StepProps) {
  const { register, formState: { errors } } = useFormContext<IbraNamesData>();

  if (step !== 0) return null;

  return (
    <div className="space-y-6">
      <fieldset>
        <legend className="mb-4 font-semibold text-dark">İbra Eden (Alacağı Tarafından Vazgeçen)</legend>
        <div className="space-y-4">
          <Input
            label="Ad Soyad"
            {...register("releasingParty.fullName")}
            error={errors.releasingParty?.fullName?.message}
          />
          <Input
            label="T.C. No"
            {...register("releasingParty.idNumber")}
            placeholder="(İsteğe bağlı)"
          />
          <Input
            label="Telefon"
            {...register("releasingParty.phone")}
            error={errors.releasingParty?.phone?.message}
          />
          <Textarea
            label="Adres"
            {...register("releasingParty.address")}
            error={errors.releasingParty?.address?.message}
            rows={3}
          />
        </div>
      </fieldset>
    </div>
  );
}

export function IbraNamesStep2({ step }: StepProps) {
  const { register, formState: { errors } } = useFormContext<IbraNamesData>();

  if (step !== 1) return null;

  return (
    <div className="space-y-6">
      <fieldset>
        <legend className="mb-4 font-semibold text-dark">İbra Edilen (Borcu Tarafı)</legend>
        <div className="space-y-4">
          <Input
            label="Ad Soyad"
            {...register("releasedParty.fullName")}
            error={errors.releasedParty?.fullName?.message}
          />
          <Input
            label="T.C. No"
            {...register("releasedParty.idNumber")}
            placeholder="(İsteğe bağlı)"
          />
          <Input
            label="Telefon"
            {...register("releasedParty.phone")}
            error={errors.releasedParty?.phone?.message}
          />
          <Textarea
            label="Adres"
            {...register("releasedParty.address")}
            error={errors.releasedParty?.address?.message}
            rows={3}
          />
        </div>
      </fieldset>
    </div>
  );
}

export function IbraNamesStep3({ step }: StepProps) {
  const { register, control, formState: { errors } } = useFormContext<IbraNamesData>();
  const amount = useWatch({ control, name: "amount" });

  if (step !== 2) return null;

  return (
    <div className="space-y-6">
      <Input
        label="İbraname Konusu"
        {...register("subject")}
        error={errors.subject?.message}
        placeholder="Örn: Ticari borç ilişkisinin sonlanması"
      />

      <div>
        <Input
          label="Tutar (₺)"
          type="number"
          step="0.01"
          {...register("amount")}
          error={errors.amount?.message}
          hint={amount > 0 ? amountToWords(Number(amount)) : ""}
        />
      </div>

      <Textarea
        label="Açıklama"
        {...register("description")}
        error={errors.description?.message}
        rows={4}
        placeholder="Borç kapanışı, tazminat alacağı vb. detayları yazın"
      />

      <Input
        label="Tarih"
        type="date"
        {...register("date")}
        error={errors.date?.message}
      />
    </div>
  );
}
