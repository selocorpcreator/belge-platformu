"use client";

import { useForm, useFormContext, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2, Info } from "lucide-react";

import {
  ibranameSchema,
  IBRANAME_VARSAYILAN,
  IBRANAME_ADIMLAR,
  type IbranameData,
} from "@/lib/schemas/ibraname";
import { GenericWizard } from "@/components/wizard/GenericWizard";
import { TarafStep, ListeStep, GenelCiktiStep } from "@/components/forms/ortak/OrtakAdimlar";
import { IbranameDoc } from "@/components/preview/IbranameDoc";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { getError } from "@/lib/utils/getError";

const STORAGE_KEY = "belge:ibraname:v1";

function TurStep() {
  const { register, watch } = useFormContext<IbranameData>();
  const tur = watch("tur");
  return (
    <div className="space-y-4">
      <Field label="İbra Türü">
        <Select {...register("tur")}>
          <option value="is">İşçi – İşveren İbranamesi</option>
          <option value="genel">Genel Alacak – Borç İbrası</option>
        </Select>
      </Field>
      {tur === "is" && (
        <p className="flex items-start gap-2 rounded-lg border border-lacivert/20 bg-lacivert/5 p-3 text-xs leading-relaxed text-metin">
          <Info size={15} className="mt-0.5 shrink-0 text-lacivert" />
          <span>
            <strong>TBK m.420 uyarısı:</strong> İşçi ibranamesinin geçerli olması için işten ayrılış
            tarihinden itibaren <strong>en az 1 ay</strong> geçmiş olması, alacak tür ve tutarlarının
            açıkça yazılması ve ödemelerin <strong>banka aracılığıyla</strong> yapılması gerekir.
          </span>
        </p>
      )}
    </div>
  );
}

function DetayStep() {
  const { register, control, watch, formState: { errors } } = useFormContext<IbranameData>();
  const e = (p: string) => getError(errors as Record<string, unknown>, p);
  const tur = watch("tur");
  const { fields, append, remove } = useFieldArray({ control, name: "odemeKalemleri" });

  return (
    <div className="space-y-4">
      {tur === "is" ? (
        <>
          <Field label="Görev / Pozisyon" error={e("gorev")}>
            <Input placeholder="Örn: Satış Danışmanı" {...register("gorev")} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="İşe Giriş Tarihi">
              <Input type="date" {...register("iseGirisTarihi")} />
            </Field>
            <Field label="İşten Ayrılış Tarihi">
              <Input type="date" {...register("istenAyrilisTarihi")} />
            </Field>
          </div>
        </>
      ) : (
        <Field label="İbra Konusu" error={e("konu")}>
          <Input placeholder="Örn: 15.03.2026 tarihli borç ilişkisi" {...register("konu")} />
        </Field>
      )}

      <div>
        <p className="mb-2 text-sm font-semibold text-metin">Ödeme Kalemleri</p>
        <div className="space-y-2">
          {fields.map((f, i) => (
            <div key={f.id} className="flex gap-2">
              <Input placeholder="Kalem adı" hata={!!e(`odemeKalemleri.${i}.kalem`)} {...register(`odemeKalemleri.${i}.kalem`)} />
              <Input type="number" min={0} step="0.01" placeholder="Tutar ₺" className="w-36" hata={!!e(`odemeKalemleri.${i}.tutar`)} {...register(`odemeKalemleri.${i}.tutar`)} />
              <Button type="button" varyant="tehlike" className="shrink-0 px-3" onClick={() => remove(i)}>
                <Trash2 size={15} />
              </Button>
            </div>
          ))}
        </div>
        <Button type="button" varyant="ikincil" className="mt-2 w-full" onClick={() => append({ kalem: "", tutar: 0 })}>
          <Plus size={16} /> Kalem Ekle
        </Button>
      </div>

      <Field label="Ödeme Şekli" hint={tur === "is" ? "TBK m.420 gereği işçi alacakları banka yoluyla ödenmelidir." : undefined}>
        <Select {...register("odemeSekli")}>
          <option value="banka">Banka havalesi / EFT</option>
          <option value="nakit">Elden nakit</option>
        </Select>
      </Field>
    </div>
  );
}

export default function IbranameSayfasi() {
  const form = useForm<IbranameData>({
    resolver: zodResolver(ibranameSchema),
    defaultValues: IBRANAME_VARSAYILAN,
    mode: "onTouched",
  });

  return (
    <GenericWizard
      form={form}
      baslik="İbraname"
      storageKey={STORAGE_KEY}
      adimlar={IBRANAME_ADIMLAR}
      varsayilan={IBRANAME_VARSAYILAN}
      belge={<IbranameDoc />}
      adimIcerik={(adim, sifirla) => (
        <>
          {adim === 0 && <TurStep />}
          {adim === 1 && <TarafStep yol="ibraEden" />}
          {adim === 2 && <TarafStep yol="ibraEdilen" tuzelDestek />}
          {adim === 3 && <DetayStep />}
          {adim === 4 && (
            <ListeStep yol="ekBeyanlar" etiket="Beyan" ekleMetni="Beyan Ekle" placeholder="Ek beyan metni…" />
          )}
          {adim === 5 && (
            <GenelCiktiStep storageKey={STORAGE_KEY} pdfDosyaAdi="ibraname.pdf" onSifirla={sifirla} />
          )}
        </>
      )}
    />
  );
}
