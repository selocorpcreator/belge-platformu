"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { BelgeKabuk, ImzaBloklari, TarafTablo, yada, BOS } from "@/components/preview/BelgeKabuk";
import { tarihBicimle, bugunTr } from "@/lib/utils/tarih";
import type { MuvafakatnameData } from "@/lib/schemas/muvafakatname";

export function MuvafakatnameDoc() {
  const { control } = useFormContext<MuvafakatnameData>();
  const d = useWatch({ control }) as MuvafakatnameData;

  const kosullar = (d?.kosullar ?? []).filter((k) => k?.metin?.trim());

  return (
    <BelgeKabuk belgeNoKey="belge:muvafakatname:no">
      <h1 className="text-center text-[19px] font-bold tracking-wide">MUVAFAKATNAME</h1>

      <div className="mt-6 grid grid-cols-1 gap-4">
        <TarafTablo
          baslik="MUVAFAKAT EDEN"
          satirlar={[
            ["Adı Soyadı", d?.muvafakatEden?.adSoyad],
            ["T.C. Kimlik No", d?.muvafakatEden?.tcNo],
            ["Telefon", d?.muvafakatEden?.telefon],
            ["Adres", d?.muvafakatEden?.adres],
          ]}
        />
        <TarafTablo
          baslik="MUVAFAKAT VERİLEN TARAF"
          satirlar={[
            ["Adı Soyadı", d?.taraf?.adSoyad],
            ["T.C. Kimlik No", d?.taraf?.tcNo],
            ["Telefon", d?.taraf?.telefon],
            ["Adres", d?.taraf?.adres],
          ]}
        />
      </div>

      <h2 className="mt-5 text-[14px] font-bold">MUVAFAKAT KONUSU</h2>
      <p className="mt-1">
        Aşağıda kimlik bilgileri yazılı Muvafakat Eden olarak; {yada(d?.izinVerilenKonu)} hususunda,
        yukarıda bilgileri yazılı tarafa açık rızam ile <strong>muvafakat ettiğimi</strong> beyan ederim.
      </p>

      {kosullar.length > 0 && (
        <>
          <h2 className="mt-5 text-[14px] font-bold">KOŞULLAR</h2>
          <ol className="mt-1 list-decimal space-y-1 pl-5">
            {kosullar.map((k, i) => (
              <li key={i} className="clause">{k.metin}</li>
            ))}
          </ol>
        </>
      )}

      <h2 className="mt-5 text-[14px] font-bold">GEÇERLİLİK</h2>
      <p className="mt-1">
        İşbu muvafakat, <strong>{d?.gecerliliktarihi ? tarihBicimle(d.gecerliliktarihi) : BOS}</strong>{" "}
        tarihinden itibaren{" "}
        {d?.gecerlilikturu === "surezli" && d?.gecerliliktarihi_bitis ? (
          <>
            <strong>{tarihBicimle(d.gecerliliktarihi_bitis)}</strong> tarihine kadar geçerlidir.
          </>
        ) : (
          <>süresiz olarak geçerlidir.</>
        )}
        {d?.iptalSartlari?.trim() && <> Muvafakatin geri alınması: {d.iptalSartlari}</>}
      </p>

      <p className="mt-5">
        İşbu muvafakatname tarafımca okunup anlaşılarak <strong>{bugunTr()}</strong> tarihinde hür iradem
        ile imzalanmıştır.
      </p>

      <ImzaBloklari
        sol={{ rol: "MUVAFAKAT EDEN", ad: d?.muvafakatEden?.adSoyad }}
        sag={{ rol: "TARAF", ad: d?.taraf?.adSoyad }}
      />
    </BelgeKabuk>
  );
}
