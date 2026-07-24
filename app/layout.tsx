import type { Metadata } from "next";
import "./globals.css";
import { PLATFORM_ADI } from "@/lib/templates/registry";

export const metadata: Metadata = {
  title: `${PLATFORM_ADI} — Ücretsiz Resmi Belge Oluşturucu`,
  description:
    "Kira sözleşmesi, ihtarname ve gizlilik sözleşmesi gibi belgeleri canlı A4 önizlemeyle dakikalar içinde hazırlayın, PDF indirin.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body className="min-h-screen bg-zemin font-sans text-metin antialiased">{children}</body>
    </html>
  );
}
