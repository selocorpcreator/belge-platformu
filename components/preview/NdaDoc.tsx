"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { BelgeKabuk, ImzaBloklari, TarafTablo, yada, BOS } from "@/components/preview/BelgeKabuk";
import { tutarBicimle, tutarYaziyaCevir } from "@/lib/utils/sayiyiYaziyaCevir";
import { bugunTr } from "@/lib/utils/tarih";
import type { NdaData } from "@/lib/schemas/nda";

export function NdaDoc() {
  const { control } = useFormContext<NdaData>();
  const d = useWatch({ control }) as NdaData;

  const karsilikli = d?.tur !== "tek";
  const cezai = Number(d?.cezaiSart) || 0;
  const ek = (d?.ekMaddeler ?? []).filter((m) => m?.metin?.trim());

  return (
    <BelgeKabuk belgeNoKey="belge:nda:no">
      <h1 className="text-center text-[19px] font-bold tracking-wide">
        {karsilikli ? "KARŞILIKLI " : ""}GİZLİLİK SÖZLEŞMESİ (NDA)
      </h1>

      <h2 className="mt-6 text-[14px] font-bold">MADDE 1 — TARAFLAR</h2>
      <div className="mt-2 grid grid-cols-2 gap-6">
        <TarafTablo
          baslik="AÇIKLAYAN TARAF"
          satirlar={[
            ["Adı / Unvanı", d?.acilklayan?.adSoyad],
            ["T.C. / Vergi No", d?.acilklayan?.tcNo],
            ["Telefon", d?.acilklayan?.telefon],
            ["Adres", d?.acilklayan?.adres],
          ]}
        />
        <TarafTablo
          baslik="ALAN TARAF"
          satirlar={[
            ["Adı / Unvanı", d?.alan?.adSoyad],
            ["T.C. / Vergi No", d?.alan?.tcNo],
            ["Telefon", d?.alan?.telefon],
            ["Adres", d?.alan?.adres],
          ]}
        />
      </div>
      {karsilikli && (
        <p className="mt-2 text-[12px] italic">
          İşbu sözleşme karşılıklı olup, her iki taraf da hem "Açıklayan" hem "Alan" taraf sıfatını haizdir.
        </p>
      )}

      <h2 className="mt-5 text-[14px] font-bold">MADDE 2 — AMAÇ</h2>
      <p className="mt-1">
        Taraflar, {yada(d?.amac)} amacıyla birbirlerine gizli bilgi açıklayacak olup, işbu sözleşme bu
        bilgilerin korunması şartlarını düzenler.
      </p>

      <h2 className="mt-5 text-[14px] font-bold">MADDE 3 — GİZLİ BİLGİNİN TANIMI</h2>
      <p className="mt-1">
        "Gizli Bilgi"; yazılı, sözlü, elektronik veya sair her türlü ortamda açıklanan ticari sırlar,
        finansal veriler, müşteri ve tedarikçi bilgileri, yazılım kaynak kodları, teknik bilgi (know-how),
        iş planları, fikri ve sınai mülkiyet hakları ile 6698 sayılı KVKK kapsamındaki kişisel verileri
        kapsar. Kamuya mal olmuş bilgiler, ifşa öncesinde Alan Tarafça hukuka uygun yolla bilinen
        bilgiler ve yasal merci kararıyla açıklanması zorunlu bilgiler gizli bilgi kapsamı dışındadır.
      </p>

      <h2 className="mt-5 text-[14px] font-bold">MADDE 4 — YÜKÜMLÜLÜKLER</h2>
      <ol className="mt-1 list-decimal space-y-1 pl-5">
        <li className="clause">Alan Taraf, Gizli Bilgiyi yalnızca Madde 2'deki amaç için kullanır; üçüncü kişilerle paylaşamaz, kopyalayamaz ve çoğaltamaz.</li>
        <li className="clause">Gizli Bilgiye erişimi olan çalışan ve danışmanların da bu yükümlülüklere uyması Alan Tarafça sağlanır.</li>
        <li className="clause">Sözleşme sona erdiğinde veya talep halinde Gizli Bilgi içeren tüm belge ve kopyalar iade edilir ya da imha edilir.</li>
        <li className="clause">Kişisel veriler bakımından taraflar, 6698 sayılı KVKK ve ikincil mevzuata uygun hareket eder.</li>
      </ol>

      <h2 className="mt-5 text-[14px] font-bold">MADDE 5 — SÜRE</h2>
      <p className="mt-1">
        İşbu sözleşme imza tarihinde yürürlüğe girer. Gizlilik yükümlülüğü, sözleşmenin sona ermesinden
        itibaren <strong>{d?.sureYil || BOS} yıl</strong> süreyle devam eder.
      </p>

      <h2 className="mt-5 text-[14px] font-bold">MADDE 6 — YAPTIRIM VE YETKİ</h2>
      <ol className="mt-1 list-decimal space-y-1 pl-5">
        {cezai > 0 && (
          <li className="clause">
            Gizlilik yükümlülüğünün ihlali halinde ihlal eden taraf, diğer tarafa{" "}
            <strong>{tutarBicimle(cezai)}</strong> (<em>{tutarYaziyaCevir(cezai)}</em>) cezai şart öder;
            bu tutarı aşan zararların tazmini hakkı saklıdır.
          </li>
        )}
        <li className="clause">Ticari sırların ihlali halinde 6102 sayılı TTK'nın haksız rekabet hükümleri saklıdır.</li>
        <li className="clause">
          Uyuşmazlıklarda <strong>{yada(d?.yetkiliYer)}</strong> mahkemeleri ve icra daireleri yetkilidir;
          Türk hukuku uygulanır.
        </li>
      </ol>

      {ek.length > 0 && (
        <>
          <h2 className="mt-5 text-[14px] font-bold">MADDE 7 — EK MADDELER</h2>
          <ol className="mt-1 list-decimal space-y-1 pl-5">
            {ek.map((m, i) => (
              <li key={i} className="clause">{m.metin}</li>
            ))}
          </ol>
        </>
      )}

      <p className="mt-5">
        İşbu sözleşme taraflarca okunarak <strong>{bugunTr()}</strong> tarihinde iki nüsha olarak
        imzalanmıştır.
      </p>

      <ImzaBloklari
        sol={{ rol: "AÇIKLAYAN TARAF", ad: d?.acilklayan?.adSoyad }}
        sag={{ rol: "ALAN TARAF", ad: d?.alan?.adSoyad }}
      />
    </BelgeKabuk>
  );
}
