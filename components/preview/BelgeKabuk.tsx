"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useUIStore } from "@/lib/store/useUIStore";
import { bugunTr, belgeNoUret } from "@/lib/utils/tarih";
import { PLATFORM_ADI } from "@/lib/templates/registry";

export const BOS = "………………………………";
export const yada = (v: string | number | undefined | null, alt = BOS) => {
  const s = v === undefined || v === null ? "" : String(v);
  return s.trim() ? s : alt;
};

type Props = {
  /** localStorage'da belge no'nun saklanacağı anahtar (belge türüne özel) */
  belgeNoKey: string;
  children: ReactNode;
};

/**
 * Tüm belge türleri için ortak A4 kabuğu:
 * id="belge-a4" (print CSS + PDF indirme bunu kullanır),
 * serbest düzenleme (contentEditable) ve platform mührü.
 */
export function BelgeKabuk({ belgeNoKey, children }: Props) {
  const duzenlemeModu = useUIStore((s) => s.duzenlemeModu);
  const [belgeNo, setBelgeNo] = useState("");

  useEffect(() => {
    let no = localStorage.getItem(belgeNoKey);
    if (!no) {
      no = belgeNoUret();
      localStorage.setItem(belgeNoKey, no);
    }
    setBelgeNo(no);
  }, [belgeNoKey]);

  return (
    <div
      id="belge-a4"
      contentEditable={duzenlemeModu}
      suppressContentEditableWarning
      className={`min-h-[1123px] w-[794px] bg-kagit px-[64px] py-[56px] font-belge text-[13px] leading-relaxed text-black shadow-kagit outline-none print:shadow-none
        ${duzenlemeModu ? "ring-2 ring-amber-400" : ""}`}
    >
      {children}

      {/* Platform damgası + hukuki uyarı */}
      <div className="no-break mt-12 flex items-end justify-between gap-4 border-t border-black/20 pt-3">
        <p className="max-w-[430px] text-[9px] leading-snug text-black/60">
          Bu belge {PLATFORM_ADI} ile oluşturulmuştur. İçerik genel bir şablondur; hukuki danışmanlık
          yerine geçmez ve platform, belgenin kullanımından doğacak sonuçlardan sorumlu tutulamaz.
        </p>
        <div className="shrink-0 -rotate-2 rounded border-2 border-muhur px-3 py-1.5 text-center text-muhur">
          <p className="text-[10px] font-bold tracking-widest">{PLATFORM_ADI.toUpperCase()}</p>
          <p className="text-[8px]">{belgeNo || "BLG-…"}</p>
          <p className="text-[8px]">{bugunTr()}</p>
        </div>
      </div>
    </div>
  );
}

/** Belgelerde ortak imza bloğu */
export function ImzaBloklari({ sol, sag }: { sol: { rol: string; ad?: string }; sag: { rol: string; ad?: string } }) {
  return (
    <div className="signature-block mt-10 grid grid-cols-2 gap-6 text-center">
      <div>
        <p className="font-bold">{sol.rol}</p>
        <p className="mt-1 text-[12px]">{yada(sol.ad)}</p>
        <p className="mt-10 border-t border-black pt-1 text-[11px]">İmza</p>
      </div>
      <div>
        <p className="font-bold">{sag.rol}</p>
        <p className="mt-1 text-[12px]">{yada(sag.ad)}</p>
        <p className="mt-10 border-t border-black pt-1 text-[11px]">İmza</p>
      </div>
    </div>
  );
}

/** Belgelerde ortak taraf bilgi tablosu */
export function TarafTablo({
  baslik,
  satirlar,
}: {
  baslik: string;
  satirlar: [string, string | undefined][];
}) {
  return (
    <div className="no-break">
      <p className="font-bold">{baslik}</p>
      <table className="mt-1 w-full text-[13px]">
        <tbody>
          {satirlar.map(([etiket, deger]) => (
            <tr key={etiket}>
              <td className="w-32 py-0.5 align-top">{etiket}</td>
              <td className="py-0.5">: {yada(deger)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
