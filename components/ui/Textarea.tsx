import { forwardRef, type TextareaHTMLAttributes } from "react";

type Props = TextareaHTMLAttributes<HTMLTextAreaElement> & { hata?: boolean };

export const Textarea = forwardRef<HTMLTextAreaElement, Props>(function Textarea({ hata, className = "", ...rest }, ref) {
  return (
    <textarea
      ref={ref}
      className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-metin outline-none transition
        placeholder:text-soluk/60 focus:ring-2
        ${hata ? "border-muhur focus:ring-muhur/25" : "border-cizgi focus:border-lacivert focus:ring-lacivert/20"}
        ${className}`}
      {...rest}
    />
  );
});
