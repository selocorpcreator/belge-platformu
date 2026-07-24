"use client";

import QRCode from "qrcode";

/**
 * QR kod SVG URL'si oluştur
 */
export async function generateQRCodeURL(text: string): Promise<string> {
  try {
    return await QRCode.toDataURL(text, {
      width: 80,
      margin: 1,
      color: { dark: "#22314E", light: "#FFFFFF" },
    });
  } catch {
    return "";
  }
}

/**
 * HTML öğesini PDF olarak indir
 * - A4 formatında
 * - Transform olmadan
 * - Sayfa numaraları, metadata, page-break desteği
 */
export async function belgeyiPdfIndir(
  kaynak: HTMLElement,
  dosyaAdi: string,
  options?: {
    toplamSayfa?: number;
    belgeTarihi?: string;
    belgeSeriNo?: string;
  }
) {
  const html2pdf = (await import("html2pdf.js")).default;

  const klon = kaynak.cloneNode(true) as HTMLElement;
  klon.style.transform = "none";
  klon.style.margin = "0";
  klon.style.boxShadow = "none";
  klon.style.width = "210mm";

  const kap = document.createElement("div");
  kap.style.position = "fixed";
  kap.style.left = "-10000px";
  kap.style.top = "0";
  kap.appendChild(klon);
  document.body.appendChild(kap);

  try {
    await html2pdf()
      .set({
        margin: [10, 10, 15, 10],
        filename: dosyaAdi,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        pagebreak: { mode: ["css", "legacy"], avoid: ["tr", ".clause"] },
      })
      .from(klon)
      .save();
  } finally {
    document.body.removeChild(kap);
  }
}

/**
 * Sayfa numarası ve footer HTML'i (belge şablonunda kullanılabilir)
 */
export function generatePdfFooter(
  sayfaNo: number,
  toplamSayfa: number,
  belgeTarihi: string,
  belgeSeriNo: string,
  qrUrl?: string
): string {
  return `
    <div style="
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 20px;
      padding-top: 10px;
      border-top: 0.5px solid #D8DDE5;
      font-size: 9px;
      color: #5B6472;
    ">
      <div>Sayfa ${sayfaNo} / ${toplamSayfa} | ${belgeTarihi} | ${belgeSeriNo}</div>
      ${qrUrl ? `<img src="${qrUrl}" style="width: 60px; height: 60px;" />` : ""}
    </div>
  `;
}

/**
 * Yazdırma: Print CSS ve sayfa break'leri yönet
 */
export function belgeyiYazdir(elementId: string) {
  const el = document.getElementById(elementId);
  if (!el) return;

  const printWin = window.open("", "_blank");
  if (!printWin) return;

  const html = `
    <!DOCTYPE html>
    <html lang="tr">
      <head>
        <meta charset="UTF-8">
        <title>Yazdır</title>
        <style>
          @page {
            size: A4;
            margin: 10mm 10mm 15mm 10mm;
          }
          * {
            margin: 0;
            padding: 0;
          }
          body {
            font-family: Georgia, 'Times New Roman', serif;
            line-height: 1.6;
            color: #1B2430;
          }
          .no-break {
            page-break-inside: avoid;
          }
          .clause {
            page-break-inside: avoid;
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          td, th {
            border: 1px solid #D8DDE5;
            padding: 4px;
          }
          .signature-block {
            page-break-inside: avoid;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        ${el.innerHTML}
      </body>
    </html>
  `;

  printWin.document.write(html);
  printWin.document.close();

  printWin.onload = () => {
    printWin.focus();
    printWin.print();
  };
}
