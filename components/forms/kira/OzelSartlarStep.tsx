"use client";

import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { getError } from "@/lib/utils/getError";
import { HAZIR_MADDELER, type KiraSozlesmesiData } from "@/lib/schemas/kiraSozlesmesi";

export function OzelSartlarStep() {
  const { register, control, setValue, formState: { errors } } = useFormContext<KiraSozlesmesiData>();
  const { fields, append, remove } = useFieldArray({ control, name: "ozelSartlar" });
  const secili = useWatch({ control, name: "opsiyonelMaddeler" }) ?? [];
  const e = (p: string) => getError(errors as Record<string, unknown>, p);

  function toggleMadde(id: string) {
    const yeni = secili.includes(id) ? secili.filter((x: string) => x !== id) : [...secili, id];
    setValue("opsiyonelMaddeler", yeni, { shouldDirty: true });
  }

  return (
    <div className="space-y-6">
      <section>
        <h3 className="mb-2 text-sm font-semibold text-metin">Hazır Opsiyonel Maddeler</h3>
        <p className="mb-3 text-xs text-soluk">Seçtikleriniz belgeye otomatik eklenir.</p>
        <div className="space-y-2">
          {HAZIR_MADDELER.map((m) => {
            const aktif = secili.includes(m.id);
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => toggleMadde(m.id)}
                aria-pressed={aktif}
                className={`w-full rounded-lg border p-3 text-left transition
                  ${aktif ? "border-lacivert bg-lacivert/5" : "border-cizgi bg-white hover:border-lacivert/40"}`}
              >
                <span className="flex items-center gap-2">
                  <span
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border text-[10px] font-bold
                      ${aktif ? "border-lacivert bg-lacivert text-white" : "border-cizgi bg-white"}`}
                  >
                    {aktif ? "✓" : ""}
                  </span>
                  <span className="text-sm font-medium text-metin">{m.baslik}</span>
                </span>
                <span className="mt-1 block pl-6 text-xs leading-relaxed text-soluk">{m.metin}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section>
        <h3 className="mb-2 text-sm font-semibold text-metin">Kendi Maddeleriniz</h3>
        <div className="space-y-3">
          {fields.map((f, i) => (
            <div key={f.id} className="flex gap-2">
              <div className="flex-1">
                <Textarea
                  rows={2}
                  placeholder={`Özel madde ${i + 1}`}
                  hata={!!e(`ozelSartlar.${i}.metin`)}
                  {...register(`ozelSartlar.${i}.metin`)}
                />
                {e(`ozelSartlar.${i}.metin`) && (
                  <span className="mt-1 block text-xs font-medium text-muhur">{e(`ozelSartlar.${i}.metin`)}</span>
                )}
              </div>
              <Button type="button" varyant="tehlike" className="h-fit px-3" onClick={() => remove(i)} aria-label="Maddeyi sil">
                <Trash2 size={16} />
              </Button>
            </div>
          ))}
        </div>
        <Button type="button" varyant="ikincil" className="mt-3 w-full" onClick={() => append({ metin: "" })}>
          <Plus size={16} /> Madde Ekle
        </Button>
      </section>
    </div>
  );
}
