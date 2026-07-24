"use client";

import { useEffect, useState } from "react";
import { FileText, Trash2, RotateCcw, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useDraftsStore, type Draft } from "@/lib/store/useDraftsStore";

type Props = {
  acik: boolean;
  onKapat: () => void;
  onAc: (taslakId: string) => void;
  sablonTipi: string;
};

export function DraftsPanel({ acik, onKapat, onAc, sablonTipi }: Props) {
  const taslaklarim = useDraftsStore((s) => s.taslaklarim);
  const taslakSil = useDraftsStore((s) => s.taslakSil);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const filtrelenmis = taslaklarim.filter((t) => t.sablonTipi === sablonTipi);

  return (
    <>
      {acik && (
        <div className="fixed inset-0 z-40 bg-black/30 print:hidden" onClick={onKapat} />
      )}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-80 max-w-[90vw] transform bg-white shadow-2xl transition-transform print:hidden
          ${acik ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-cizgi px-5 py-4">
            <h2 className="text-lg font-bold text-metin">Taslaklarım</h2>
            <button
              type="button"
              onClick={onKapat}
              className="rounded-lg hover:bg-zemin"
              aria-label="Kapat"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4">
            {filtrelenmis.length === 0 ? (
              <div className="py-8 text-center">
                <FileText size={40} className="mx-auto mb-2 text-cizgi" />
                <p className="text-sm text-soluk">Henüz taslak yok</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filtrelenmis.map((t) => (
                  <div
                    key={t.id}
                    className="group flex items-center justify-between gap-2 rounded-lg border border-cizgi p-3 hover:bg-zemin"
                  >
                    <button
                      type="button"
                      onClick={() => onAc(t.id)}
                      className="flex-1 text-left"
                    >
                      <p className="font-medium text-metin line-clamp-1">{t.baslik || "Başlıksız"}</p>
                      <p className="text-xs text-soluk">
                        {new Date(t.guncellemeTarihi).toLocaleDateString("tr-TR")}
                      </p>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`"${t.baslik}" silinecek. Emin misiniz?`)) {
                          taslakSil(t.id);
                        }
                      }}
                      className="rounded p-1 opacity-0 hover:bg-muhur/10 group-hover:opacity-100"
                      aria-label="Sil"
                    >
                      <Trash2 size={16} className="text-muhur" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-cizgi p-4">
            <Button type="button" varyant="hayalet" className="w-full" onClick={onKapat}>
              <RotateCcw size={16} /> Paneli Kapat
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
