import type { ButtonHTMLAttributes, ReactNode } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  varyant?: "birincil" | "ikincil" | "hayalet" | "tehlike";
  children: ReactNode;
};

const SINIFLAR: Record<string, string> = {
  birincil:
    "bg-lacivert text-white hover:bg-lacivert-koyu disabled:bg-cizgi disabled:text-soluk",
  ikincil:
    "border border-lacivert/30 bg-white text-lacivert hover:border-lacivert hover:bg-lacivert/5 disabled:opacity-50",
  hayalet: "text-soluk hover:bg-cizgi/50 hover:text-metin disabled:opacity-50",
  tehlike: "border border-muhur/40 bg-white text-muhur hover:bg-muhur/5 disabled:opacity-50",
};

export function Button({ varyant = "birincil", className = "", children, ...rest }: Props) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition
        focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lacivert
        disabled:cursor-not-allowed ${SINIFLAR[varyant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
