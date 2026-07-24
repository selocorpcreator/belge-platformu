"use client";

import { todayTR } from "@/lib/utils/numberToWords";
import { A4Document } from "./A4Document";
import type { IhtarnameData } from "@/lib/schemas";

type Props = {
  data: IhtarnameData;
};

export function IhtarnamePreview({ data }: Props) {
  const deadlineDate = new Date();
  deadlineDate.setDate(deadlineDate.getDate() + data.deadline);

  return (
    <A4Document>
      <h1 className="mb-8 text-center text-2xl font-bold">İHTARNAME</h1>

      <section className="mb-6">
        <h2 className="mb-3 font-bold">TARAFLAR</h2>
        <table className="w-full mb-4">
          <tbody>
            <tr>
              <td className="w-32">İhtar Eden:</td>
              <td className="border-b border-dark">{data.warningIssuedBy.fullName}</td>
            </tr>
            <tr>
              <td>İhtar Edilecek:</td>
              <td className="border-b border-dark">{data.warningSubject.fullName}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="mb-6">
        <h2 className="mb-3 font-bold">İHTAR KONUSU</h2>
        <p className="mb-4">{data.subject || "Konu belirtilmemiştir"}</p>
      </section>

      <section className="mb-6">
        <h2 className="mb-3 font-bold">OLAY ÖZETİ</h2>
        <ol className="space-y-2 list-decimal pl-5">
          {data.details.map((detail, i) => (
            <li key={i}>{detail.text || "Detay belirtilmemiştir"}</li>
          ))}
        </ol>
      </section>

      <section className="mb-6">
        <h2 className="mb-3 font-bold">TALEP</h2>
        <p className="mb-4">{data.demand || "Talep belirtilmemiştir"}</p>
        <p>
          <strong>Yerine Getirilme Süresi:</strong> {data.deadline} gün
          <br />
          <strong>Son Tarih:</strong> {deadlineDate.toLocaleDateString("tr-TR")}
          <br />
          <strong>Tebligat Şekli:</strong> {data.notificationMethod === "elden" ? "Elden" : data.notificationMethod === "posta" ? "Posta" : "Diğer"}
        </p>
      </section>

      <div className="mt-12 text-center">
        <p className="mb-12 border-t border-dark pt-4">
          {todayTR()}
        </p>
        <p className="text-sm font-medium">{data.warningIssuedBy.fullName}</p>
      </div>

      <footer className="mt-12 border-t border-dark pt-6 text-center text-[11px] text-gray-600">
        <p>Bu belge Kolay Belge Al aracılığıyla oluşturulmuştur.</p>
      </footer>
    </A4Document>
  );
}
