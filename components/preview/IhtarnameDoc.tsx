"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { BelgeKabuk, ImzaBloklari, TarafTablo, yada, BOS } from "@/components/preview/BelgeKabuk";
import { bugunTr } from "@/lib/utils/tarih";
import type { IhtarnameData } from "@/lib/schemas/ihtarname";

const TEBLIGAT: Record<string, string> = {
  posta: "iadeli taahhütlü posta yoluyla",
  elden: "elden imza karşılığı",
  emniyetveri: "noter aracılığıyla",
  diger: "taraflarca kararlaştırılan usulle",
};

export function IhtarnameDoc() {
  const { control } = useFormContext<IhtarnameData>();
  const d = useWatch({ control }) as IhtarnameData;

  const olaylar = (d?.ihtarOlaylar ?? []).filter((o) => o?.metin?.trim());

  return (
    <BelgeKabuk belgeNoKey="belge:ihtarname:no">
      <h1 className="text-center text-[19px] font-bold tracking-wide">İHTARNAME</h1>

      <div className="mt-6 grid grid-cols-1 gap-4">
        <TarafTablo
          baslik="İHTAR EDEN (KEŞİDECİ)"
          satirlar={[
            ["Adı Soyadı", d?.ihtatEden?.adSoyad],
            ["T.C. Kimlik No", d?.ihtatEden?.tcNo],
            ["Telefon", d?.ihtatEden?.telefon],
            ["Adres", d?.ihtatEden?.adres],
          ]}
        />
        <TarafTablo
          baslik="MUHATAP"
          satirlar={[
            ["Adı Soyadı", d?.muhatap?.adSoyad],
            ["T.C. Kimlik No", d?.muhatap?.tcNo],
            ["Telefon", d?.muhatap?.telefon],
            ["Adres", d?.muhatap?.adres],
          ]}
        />
      </div>

      <h2 className="mt-5 text-[14px] font-bold">KONU</h2>
      <p className="mt-1">{yada(d?.ihtarKonusu)}</p>

      <h2 className="mt-5 text-[14px] font-bold">AÇIKLAMALAR</h2>
      <p className="mt-1">Sayın Muhatap,</p>
      {olaylar.length > 0 ? (
        <ol className="mt-1 list-decimal space-y-1 pl-5">
          {olaylar.map((o, i) => (
            <li key={i} className="clause">{o.metin}</li>
          ))}
        </ol>
      ) : (
        <p className="mt-1">{BOS}</p>
      )}

      <h2 className="mt-5 text-[14px] font-bold">TALEP VE SONUÇ</h2>
      <p className="mt-1">
        Yukarıda açıklanan nedenlerle; {yada(d?.talep)}
      </p>
      <p className="mt-2">
        İşbu ihtarnamenin tarafınıza tebliğinden itibaren <strong>{d?.talipSure || BOS} gün</strong> içinde
        yukarıdaki talebin yerine getirilmesini; aksi takdirde aleyhinize her türlü yasal yola
        başvurulacağını, yargılama giderleri ile vekâlet ücretinin tarafınıza yükletileceğini ve işbu
        ihtarnamenin dava açma, temerrüt ve sair hukuki sonuçlar bakımından delil teşkil edeceğini
        ihtaren bildiririm.
      </p>
      <p className="mt-2">
        Tebligat, {TEBLIGAT[d?.tebligatSekli ?? "posta"]} yapılacaktır.
        {d?.tebligatSekli === "emniyetveri" && (
          <> Sayın Noter; üç nüshadan ibaret işbu ihtarnamenin bir nüshasının muhataba tebliğini, bir
          nüshasının dairenizde saklanmasını, tebliğ şerhli bir nüshasının tarafıma verilmesini talep ederim.</>
        )}
      </p>

      <p className="mt-5 text-right">{bugunTr()}</p>

      <div className="signature-block mt-10 ml-auto w-64 text-center">
        <p className="font-bold">İHTAR EDEN</p>
        <p className="mt-1 text-[12px]">{yada(d?.ihtatEden?.adSoyad)}</p>
        <p className="mt-10 border-t border-black pt-1 text-[11px]">İmza</p>
      </div>
    </BelgeKabuk>
  );
}
