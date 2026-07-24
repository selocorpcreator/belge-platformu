import type { ReactNode } from "react";

type Props = {
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
};

export function Field({ label, error, hint, children }: Props) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-metin">{label}</span>
      {children}
      {hint && !error && <span className="mt-1 block text-xs text-soluk">{hint}</span>}
      {error && <span className="mt-1 block text-xs font-medium text-muhur">{error}</span>}
    </label>
  );
}
