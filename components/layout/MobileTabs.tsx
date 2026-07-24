"use client";

import { FileText, PencilLine } from "lucide-react";
import { useUIStore } from "@/lib/store/useUIStore";

export function MobileTabs() {
  const { sekme, setSekme } = useUIStore();

  return (
    <div className="border-t border-cizgi bg-white p-2 lg:hidden print:hidden">
      <div className="grid grid-cols-2 gap-1 rounded-xl bg-zemin p-1">
        <button
          type="button"
          onClick={() => setSekme("form")}
          className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition
            ${sekme === "form" ? "bg-white text-lacivert shadow-sm" : "text-soluk"}`}
        >
          <PencilLine size={16} /> Form
        </button>
        <button
          type="button"
          onClick={() => setSekme("onizleme")}
          className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition
            ${sekme === "onizleme" ? "bg-white text-lacivert shadow-sm" : "text-soluk"}`}
        >
          <FileText size={16} /> Önizleme
        </button>
      </div>
    </div>
  );
}
