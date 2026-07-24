import { forwardRef, type SelectHTMLAttributes } from "react";

type Props = SelectHTMLAttributes<HTMLSelectElement> & { hata?: boolean };

export const Select = forwardRef<HTMLSelectElement, Props>(function Select({ hata, className = "", children, ...rest }, ref) {
  return (
    <select
      ref={ref}
      className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-metin outline-none transition focus:ring-2
        ${hata ? "border-muhur focus:ring-muhur/25" : "border-cizgi focus:border-lacivert focus:ring-lacivert/20"}
        ${className}`}
      {...rest}
    >
      {children}
    </select>
  );
});
