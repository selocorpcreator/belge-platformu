"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { BelgeKabuk, ImzaBloklari, TarafTablo, yada, BOS } from "@/components/preview/BelgeKabuk";
import { tutarBicimle, tutarYaziyaCevir } from "@/lib/utils/sayiyiYaziyaCevir";
import { tarihBicimle, bugunTr } from "@/lib/utils/tarih";
import type { IbranameData } from "@/lib/schemas/ibraname";

export function IbranameDoc() {
  const { control } = useFormContext<IbranameData>();
  const d = useWatch({ control }) as IbranameData;

  const isIliskisi = d?.tur === "is";
  const kalemler = (d?.odemeKalemleri ?? []).filter((k) => k?.kalem?.trim());
  const toplam = kalemler.reduce((t, k) => t + (Number(k.tutar) || 0), 0);
  const beyanlar = (d?.ekBeyanlar ?? []).filter((b) => b?.metin?.trim());

  return (
    <BelgeKabuk belgeNoKey="belge:ibraname:no">
      <h1 className="text-center text-[19px] font-bold tracking-wide">İBRANAME</h1>

      <div className="mt-6 grid grid-cols-1 gap-4">
        <TarafTablo
          baslik={isIliskisi ? "İBRA EDEN (İŞÇİ)" : "İBRA EDEN (ALACAKLI)"}
          satirlar={[
            ["Adı Soyadı", d?.ibraEden?.adSoyad],
            ["T.C. Kimlik No", d?.ibraEden?.tcNo],
            ["Telefon", d?.ibraEden?.telefon],
            ["Adres", d?.ibraEden?.adres],
          ]}
        />
        <TarafTablo
          baslik={isIliskisi ? "İBRA EDİLEN (İŞVEREN)" : "İBRA EDİLEN (BORÇLU)"}
          satirlar={[
            ["Adı / Unvanı", d?.ibraEdilen?.adSoyad],
            ["T.C. / Vergi No", d?.ibraEdilen?.tcNo],
            ["Telefon", d?.ibraEdilen?.telefon],
            ["Adres", d?.ibraEdilen?.adres],
          ]}
        />
      </div>

      {isIliskisi ? (
        <>
          <h2 className="mt-5 text-[14px] font-bold">İŞ İLİŞKİSİ BİLGİLERİ</h2>
          <p className="mt-1">
            İşveren nezdinde <strong>{yada(d?.gorev)}</strong> görevinde,{" "}
            <strong>{d?.iseGirisTarihi ? tarihBicimle(d.iseGirisTarihi) : BOS}</strong> —{" "}
            <strong>{d?.istenAyrilisTarihi ? tarihBicimle(d.istenAyrilisTarihi) : BOS}</strong> tarihleri
            arasında çalıştım. İş sözleşmem sona ermiş olup, iş ilişkisinden doğan tüm hak ve
            alacaklarım aşağıda dökümü yapıldığı şekilde tarafıma eksiksiz ödenmiştir.
          </p>
        </>
      ) : (
        <>
          <h2 className="mt-5 text-[14px] font-bold">İBRA KONUSU</h2>
          <p className="mt-1">{yada(d?.konu)}</p>
        </>
      )}

      {kalemler.length > 0 && (
        <>
          <h2 className="mt-5 text-[14px] font-bold">ÖDEME DÖKÜMÜ</h2>
          <table className="no-break mt-2 w-full border border-black/40 text-[12px]">
            <thead>
              <tr className="border-b border-black/40 bg-black/5">
                <th className="px-2 py-1 text-left">Ödeme Kalemi</th>
                <th className="w-40 px-2 py-1 text-right">Tutar</th>
              </tr>
            </thead>
            <tbody>
              {kalemler.map((k, i) => (
                <tr key={i} className="border-b border-black/20">
                  <td className="px-2 py-1">{k.kalem}</td>
                  <td className="px-2 py-1 text-right">{tutarBicimle(Number(k.tutar) || 0)}</td>
                </tr>
              ))}
              <tr className="font-bold">
                <td className="px-2 py-1">TOPLAM</td>
                <td className="px-2 py-1 text-right">{tutarBicimle(toplam)}</td>
              </tr>
            </tbody>
          </table>
          {toplam > 0 && (
            <p className="mt-1 text-[12px] italic">Yalnız: {tutarYaziyaCevir(toplam)}</p>
          )}
        </>
      )}

      <h2 className="mt-5 text-[14px] font-bold">İBRA BEYANI</h2>
      <p className="mt-1">
        Yukarıda belirtilen tutarların tamamı{" "}
        <strong>{d?.odemeSekli === "banka" ? "banka hesabıma havale/EFT yoluyla" : "elden nakit olarak"}</strong>{" "}
        tarafıma ödenmiştir. Söz konusu {isIliskisi ? "iş ilişkisinden" : "hukuki ilişkiden"} doğan
        başkaca hiçbir hak ve alacağım kalmadığını; ibra edileni geçmişe dönük her türlü alacak, tazminat
        ve talep bakımından gayrikabili rücu olmak üzere <strong>ibra ettiğimi</strong> beyan ederim.
      </p>

      {isIliskisi && (
        <p className="mt-2 text-[12px] italic">
          İşbu ibraname, 6098 sayılı Türk Borçlar Kanunu m.420 uyarınca; iş sözleşmesinin sona ermesinden
          itibaren en az bir aylık süre geçtikten sonra, alacak türleri ve miktarları açıkça yazılarak ve
          ödemeler banka aracılığıyla yapılmak suretiyle düzenlenmiştir.
        </p>
      )}

      {beyanlar.length > 0 && (
        <>
          <h2 className="mt-5 text-[14px] font-bold">EK BEYANLAR</h2>
          <ol className="mt-1 list-decimal space-y-1 pl-5">
            {beyanlar.map((b, i) => (
              <li key={i} className="clause">{b.metin}</li>
            ))}
          </ol>
        </>
      )}

      <p className="mt-5">
        İşbu ibraname, tarafımca okunup içeriği anlaşılarak <strong>{bugunTr()}</strong> tarihinde hür
        iradem ile imzalanmıştır.
      </p>

      <ImzaBloklari
        sol={{ rol: "İBRA EDEN", ad: d?.ibraEden?.adSoyad }}
        sag={{ rol: "İBRA EDİLEN", ad: d?.ibraEdilen?.adSoyad }}
      />
    </BelgeKabuk>
  );
}
