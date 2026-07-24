"use client";

import { useEffect, useRef, useState } from "react";

const A4_WIDTH_MM = 210;
const A4_WIDTH_PX = 794; // @96dpi
const A4_HEIGHT_MM = 297;
const A4_HEIGHT_PX = 1123; // @96dpi

type Props = {
  children: React.ReactNode;
  className?: string;
};

export function A4Document({ children, className = "" }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateScale = () => {
      const available = container.clientWidth;
      const newScale = Math.min(1, available / A4_WIDTH_PX);
      setScale(newScale);
    };

    updateScale();
    const ro = new ResizeObserver(updateScale);
    ro.observe(container);

    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={`mx-auto flex justify-center bg-light p-4 ${className}`}
    >
      <div
        id="document-print"
        style={{
          width: A4_WIDTH_PX,
          minHeight: A4_HEIGHT_PX,
          transform: `scale(${scale})`,
          transformOrigin: "top center",
        }}
        className="bg-white shadow-document"
      >
        <div className="px-16 py-12 font-legal text-[13px] leading-relaxed text-dark">
          {children}
        </div>
      </div>
    </div>
  );
}
