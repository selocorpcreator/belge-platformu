"use client";

import { Check } from "lucide-react";
import { KIRA_ADIMLARI } from "@/lib/schemas/kiraSozlesmesi";
import { useUIStore } from "@/lib/store/useUIStore";

export function Stepper() {
  const { adim, setAdim } = useUIStore();

  return (
    <nav aria-label="Belge adımları" className="px-5 pt-5">
      <ol className="flex items-center">
        {KIRA_ADIMLARI.map((a, i) => {
          const tamamlandi = i < adim;
          const aktif = i === adim;
          return (
            <li key={a.id} className="flex flex-1 items-center last:flex-none">
              <button
                type="button"
                onClick={() => i < adim && setAdim(i)}
                title={a.baslik}
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition
                  ${aktif ? "bg-lacivert text-white ring-4 ring-lacivert/15" : ""}
                  ${tamamlandi ? "bg-lacivert/90 text-white hover:bg-lacivert" : ""}
                  ${!aktif && !tamamlandi ? "border border-cizgi bg-white text-soluk" : ""}`}
              >
                {tamamlandi ? <Check size={14} strokeWidth={3} /> : i + 1}
              </button>
              {i < KIRA_ADIMLARI.length - 1 && (
                <span className={`mx-1 h-px flex-1 ${tamamlandi ? "bg-lacivert/60" : "bg-cizgi"}`} />
              )}
            </li>
          );
        })}
      </ol>
      <p className="mt-3 text-xs font-medium uppercase tracking-wide text-soluk">
        Adım {adim + 1} / {KIRA_ADIMLARI.length}
      </p>
      <h2 className="text-lg font-bold text-metin">{KIRA_ADIMLARI[adim].baslik}</h2>
    </nav>
  );
}
