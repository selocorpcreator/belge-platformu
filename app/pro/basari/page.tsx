import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default function BasariSayfasi() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-5 text-center">
      <CheckCircle2 size={56} className="text-lacivert" />
      <h1 className="mt-4 text-2xl font-bold text-metin">Ödemeniz alındı</h1>
      <p className="mt-2 text-soluk">
        Pro üyeliğiniz aktifleştirildi. Onay e-postası Stripe tarafından gönderilecektir.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-lg bg-lacivert px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-lacivert-koyu"
      >
        Belge oluşturmaya devam et
      </Link>
    </main>
  );
}
