"use client";

import { useEffect, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { useUIStore } from "@/lib/store/useUIStore";
import { HAZIR_MADDELER, type KiraSozlesmesiData } from "@/lib/schemas/kiraSozlesmesi";
import { tutarBicimle, tutarYaziyaCevir } from "@/lib/utils/sayiyiYaziyaCevir";
import { tarihBicimle, bugunTr, belgeNoUret } from "@/lib/utils/tarih";
import { PLATFORM_ADI } from "@/lib/templates/registry";

const BOS = "………………………………";
const yada = (v: string | undefined, alt = BOS) => (v && v.trim() ? v : alt);

const MULK_TIPI: Record<string, string> = {
  konut: "Konut (Mesken)",
  isyeri: "İş Yeri",
  depo: "Depo",
  diger: "Diğer",
};

const ODEME_SEKLI: Record<string, string> = {
  havale: "banka havalesi / EFT yoluyla",
  nakit: "elden nakit olarak",
  diger: "taraflarca kararlaştırılan şekilde",
};

function TarafBlok({ baslik, kisi }: { baslik: string; kisi: KiraSozlesmesiData["kiraci"] }) {
  return (
    <div>
      <p className="font-bold">{baslik}</p>
      <table className="mt-1 w-full text-[13px]">
        <tbody>
          <tr><td className="w-32 py-0.5 align-top">Adı Soyadı</td><td className="py-0.5">: {yada(kisi?.adSoyad)}</td></tr>
          <tr><td className="py-0.5 align-top">T.C. Kimlik No</td><td className="py-0.5">: {yada(kisi?.tcNo)}</td></tr>
          <tr><td className="py-0.5 align-top">Telefon</td><td className="py-0.5">: {yada(kisi?.telefon)}</td></tr>
          <tr><td className="py-0.5 align-top">Tebligat Adresi</td><td className="py-0.5">: {yada(kisi?.adres)}</td></tr>
        </tbody>
      </table>
    </div>
  );
}

export function KiraSozlesmesiDoc() {
  const { control } = useFormContext<KiraSozlesmesiData>();
  const data = useWatch({ control }) as KiraSozlesmesiData;
  const duzenlemeModu = useUIStore((s) => s.duzenlemeModu);
  const [belgeNo, setBelgeNo] = useState("");

  // Belge no yalnızca tarayıcıda üretilir ve taslakla birlikte saklanır
  useEffect(() => {
    const KEY = "belge:kira-sozlesmesi:no";
    let no = localStorage.getItem(KEY);
    if (!no) {
      no = belgeNoUret();
      localStorage.setItem(KEY, no);
    }
    setBelgeNo(no);
  }, []);

  const f = data?.finansal;
  const kira = Number(f?.kiraBedeli) || 0;
  const depozito = Number(f?.depozito) || 0;

  const seciliHazir = HAZIR_MADDELER.filter((m) => data?.opsiyonelMaddeler?.includes(m.id));
  const ozelSartlar = (data?.ozelSartlar ?? []).filter((s) => s?.metin?.trim());
  const tumOzel = [...seciliHazir.map((m) => m.metin), ...ozelSartlar.map((s) => s.metin)];

  return (
    <div
      id="belge-a4"
      contentEditable={duzenlemeModu}
      suppressContentEditableWarning
      className={`min-h-[1123px] w-[794px] bg-kagit px-[64px] py-[56px] font-belge text-[13px] leading-relaxed text-black shadow-kagit outline-none print:shadow-none
        ${duzenlemeModu ? "ring-2 ring-amber-400" : ""}`}
    >
      <h1 className="text-center text-[19px] font-bold tracking-wide">
        {data?.tasinmaz?.mulkTipi === "isyeri" ? "İŞ YERİ" : "KONUT"} KİRA SÖZLEŞMESİ
      </h1>

      <h2 className="mt-6 text-[14px] font-bold">MADDE 1 — TARAFLAR</h2>
      <p className="mt-1">
        İşbu kira sözleşmesi, aşağıda bilgileri yazılı KİRAYA VEREN ile KİRACI arasında,
        belirtilen şartlar dahilinde karşılıklı olarak akdedilmiştir.
      </p>
      <div className="mt-3 grid grid-cols-2 gap-6">
        <TarafBlok baslik="KİRAYA VEREN" kisi={data?.kirayaVeren} />
        <TarafBlok baslik="KİRACI" kisi={data?.kiraci} />
      </div>

      <h2 className="mt-5 text-[14px] font-bold">MADDE 2 — KİRALANAN TAŞINMAZ</h2>
      <p className="mt-1">
        Kiralanan taşınmaz; <strong>{yada(data?.tasinmaz?.il)}</strong> ili,{" "}
        <strong>{yada(data?.tasinmaz?.ilce)}</strong> ilçesi, {yada(data?.tasinmaz?.adres)} adresinde
        bulunan <strong>{MULK_TIPI[data?.tasinmaz?.mulkTipi ?? "konut"]}</strong> niteliğindeki
        taşınmazdır. Taşınmaz, kiracıya kullanıma elverişli ve hasarsız şekilde teslim edilmiştir.
        {data?.tasinmaz?.demirbaslar?.trim() && (
          <> Taşınmazla birlikte teslim edilen demirbaşlar: {data.tasinmaz.demirbaslar}.</>
        )}
      </p>

      <h2 className="mt-5 text-[14px] font-bold">MADDE 3 — KİRA BEDELİ VE ÖDEME</h2>
      <p className="mt-1">
        Aylık kira bedeli{" "}
        <strong>{kira > 0 ? tutarBicimle(kira) : BOS}</strong>
        {kira > 0 && <> (<em>{tutarYaziyaCevir(kira)}</em>)</>} olup, kiracı tarafından her ayın{" "}
        <strong>{f?.odemeGunu || BOS}.</strong> günü {ODEME_SEKLI[f?.odemeSekli ?? "havale"]} ödenir.
        {f?.odemeSekli === "havale" && f?.iban?.trim() && (
          <> Ödemeler kiraya verenin <strong>{f.iban}</strong> IBAN numaralı hesabına yapılır.</>
        )}
      </p>
      <p className="mt-2">
        {depozito > 0 ? (
          <>
            Kiracı, sözleşme imzasında güvence bedeli (depozito) olarak{" "}
            <strong>{tutarBicimle(depozito)}</strong> (<em>{tutarYaziyaCevir(depozito)}</em>) teslim
            etmiştir. Depozito; taşınmazın hasarsız ve borçsuz tesliminde kiracıya iade edilir.
          </>
        ) : (
          <>Taraflarca depozito alınmamasına karar verilmiştir.</>
        )}
      </p>

      <h2 className="mt-5 text-[14px] font-bold">MADDE 4 — SÖZLEŞME SÜRESİ</h2>
      <p className="mt-1">
        Kira süresi <strong>{f?.sureAy || BOS} ay</strong> olup,{" "}
        <strong>{f?.baslangicTarihi ? tarihBicimle(f.baslangicTarihi) : BOS}</strong> tarihinde
        başlar. Süre sonunda taraflarca aksi bildirilmedikçe sözleşme yasal hükümler çerçevesinde
        yenilenmiş sayılır.
      </p>

      <h2 className="mt-5 text-[14px] font-bold">MADDE 5 — GENEL HÜKÜMLER</h2>
      <ol className="mt-1 list-decimal space-y-1 pl-5">
        <li>Kiracı, taşınmazı özenle kullanmak ve komşulara saygı göstermekle yükümlüdür.</li>
        <li>Elektrik, su, doğal gaz ve internet gibi kullanım giderleri kiracıya aittir.</li>
        <li>Kiracı, taşınmazı tahliye ederken teslim aldığı şekilde ve hasarsız iade eder.</li>
        <li>Kira artışı, yasal sınırlar çerçevesinde ve ilgili mevzuata uygun olarak yapılır.</li>
        <li>İşbu sözleşmeden doğan uyuşmazlıklarda taşınmazın bulunduğu yer mahkemeleri ve icra daireleri yetkilidir.</li>
      </ol>

      {tumOzel.length > 0 && (
        <>
          <h2 className="mt-5 text-[14px] font-bold">MADDE 6 — ÖZEL ŞARTLAR</h2>
          <ol className="mt-1 list-decimal space-y-1 pl-5">
            {tumOzel.map((metin, i) => (
              <li key={i}>{metin}</li>
            ))}
          </ol>
        </>
      )}

      <p className="mt-5">
        İşbu sözleşme {tumOzel.length > 0 ? "6 (altı)" : "5 (beş)"} maddeden ibaret olup, taraflarca
        okunarak <strong>{bugunTr()}</strong> tarihinde iki nüsha olarak imzalanmıştır.
      </p>

      <div className="mt-10 grid grid-cols-2 gap-6 text-center">
        <div>
          <p className="font-bold">KİRAYA VEREN</p>
          <p className="mt-1 text-[12px]">{yada(data?.kirayaVeren?.adSoyad)}</p>
          <p className="mt-10 border-t border-black pt-1 text-[11px]">İmza</p>
        </div>
        <div>
          <p className="font-bold">KİRACI</p>
          <p className="mt-1 text-[12px]">{yada(data?.kiraci?.adSoyad)}</p>
          <p className="mt-10 border-t border-black pt-1 text-[11px]">İmza</p>
        </div>
      </div>

      {/* Platform damgası + hukuki uyarı */}
      <div className="mt-12 flex items-end justify-between gap-4 border-t border-black/20 pt-3">
        <p className="max-w-[430px] text-[9px] leading-snug text-black/60">
          Bu belge {PLATFORM_ADI} ile oluşturulmuştur. İçerik genel bir şablondur; hukuki danışmanlık
          yerine geçmez ve platform, belgenin kullanımından doğacak sonuçlardan sorumlu tutulamaz.
        </p>
        <div className="shrink-0 -rotate-2 rounded border-2 border-muhur px-3 py-1.5 text-center text-muhur">
          <p className="text-[10px] font-bold tracking-widest">{PLATFORM_ADI.toUpperCase()}</p>
          <p className="text-[8px]">{belgeNo || "BLG-…"}</p>
          <p className="text-[8px]">{bugunTr()}</p>
        </div>
      </div>
    </div>
  );
}
