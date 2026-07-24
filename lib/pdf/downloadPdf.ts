"use client";

/**
 * Önizleme DOM'unu klonlayıp ölçek (transform) olmadan
 * ekran dışında render ederek A4 PDF üretir.
 */
export async function belgeyiPdfIndir(kaynak: HTMLElement, dosyaAdi: string) {
  const html2pdf = (await import("html2pdf.js")).default;

  const klon = kaynak.cloneNode(true) as HTMLElement;
  klon.style.transform = "none";
  klon.style.margin = "0";
  klon.style.boxShadow = "none";

  const kap = document.createElement("div");
  kap.style.position = "fixed";
  kap.style.left = "-10000px";
  kap.style.top = "0";
  kap.appendChild(klon);
  document.body.appendChild(kap);

  try {
    await html2pdf()
      .set({
        margin: 0,
        filename: dosyaAdi,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        pagebreak: { mode: ["css", "legacy"] },
      })
      .from(klon)
      .save();
  } finally {
    document.body.removeChild(kap);
  }
}
