"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { FileSignature, Home, MailWarning, Shield, ArrowRight, Stamp, Files, Briefcase, KeyRound, CheckSquare, Sparkles } from "lucide-react";
import { PLATFORM_ADI, kategoriyeGoreGrupla, aktifSablonlar } from "@/lib/templates/registry";
import { Button } from "@/components/ui/Button";
import { DraftsPanel } from "@/components/storage/DraftsPanel";
import { useDraftsStore } from "@/lib/store/useDraftsStore";

const IKONLAR: Record<string, any> = {
  home: Home,
  "mail-warning": MailWarning,
  shield: Shield,
  "file-signature": FileSignature,
  stamp: Stamp,
  check: CheckSquare,
  briefcase: Briefcase,
  key: KeyRound,
};

export default function AnaSayfa() {
  const [panelAcik, setPanelAcik] = useState(false);
  const [mounted, setMounted] = useState(false);
  const taslaklarim = useDraftsStore((s) => s.taslaklarim);

  useEffect(() => {
    setMounted(true);
  }, []);

  const kategoriler = kategoriyeGoreGrupla();

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-5 py-10 lg:py-16">
      {/* Header */}
      <header className="mb-12 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-lacivert text-white">
            <Stamp size={20} />
          </span>
          <div>
            <span className="block text-lg font-bold tracking-tight text-lacivert">{PLATFORM_ADI}</span>
            <span className="text-xs text-soluk">Ücretsiz Belge Oluşturucu</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
        <Link
          href="/pro"
          className="inline-flex items-center gap-1.5 rounded-lg border border-lacivert/30 px-3 py-2 text-sm font-semibold text-lacivert transition hover:bg-lacivert/5"
        >
          <Sparkles size={15} /> Pro
        </Link>
        {mounted && taslaklarim.length > 0 && (
          <Button varyant="ikincil" onClick={() => setPanelAcik(true)}>
            <Files size={16} /> Taslaklarım ({taslaklarim.length})
          </Button>
        )}
        </div>
      </header>

      {/* Hero */}
      <section className="mb-14 max-w-3xl lg:mb-16">
        <h1 className="text-4xl font-bold leading-tight text-metin lg:text-5xl">
          Resmi belgeler,
          <br />
          <span className="text-lacivert">canlı A4 önizlemeyle</span>
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-soluk">
          Belge türünü seçin, adım adım formu doldurun; belgeniz sağ tarafta gerçek baskı görünümünde anlık oluşsun.
          Ücretsiz PDF indirin veya yazdırın. Verileriniz yalnızca tarayıcınızda saklanır.
        </p>
      </section>

      {/* Şablon Kartları (Kategori Bazlı) */}
      {kategoriler.map(([kategori, sablonlar]) => (
        <section key={kategori} className="mb-10">
          <h2 className="mb-4 text-xl font-bold text-metin">{kategori}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sablonlar.map((s) => {
              const Ikon = IKONLAR[s.ikon];
              const kart = (
                <div className="group flex h-full flex-col rounded-xl border border-cizgi bg-white p-6 transition hover:border-lacivert hover:shadow-kagit">
                  <div className="flex items-center justify-between">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-lacivert/10 text-lacivert">
                      <Ikon size={20} />
                    </span>
                  </div>
                  <h3 className="mt-4 text-base font-bold text-metin">{s.ad}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-soluk">{s.aciklama}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-lacivert">
                    Belgeyi Oluştur
                    <ArrowRight size={15} className="transition group-hover:translate-x-0.5" />
                  </span>
                </div>
              );

              return (
                <Link key={s.slug} href={`/olustur/${s.slug}`}>
                  {kart}
                </Link>
              );
            })}
          </div>
        </section>
      ))}

      {/* Footer */}
      <footer className="mt-16 border-t border-cizgi pt-8 text-xs leading-relaxed text-soluk">
        <p>
          {PLATFORM_ADI} ile oluşturulan belgeler genel şablonlardır; hukuki danışmanlık yerine geçmez.
          Önemli işlemlerden önce bir avukata danışmanız önerilir.
        </p>
      </footer>

      {/* Taslaklar Paneli */}
      <DraftsPanel
        acik={panelAcik}
        onKapat={() => setPanelAcik(false)}
        onAc={(id) => {
          // Bu fonksiyon, seçilen taslağı forma yüklemek için çağrılır
          console.log("Taslak açıl:", id);
        }}
        sablonTipi="kira-sozlesmesi"
      />
    </main>
  );
}
