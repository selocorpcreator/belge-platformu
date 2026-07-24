"use client";

import { todayTR, amountToWords, formatCurrency } from "@/lib/utils/numberToWords";
import { A4Document } from "./A4Document";
import type { IbraNamesData } from "@/lib/schemas";

type Props = {
  data: IbraNamesData;
};

export function IbraNamesPreview({ data }: Props) {
  return (
    <A4Document>
      <h1 className="mb-6 text-center text-2xl font-bold">İBRANAME</h1>

      <section className="mb-6">
        <p className="mb-4">
          İşbu ibraname,{" "}
          <strong className="border-b border-dark">
            {data.releasingParty.fullName || "..................................."}
          </strong>
          tarafından,{" "}
          <strong className="border-b border-dark">
            {data.releasedParty.fullName || "..................................."}
          </strong>
          nezdinde mahcuz olarak muhasebesi yapılmış olup, işbu vesika ile;
        </p>
      </section>

      <section className="mb-6">
        <h2 className="mb-3 font-bold">KONU</h2>
        <p className="mb-3">
          {data.subject || "Belge konusu belirtilmemiştir"}
        </p>
        {data.amount > 0 && (
          <p className="mb-3">
            <strong>Tutar:</strong> {formatCurrency(data.amount)}
            <br />
            <strong>Yazılı:</strong> {amountToWords(data.amount)}
          </p>
        )}
        <p>{data.description || "Açıklama belirtilmemiştir"}</p>
      </section>

      <section className="mb-6">
        <h2 className="mb-3 font-bold">BEYAN VE TAAHhÜT</h2>
        <ol className="space-y-2 list-decimal pl-5">
          <li>Tüm borç ve alacaklar eksiksiz ödenmiş/karşılanmıştır.</li>
          <li>Hiçbir talep ve itiraz bulunmamaktadır.</li>
          {data.rights && data.rights.length > 0 && (
            <li>Feragat edilen haklar: {data.rights.join(", ")}</li>
          )}
        </ol>
      </section>

      <div className="mt-12 flex justify-between">
        <div className="text-center">
          <p className="mb-12 border-t border-dark pt-2 text-sm">İbra Eden</p>
          <p className="text-sm font-medium">{data.releasingParty.fullName}</p>
        </div>
        <div className="text-center">
          <p className="mb-12 border-t border-dark pt-2 text-sm">İbra Edilen</p>
          <p className="text-sm font-medium">{data.releasedParty.fullName}</p>
        </div>
      </div>

      <footer className="mt-12 border-t border-dark pt-6 text-center text-[11px] text-gray-600">
        <p>Bu belge Kolay Belge Al aracılığıyla {todayTR()} tarihinde oluşturulmuştur.</p>
        <p className="mt-2">Yasal danışmanlık yerine geçmez. Önemli işlemler için avukat danışması alınız.</p>
      </footer>
    </A4Document>
  );
}
