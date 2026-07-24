"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import type { IhtarnameData } from "@/lib/schemas";

type StepProps = {
  step: number;
};

export function IhtarnameStep1({ step }: StepProps) {
  const { register, formState: { errors } } = useFormContext<IhtarnameData>();

  if (step !== 0) return null;

  return (
    <div className="space-y-6">
      <fieldset>
        <legend className="mb-4 font-semibold text-dark">İhtar Eden</legend>
        <div className="space-y-4">
          <Input
            label="Ad Soyad"
            {...register("warningIssuedBy.fullName")}
            error={errors.warningIssuedBy?.fullName?.message}
          />
          <Input
            label="T.C. No"
            {...register("warningIssuedBy.idNumber")}
          />
          <Input
            label="Telefon"
            {...register("warningIssuedBy.phone")}
            error={errors.warningIssuedBy?.phone?.message}
          />
          <Textarea
            label="Adres"
            {...register("warningIssuedBy.address")}
            error={errors.warningIssuedBy?.address?.message}
            rows={3}
          />
        </div>
      </fieldset>
    </div>
  );
}

export function IhtarnameStep2({ step }: StepProps) {
  const { register, formState: { errors } } = useFormContext<IhtarnameData>();

  if (step !== 1) return null;

  return (
    <div className="space-y-6">
      <fieldset>
        <legend className="mb-4 font-semibold text-dark">İhtar Edilecek Kişi</legend>
        <div className="space-y-4">
          <Input
            label="Ad Soyad"
            {...register("warningSubject.fullName")}
            error={errors.warningSubject?.fullName?.message}
          />
          <Input
            label="T.C. No"
            {...register("warningSubject.idNumber")}
          />
          <Input
            label="Telefon"
            {...register("warningSubject.phone")}
            error={errors.warningSubject?.phone?.message}
          />
          <Textarea
            label="Adres"
            {...register("warningSubject.address")}
            error={errors.warningSubject?.address?.message}
            rows={3}
          />
        </div>
      </fieldset>
    </div>
  );
}

export function IhtarnameStep3({ step }: StepProps) {
  const { register, formState: { errors }, control } = useFormContext<IhtarnameData>();
  const { fields, append, remove } = useFieldArray({ control, name: "details" });

  if (step !== 2) return null;

  return (
    <div className="space-y-6">
      <Input
        label="İhtar Konusu"
        {...register("subject")}
        error={errors.subject?.message}
        placeholder="Örn: Kira borcunun ödenmemesi"
      />

      <div>
        <label className="mb-3 block font-semibold text-dark">Olay ve Detaylar</label>
        <div className="space-y-3">
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <Textarea
                placeholder={`Detay ${index + 1}`}
                rows={2}
                {...register(`details.${index}.text`)}
                error={errors.details?.[index]?.text?.message}
                className="flex-1"
              />
              {fields.length > 1 && (
                <Button
                  type="button"
                  variant="danger"
                  onClick={() => remove(index)}
                  className="h-fit"
                >
                  <Trash2 size={16} />
                </Button>
              )}
            </div>
          ))}
        </div>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => append({ text: "" })}
          className="mt-3 gap-2"
        >
          <Plus size={16} /> Detay Ekle
        </Button>
      </div>
    </div>
  );
}

export function IhtarnameStep4({ step }: StepProps) {
  const { register, formState: { errors } } = useFormContext<IhtarnameData>();

  if (step !== 3) return null;

  return (
    <div className="space-y-6">
      <Textarea
        label="Talep Edilen Eylem"
        {...register("demand")}
        error={errors.demand?.message}
        rows={4}
        placeholder="Yapılması istenen eylemin detaylı açıklaması"
      />

      <Input
        label="Yerine Getirilme Süresi (Gün)"
        type="number"
        min="1"
        {...register("deadline")}
        error={errors.deadline?.message}
      />

      <Select
        label="Tebligat Şekli"
        {...register("notificationMethod")}
        error={errors.notificationMethod?.message}
      >
        <option value="elden">Elden Tebligat</option>
        <option value="posta">Posta ile Tebligat</option>
        <option value="diger">Diğer Yöntem</option>
      </Select>
    </div>
  );
}
