"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { BelgeKabuk, ImzaBloklari, TarafTablo, yada, BOS } from "@/components/preview/BelgeKabuk";
import { tutarBicimle, tutarYaziyaCevir } from "@/lib/utils/sayiyiYaziyaCevir";
import { tarihBicimle, bugunTr } from "@/lib/utils/tarih";
import type { TicaretAnlasmasiData } from "@/lib/schemas/ticaretAnlasmasi";

const ODEME: Record<string, string> = {
  pesin: "sözleşme imzasında peşin olarak",
  taksit: "taraflarca kararlaştırılan taksit planına göre",
  teslimde: "iş/mal tesliminde",
  aylik: "aylık dönemler halinde",
};

export function TicaretAnlasmasiDoc() {
  const { control } = useFormContext<TicaretAnlasmasiData>();
  const d = useWatch({ control }) as TicaretAnlasmasiData;

  const hizmet = d?.tur !== "satis";
  const saglayiciRol = hizmet ? "HİZMET VEREN" : "SATICI";
  const aliciRol = hizmet ? "HİZMET ALAN" : "ALICI";
  const bedel = Number(d?.bedel) || 0;
  const cezai = Number(d?.cezaiSart) || 0;
  const ozel = (d?.ozelSartlar ?? []).filter((s) => s?.metin?.trim());

  return (
    <BelgeKabuk belgeNoKey="belge:ticaret:no">
      <h1 className="text-center text-[19px] font-bold tracking-wide">
        {hizmet ? "HİZMET SÖZLEŞMESİ" : "SATIŞ SÖZLEŞMESİ"}
      </h1>

      <h2 className="mt-6 text-[14px] font-bold">MADDE 1 — TARAFLAR</h2>
      <div className="mt-2 grid grid-cols-2 gap-6">
        <TarafTablo
          baslik={saglayiciRol}
          satirlar={[
            ["Adı / Unvanı", d?.saglayici?.adSoyad],
            ["T.C. / Vergi No", d?.saglayici?.tcNo],
            ["Telefon", d?.saglayici?.telefon],
            ["Adres", d?.saglayici?.adres],
          ]}
        />
        <TarafTablo
          baslik={aliciRol}
          satirlar={[
            ["Adı / Unvanı", d?.alici?.adSoyad],
            ["T.C. / Vergi No", d?.alici?.tcNo],
            ["Telefon", d?.alici?.telefon],
            ["Adres", d?.alici?.adres],
          ]}
        />
      </div>

      <h2 className="mt-5 text-[14px] font-bold">MADDE 2 — SÖZLEŞMENİN KONUSU</h2>
      <p className="mt-1">{yada(d?.konu)}</p>

      <h2 className="mt-5 text-[14px] font-bold">MADDE 3 — BEDEL VE ÖDEME</h2>
      <p className="mt-1">
        Sözleşme bedeli <strong>{bedel > 0 ? tutarBicimle(bedel) : BOS}</strong>
        {bedel > 0 && <> (<em>{tutarYaziyaCevir(bedel)}</em>)</>}{" "}
        <strong>KDV {d?.kdvDahil === "dahil" ? "dahil" : "hariç"}</strong> olup, {aliciRol.toLocaleLowerCase("tr")}{" "}
        tarafından {ODEME[d?.odemePlani ?? "pesin"]} ödenecektir.
        {d?.odemeDetay?.trim() && <> Ödeme detayı: {d.odemeDetay}</>}
      </p>

      <h2 className="mt-5 text-[14px] font-bold">MADDE 4 — SÜRE VE TESLİM</h2>
      <p className="mt-1">
        İşbu sözleşme <strong>{d?.baslangicTarihi ? tarihBicimle(d.baslangicTarihi) : BOS}</strong>{" "}
        tarihinde yürürlüğe girer. {hizmet ? "Hizmet" : "Mal"}, bu tarihten itibaren en geç{" "}
        <strong>{d?.teslimSuresiGun || BOS} gün</strong> içinde eksiksiz olarak teslim/ifa edilecektir.
      </p>

      <h2 className="mt-5 text-[14px] font-bold">MADDE 5 — TEMERRÜT VE YAPTIRIM</h2>
      <ol className="mt-1 list-decimal space-y-1 pl-5">
        <li className="clause">
          Ödemede temerrüt halinde{" "}
          {d?.gecikmeFaizi === "yasal"
            ? "3095 sayılı Kanun ve 6102 sayılı TTK uyarınca ticari işlerde geçerli avans/temerrüt faizi uygulanır."
            : "taraflarca gecikme faizi uygulanmamasına karar verilmiştir."}
        </li>
        {cezai > 0 && (
          <li className="clause">
            Yükümlülüklerin ihlali halinde ihlal eden taraf, diğer tarafa{" "}
            <strong>{tutarBicimle(cezai)}</strong> (<em>{tutarYaziyaCevir(cezai)}</em>) cezai şart öder.
            Cezai şart, ayrıca tazminat talep hakkını ortadan kaldırmaz.
          </li>
        )}
        <li className="clause">
          Taraflardan biri yükümlülüklerini yazılı ihtara rağmen 15 gün içinde yerine getirmezse, diğer
          taraf sözleşmeyi haklı nedenle feshedebilir.
        </li>
      </ol>

      <h2 className="mt-5 text-[14px] font-bold">MADDE 6 — GENEL HÜKÜMLER</h2>
      <ol className="mt-1 list-decimal space-y-1 pl-5">
        <li className="clause">Taraflar, 6698 sayılı KVKK kapsamında edindikleri kişisel verileri yalnızca sözleşmenin ifası amacıyla işler.</li>
        <li className="clause">Mücbir sebep hallerinde yükümlülükler, engel ortadan kalkana kadar askıya alınır.</li>
        <li className="clause">Sözleşmede yapılacak değişiklikler yazılı olmadıkça geçerli değildir.</li>
        <li className="clause">
          İşbu sözleşmeden doğan uyuşmazlıklarda <strong>{yada(d?.yetkiliYer)}</strong> mahkemeleri ve
          icra daireleri yetkilidir.
        </li>
      </ol>

      {ozel.length > 0 && (
        <>
          <h2 className="mt-5 text-[14px] font-bold">MADDE 7 — ÖZEL ŞARTLAR</h2>
          <ol className="mt-1 list-decimal space-y-1 pl-5">
            {ozel.map((s, i) => (
              <li key={i} className="clause">{s.metin}</li>
            ))}
          </ol>
        </>
      )}

      <p className="mt-5">
        İşbu sözleşme {ozel.length > 0 ? "7 (yedi)" : "6 (altı)"} maddeden ibaret olup, taraflarca
        okunarak <strong>{bugunTr()}</strong> tarihinde iki nüsha olarak imzalanmıştır.
      </p>

      <ImzaBloklari
        sol={{ rol: saglayiciRol, ad: d?.saglayici?.adSoyad }}
        sag={{ rol: aliciRol, ad: d?.alici?.adSoyad }}
      />
    </BelgeKabuk>
  );
}
