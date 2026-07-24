"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

const A4_GENISLIK_PX = 794; // 210mm @ 96dpi

/** İçindeki A4 sayfayı kapsayıcı genişliğine göre ölçekler */
export function A4Preview({ children }: { children: ReactNode }) {
  const kapRef = useRef<HTMLDivElement>(null);
  const sayfaRef = useRef<HTMLDivElement>(null);
  const [olcek, setOlcek] = useState(1);
  const [yukseklik, setYukseklik] = useState(1123);

  useEffect(() => {
    const kap = kapRef.current;
    const sayfa = sayfaRef.current;
    if (!kap || !sayfa) return;

    const guncelle = () => {
      const yeniOlcek = Math.min(1, kap.clientWidth / A4_GENISLIK_PX);
      setOlcek(yeniOlcek);
      setYukseklik(sayfa.offsetHeight * yeniOlcek);
    };

    const ro = new ResizeObserver(guncelle);
    ro.observe(kap);
    ro.observe(sayfa);
    guncelle();
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={kapRef} className="mx-auto w-full max-w-[840px]">
      <div style={{ height: yukseklik }} className="print:h-auto">
        <div
          ref={sayfaRef}
          style={{ width: A4_GENISLIK_PX, transform: `scale(${olcek})` }}
          className="origin-top-left print:!transform-none"
        >
          {children}
        </div>
      </div>
    </div>
  );
}
