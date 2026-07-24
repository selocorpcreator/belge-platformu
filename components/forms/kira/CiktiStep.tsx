"use client";

import { useState } from "react";
import { Download, Printer, PenLine, RotateCcw, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useUIStore } from "@/lib/store/useUIStore";
import { belgeyiPdfIndir } from "@/lib/pdf/downloadPdf";
import { PLATFORM_ADI } from "@/lib/templates/registry";

type Props = { storageKey: string; onSifirla: () => void };

export function CiktiStep({ storageKey, onSifirla }: Props) {
  const { duzenlemeModu, setDuzenlemeModu, setSekme } = useUIStore();
  const [onaylandi, setOnaylandi] = useState(false);
  const [indiriliyor, setIndiriliyor] = useState(false);

  async function pdfIndir() {
    const el = document.getElementById("belge-a4");
    if (!el) return;
    setIndiriliyor(true);
    try {
      await belgeyiPdfIndir(el, "kira-sozlesmesi.pdf");
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
            <p className="text-xs text-soluk">Önizleme üzerinde metni doğrudan düzenleyin.</p>
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
