"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { BelgeKabuk, ImzaBloklari, TarafTablo, yada, BOS } from "@/components/preview/BelgeKabuk";
import { tutarBicimle, tutarYaziyaCevir } from "@/lib/utils/sayiyiYaziyaCevir";
import { tarihBicimle, bugunTr } from "@/lib/utils/tarih";
import { konaklamaHesapla, type AirbnbData } from "@/lib/schemas/airbnb";

export function AirbnbDoc() {
  const { control } = useFormContext<AirbnbData>();
  const d = useWatch({ control }) as AirbnbData;

  const k = d?.konaklama;
  const { gece, konaklamaTutari, toplam } = konaklamaHesapla(
    k ?? ({} as AirbnbData["konaklama"])
  );
  const depozito = Number(k?.depozito) || 0;
  const temizlik = Number(k?.temizlikUcreti) || 0;
  const kurallar = (d?.evKurallari ?? []).filter((x) => x?.metin?.trim());

  return (
    <BelgeKabuk belgeNoKey="belge:airbnb:no">
      <h1 className="text-center text-[19px] font-bold tracking-wide">
        KISA SÜRELİ (TURİZM AMAÇLI) KONUT KİRALAMA SÖZLEŞMESİ
      </h1>

      <h2 className="mt-6 text-[14px] font-bold">MADDE 1 — TARAFLAR</h2>
      <div className="mt-2 grid grid-cols-2 gap-6">
        <TarafTablo
          baslik="KİRAYA VEREN (EV SAHİBİ)"
          satirlar={[
            ["Adı Soyadı", d?.evSahibi?.adSoyad],
            ["T.C. Kimlik No", d?.evSahibi?.tcNo],
            ["Telefon", d?.evSahibi?.telefon],
            ["Adres", d?.evSahibi?.adres],
          ]}
        />
        <TarafTablo
          baslik="KİRACI (MİSAFİR)"
          satirlar={[
            ["Adı Soyadı", d?.misafir?.adSoyad],
            ["Kimlik / Pasaport", d?.misafir?.tcNo],
            ["Telefon", d?.misafir?.telefon],
            ["Adres", d?.misafir?.adres],
          ]}
        />
      </div>

      <h2 className="mt-5 text-[14px] font-bold">MADDE 2 — TAŞINMAZ VE İZİN BELGESİ</h2>
      <p className="mt-1">
        Kiralanan konut; <strong>{yada(d?.tasinmaz?.il)}</strong> ili,{" "}
        <strong>{yada(d?.tasinmaz?.ilce)}</strong> ilçesi, {yada(d?.tasinmaz?.adres)} adresinde yer
        almaktadır. Konut, 7464 sayılı Konutların Turizm Amaçlı Kiralanmasına ve Bazı Kanunlarda
        Değişiklik Yapılmasına Dair Kanun uyarınca Kültür ve Turizm Bakanlığından alınmış{" "}
        <strong>{yada(d?.tasinmaz?.izinBelgesiNo)}</strong> numaralı turizm amaçlı kiralama izin
        belgesine sahiptir.
      </p>

      <h2 className="mt-5 text-[14px] font-bold">MADDE 3 — KONAKLAMA SÜRESİ</h2>
      <p className="mt-1">
        Konaklama; <strong>{k?.girisTarihi ? tarihBicimle(k.girisTarihi) : BOS}</strong> (giriş saati{" "}
        {yada(k?.girisSaati)}) — <strong>{k?.cikisTarihi ? tarihBicimle(k.cikisTarihi) : BOS}</strong>{" "}
        (çıkış saati {yada(k?.cikisSaati)}) tarihleri arasında toplam{" "}
        <strong>{gece > 0 ? `${gece} gece` : BOS}</strong> olarak kararlaştırılmıştır. Konutta en fazla{" "}
        <strong>{k?.misafirSayisi || BOS} kişi</strong> konaklayabilir. Konaklama süresi tek seferde 100
        günü aşamaz; süre uzatımı yeni sözleşmeye tabidir.
      </p>

      <h2 className="mt-5 text-[14px] font-bold">MADDE 4 — ÜCRET VE DEPOZİTO</h2>
      <table className="no-break mt-2 w-full border border-black/40 text-[12px]">
        <tbody>
          <tr className="border-b border-black/20">
            <td className="px-2 py-1">Gecelik ücret</td>
            <td className="w-44 px-2 py-1 text-right">{Number(k?.gecelikUcret) > 0 ? tutarBicimle(Number(k?.gecelikUcret)) : BOS}</td>
          </tr>
          <tr className="border-b border-black/20">
            <td className="px-2 py-1">Konaklama tutarı ({gece || "…"} gece)</td>
            <td className="px-2 py-1 text-right">{konaklamaTutari > 0 ? tutarBicimle(konaklamaTutari) : BOS}</td>
          </tr>
          {temizlik > 0 && (
            <tr className="border-b border-black/20">
              <td className="px-2 py-1">Temizlik ücreti</td>
              <td className="px-2 py-1 text-right">{tutarBicimle(temizlik)}</td>
            </tr>
          )}
          <tr className="font-bold">
            <td className="px-2 py-1">TOPLAM</td>
            <td className="px-2 py-1 text-right">{toplam > 0 ? tutarBicimle(toplam) : BOS}</td>
          </tr>
        </tbody>
      </table>
      {toplam > 0 && <p className="mt-1 text-[12px] italic">Yalnız: {tutarYaziyaCevir(toplam)}</p>}
      <p className="mt-2">
        {depozito > 0 ? (
          <>
            Misafir, girişte <strong>{tutarBicimle(depozito)}</strong> (<em>{tutarYaziyaCevir(depozito)}</em>)
            güvence bedeli öder; konutun hasarsız tesliminde bu bedel çıkışta iade edilir.
          </>
        ) : (
          <>Taraflarca güvence bedeli (depozito) alınmamasına karar verilmiştir.</>
        )}
      </p>

      <h2 className="mt-5 text-[14px] font-bold">MADDE 5 — GENEL HÜKÜMLER</h2>
      <ol className="mt-1 list-decimal space-y-1 pl-5">
        <li className="clause">1774 sayılı Kimlik Bildirme Kanunu uyarınca konaklayan tüm misafirlerin kimlik bilgileri, ev sahibi tarafından ilgili sisteme bildirilir; misafir bu bildirime gerekli bilgileri sağlamakla yükümlüdür.</li>
        <li className="clause">Misafir, konutu ve demirbaşları özenle kullanır; verdiği zararları tazmin eder.</li>
        <li className="clause">Konut, kiraya verenin yazılı izni olmaksızın üçüncü kişilere kullandırılamaz; sözleşmede yazılı misafir sayısı aşılamaz.</li>
        <li className="clause">Belirtilen çıkış tarihinde konut tahliye edilir; işbu sözleşme 6098 sayılı TBK'nın konut kiralarına ilişkin uzama hükümlerine tabi olmayan, süre sonunda kendiliğinden sona eren kısa süreli kullanım sözleşmesidir.</li>
        <li className="clause">Uyuşmazlıklarda konutun bulunduğu yer mahkemeleri ve icra daireleri yetkilidir.</li>
      </ol>

      {kurallar.length > 0 && (
        <>
          <h2 className="mt-5 text-[14px] font-bold">MADDE 6 — EV KURALLARI</h2>
          <ol className="mt-1 list-decimal space-y-1 pl-5">
            {kurallar.map((x, i) => (
              <li key={i} className="clause">{x.metin}</li>
            ))}
          </ol>
        </>
      )}

      <p className="mt-5">
        İşbu sözleşme taraflarca okunarak <strong>{bugunTr()}</strong> tarihinde iki nüsha olarak
        imzalanmıştır.
      </p>

      <ImzaBloklari
        sol={{ rol: "KİRAYA VEREN", ad: d?.evSahibi?.adSoyad }}
        sag={{ rol: "MİSAFİR", ad: d?.misafir?.adSoyad }}
      />
    </BelgeKabuk>
  );
}
