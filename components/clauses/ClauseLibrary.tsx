"use client";

import { Plus, X, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { ContractTemplate } from "@/types/contract";

type Props = {
  hazirMaddeler: ContractTemplate["hazirMaddeler"];
  secili: string[];
  tumMaddeler: string[];
  onEkle: (maddeId: string) => void;
  onSil: (indeks: number) => void;
  onTasiYukari?: (indeks: number) => void;
  onTasiAsagi?: (indeks: number) => void;
  onOzelMaddeDuzelt?: (indeks: number, metin: string) => void;
};

export function ClauseLibrary({
  hazirMaddeler,
  secili,
  tumMaddeler,
  onEkle,
  onSil,
  onTasiYukari,
  onTasiAsagi,
  onOzelMaddeDuzelt,
}: Props) {
  return (
    <div className="space-y-4">
      <section>
        <h3 className="mb-2 text-sm font-semibold text-metin">Hazır Maddeler</h3>
        <p className="mb-3 text-xs text-soluk">Seçtikleriniz belgeye otomatik eklenir.</p>
        <div className="space-y-2">
          {hazirMaddeler.map((m) => {
            const aktif = secili.includes(m.id);
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => onEkle(m.id)}
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
        <h3 className="mb-2 text-sm font-semibold text-metin">Belge Maddeleri ({tumMaddeler.length})</h3>
        <div className="space-y-2 rounded-lg border border-cizgi bg-zemin p-3">
          {tumMaddeler.map((madde, i) => (
            <div key={i} className="flex items-center justify-between gap-2 rounded-lg bg-white p-2">
              <span className="flex-1 truncate text-sm text-metin">{madde}</span>
              <div className="flex gap-1">
                {onTasiYukari && i > 0 && (
                  <Button
                    type="button"
                    varyant="hayalet"
                    className="h-7 w-7 p-0"
                    onClick={() => onTasiYukari(i)}
                  >
                    <ChevronUp size={14} />
                  </Button>
                )}
                {onTasiAsagi && i < tumMaddeler.length - 1 && (
                  <Button
                    type="button"
                    varyant="hayalet"
                    className="h-7 w-7 p-0"
                    onClick={() => onTasiAsagi(i)}
                  >
                    <ChevronDown size={14} />
                  </Button>
                )}
                <Button
                  type="button"
                  varyant="tehlike"
                  className="h-7 w-7 p-0"
                  onClick={() => onSil(i)}
                >
                  <X size={14} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
