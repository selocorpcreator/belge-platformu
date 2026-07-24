"use client";

import { useState } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { Download, Printer, PenLine, RotateCcw, TriangleAlert, Plus, Trash2 } from "lucide-react";

import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { getError } from "@/lib/utils/getError";
import { useUIStore } from "@/lib/store/useUIStore";
import { belgeyiPdfIndir } from "@/lib/pdf/downloadPdf";
import { PLATFORM_ADI } from "@/lib/templates/registry";

/* ------------------------------------------------------------------ */
/* Taraf (gerçek / tüzel kişi) adımı                                   */
/* ------------------------------------------------------------------ */

type TarafStepProps = {
  /** form path öneki, örn. "ihtatEden" */
  yol: string;
  /** true ise Vergi No / Unvan alanları da gösterilir (ticari belgeler) */
  tuzelDestek?: boolean;
};

export function TarafStep({ yol, tuzelDestek = false }: TarafStepProps) {
  const { register, formState: { errors } } = useFormContext();
  const e = (p: string) => getError(errors as Record<string, unknown>, p);

  return (
    <div className="space-y-4">
      <Field label={tuzelDestek ? "Ad Soyad / Ticaret Unvanı" : "Ad Soyad"} error={e(`${yol}.adSoyad`)}>
        <Input placeholder={tuzelDestek ? "Ad Soyad veya şirket unvanı" : "Ad Soyad"} hata={!!e(`${yol}.adSoyad`)} {...register(`${yol}.adSoyad`)} />
      </Field>
      <Field
        label={tuzelDestek ? "T.C. Kimlik No / Vergi No" : "T.C. Kimlik No"}
        error={e(`${yol}.tcNo`)}
        hint="Boş bırakabilirsiniz; belgede noktalı alan olarak görünür."
      >
        <Input inputMode="numeric" maxLength={11} placeholder="___________" hata={!!e(`${yol}.tcNo`)} {...register(`${yol}.tcNo`)} />
      </Field>
      <Field label="Telefon" error={e(`${yol}.telefon`)}>
        <Input inputMode="tel" placeholder="05xx xxx xx xx" hata={!!e(`${yol}.telefon`)} {...register(`${yol}.telefon`)} />
      </Field>
      <Field label="Tebligat Adresi" error={e(`${yol}.adres`)}>
        <Textarea rows={2} placeholder="Yazışma / tebligat adresi" hata={!!e(`${yol}.adres`)} {...register(`${yol}.adres`)} />
      </Field>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Dinamik metin listesi adımı (olaylar, şartlar, kurallar…)           */
/* ------------------------------------------------------------------ */

type ListeStepProps = {
  /** dizi form path'i, örn. "ihtarOlaylar" */
  yol: string;
  etiket: string;
  ekleMetni?: string;
  placeholder?: string;
};

export function ListeStep({ yol, etiket, ekleMetni = "Madde Ekle", placeholder = "Metni yazın…" }: ListeStepProps) {
  const { control, register, formState: { errors } } = useFormContext();
  const { fields, append, remove } = useFieldArray({ control, name: yol });
  const e = (p: string) => getError(errors as Record<string, unknown>, p);

  return (
    <div className="space-y-3">
      {fields.map((f, i) => (
        <Field key={f.id} label={`${etiket} ${i + 1}`} error={e(`${yol}.${i}.metin`)}>
          <div className="flex gap-2">
            <Textarea rows={2} placeholder={placeholder} hata={!!e(`${yol}.${i}.metin`)} {...register(`${yol}.${i}.metin`)} />
            <Button type="button" varyant="tehlike" className="h-fit shrink-0 px-3" onClick={() => remove(i)}>
              <Trash2 size={15} />
            </Button>
          </div>
        </Field>
      ))}
      <Button type="button" varyant="ikincil" className="w-full" onClick={() => append({ metin: "" })}>
        <Plus size={16} /> {ekleMetni}
      </Button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Genel çıktı (PDF / Yazdır / Serbest düzenleme) adımı                */
/* ------------------------------------------------------------------ */

type CiktiProps = {
  storageKey: string;
  pdfDosyaAdi: string;
  onSifirla: () => void;
};

export function GenelCiktiStep({ storageKey, pdfDosyaAdi, onSifirla }: CiktiProps) {
  const { duzenlemeModu, setDuzenlemeModu, setSekme } = useUIStore();
  const [onaylandi, setOnaylandi] = useState(false);
  const [indiriliyor, setIndiriliyor] = useState(false);

  async function pdfIndir() {
    const el = document.getElementById("belge-a4");
    if (!el) return;
    setIndiriliyor(true);
    try {
      await belgeyiPdfIndir(el, pdfDosyaAdi);
    } finally {
      setIndiriliyor(false);
    }
  }

  function sifirla() {
    if (!confirm("Tüm form verisi ve taslak silinecek. Emin misiniz?")) return;
    localStorage.removeItem(storageKey);
    onSifirla();
  }

  return (
    <div className="space-y-5">
      <div className="rounded-lg border border-muhur/30 bg-muhur/5 p-4">
        <p className="flex items-start gap-2 text-sm leading-relaxed text-metin">
          <TriangleAlert size={18} className="mt-0.5 shrink-0 text-muhur" />
          <span>
            <strong>Hukuki Uyarı:</strong> {PLATFORM_ADI} ile oluşturulan belgeler genel şablonlardır ve
            hukuki danışmanlık yerine geçmez. Önemli işlemlerden önce bir avukata danışmanız önerilir.
          </span>
        </p>
        <label className="mt-3 flex cursor-pointer items-center gap-2 text-sm text-metin">
          <input
            type="checkbox"
            checked={onaylandi}
            onChange={(ev) => setOnaylandi(ev.target.checked)}
            className="h-4 w-4 accent-lacivert"
          />
          Bu uyarıyı okudum ve anladım.
        </label>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button type="button" disabled={!onaylandi || indiriliyor} onClick={pdfIndir}>
          <Download size={16} /> {indiriliyor ? "Hazırlanıyor…" : "PDF İndir"}
        </Button>
        <Button type="button" varyant="ikincil" disabled={!onaylandi} onClick={() => window.print()}>
          <Printer size={16} /> Yazdır
        </Button>
      </div>

      <div className="rounded-lg border border-cizgi bg-white p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-metin">Serbest Düzenleme Modu</p>
            <p className="text-xs text-soluk">Kağıt üzerinde metne doğrudan müdahale edin.</p>
          </div>
          <Button
            type="button"
            varyant={duzenlemeModu ? "birincil" : "ikincil"}
            onClick={() => {
              setDuzenlemeModu(!duzenlemeModu);
              setSekme("onizleme");
            }}
          >
            <PenLine size={16} /> {duzenlemeModu ? "Açık" : "Kapalı"}
          </Button>
        </div>
        {duzenlemeModu && (
          <p className="mt-3 rounded bg-amber-50 p-2 text-xs text-amber-800">
            Formda yapacağınız yeni değişiklikler manuel düzenlemelerin üzerine yazar. Düzenlemeyi en son yapın.
          </p>
        )}
      </div>

      <Button type="button" varyant="tehlike" className="w-full" onClick={sifirla}>
        <RotateCcw size={16} /> Taslağı Sıfırla
      </Button>
    </div>
  );
}
