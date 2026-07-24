import Stripe from "stripe";

/**
 * Sunucu tarafı Stripe istemcisi.
 * STRIPE_SECRET_KEY yoksa null döner; API rotaları bunu kontrol eder.
 *
 * NOT: Stripe, Türkiye merkezli işletme hesaplarını doğrudan desteklemez.
 * Türkiye'den satış için seçenekler:
 *  - Stripe Atlas ile ABD şirketi kurup Stripe kullanmak
 *  - iyzico / PayTR (yerli sağlayıcılar)
 *  - Lemon Squeezy / Paddle (merchant of record — vergi işlerini de üstlenir)
 * Bu modül soyut tutuldu; sağlayıcı değişse de /api/checkout arayüzü aynı kalabilir.
 */
export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key);
}

export const PRO_FIYAT = {
  aylikTl: 79,
  ad: "KolayBelge Pro",
  aciklama: "Sınırsız belge, filigransız PDF ve öncelikli yeni şablonlar.",
};
