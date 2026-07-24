"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronLeft, Sparkles, Check, Stamp } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PLATFORM_ADI } from "@/lib/templates/registry";

const OZELLIKLER = [
  "Sınırsız belge oluşturma",
  "Filigransız, temiz PDF çıktısı",
  "Yeni şablonlara öncelikli erişim",
  "Taslaklarınız için genişletilmiş saklama",
];

export default function ProSayfasi() {
  const [yukleniyor, setYukleniyor] = useState(false);
  const [hata, setHata] = useState<string | null>(null);

  async function odemeyeGec() {
    setYukleniyor(true);
    setHata(null);
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const veri = await res.json();
      if (!res.ok || !veri.url) {
        throw new Error(veri.error ?? "Ödeme başlatılamadı");
      }
      window.location.href = veri.url;
    } catch (e) {
      setHata(e instanceof Error ? e.message : "Bilinmeyen hata");
      setYukleniyor(false);
    }
  }

  return (
    <main className="mx-auto min-h-screen max-w-2xl px-5 py-10">
      <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-lacivert">
        <ChevronLeft size={16} /> Ana Sayfa
      </Link>

      <div className="mt-4 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-lacivert text-white">
          <Stamp size={20} />
        </span>
        <h1 className="text-3xl font-bold text-metin">{PLATFORM_ADI} Pro</h1>
      </div>
      <p className="mt-3 text-soluk">
        Belgelerinizi profesyonel çıktıyla, sınırsız hazırlayın.
      </p>

      <div className="mt-8 rounded-2xl border border-lacivert/20 bg-white p-8 shadow-kagit">
        <div className="flex items-center gap-2">
          <Sparkles size={18} className="text-lacivert" />
          <span className="text-sm font-bold uppercase tracking-wide text-lacivert">Pro Üyelik</span>
        </div>
        <p className="mt-4 text-4xl font-bold text-metin">
          ₺79<span className="text-base font-medium text-soluk"> / ay</span>
        </p>
        <ul className="mt-6 space-y-3">
          {OZELLIKLER.map((o) => (
            <li key={o} className="flex items-start gap-2 text-sm text-metin">
              <Check size={16} className="mt-0.5 shrink-0 text-lacivert" /> {o}
            </li>
          ))}
        </ul>
        <Button className="mt-8 w-full" disabled={yukleniyor} onClick={odemeyeGec}>
          {yukleniyor ? "Yönlendiriliyor…" : "Pro'ya Geç"}
        </Button>
        {hata && <p className="mt-3 text-sm font-medium text-muhur">{hata}</p>}
        <p className="mt-4 text-xs text-soluk">
          Ödeme, Stripe güvenli ödeme sayfası üzerinden alınır. İstediğiniz zaman iptal edebilirsiniz.
        </p>
      </div>
    </main>
  );
}
