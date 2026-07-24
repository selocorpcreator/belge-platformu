/** "kiraci.adSoyad" gibi bir path ile iç içe RHF hata mesajını döndürür */
export function getError(errors: Record<string, unknown>, path: string): string | undefined {
  const parts = path.split(".");
  let cur: unknown = errors;
  for (const p of parts) {
    if (cur && typeof cur === "object" && p in (cur as Record<string, unknown>)) {
      cur = (cur as Record<string, unknown>)[p];
    } else return undefined;
  }
  return (cur as { message?: string } | undefined)?.message;
}
