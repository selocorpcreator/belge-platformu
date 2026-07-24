"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

type Props = {
  left: React.ReactNode;
  right: React.ReactNode;
  title?: string;
};

export function SplitLayout({ left, right, title }: Props) {
  const [mobileView, setMobileView] = useState<"form" | "preview">("form");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isMobile) {
    return (
      <div className="flex h-dvh flex-col bg-light">
        {/* Header */}
        <header className="border-b border-border bg-white px-5 py-4 print:hidden">
          <h1 className="text-lg font-bold text-dark">{title}</h1>
        </header>

        {/* Mobile Tabs */}
        <div className="flex gap-2 border-b border-border bg-white px-5 py-2 print:hidden">
          <button
            onClick={() => setMobileView("form")}
            className={`px-4 py-2 font-medium rounded transition
              ${mobileView === "form" ? "bg-brand-500 text-white" : "text-dark hover:bg-light"}`}
          >
            Form
          </button>
          <button
            onClick={() => setMobileView("preview")}
            className={`px-4 py-2 font-medium rounded transition
              ${mobileView === "preview" ? "bg-brand-500 text-white" : "text-dark hover:bg-light"}`}
          >
            Önizleme
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {mobileView === "form" ? left : right}
        </div>
      </div>
    );
  }

  // Desktop split-screen
  return (
    <div className="flex h-screen bg-light">
      {/* Left: Form */}
      <div className="w-1/2 overflow-y-auto border-r border-border bg-white">
        <div className="p-8">{left}</div>
      </div>

      {/* Right: Preview */}
      <div className="w-1/2 overflow-y-auto bg-light p-8 print:w-full print:bg-white">
        {right}
      </div>
    </div>
  );
}
