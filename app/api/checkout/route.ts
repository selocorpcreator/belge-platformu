import { NextResponse } from "next/server";
import { getStripe, PRO_FIYAT } from "@/lib/payments/stripe";

export const runtime = "nodejs";

/**
 * POST /api/checkout
 * Stripe Checkout oturumu oluşturur ve ödeme sayfası URL'sini döner.
 * Ortam değişkenleri:
 *  - STRIPE_SECRET_KEY  (zorunlu)
 *  - STRIPE_PRICE_ID    (opsiyonel; Dashboard'da tanımlı abonelik fiyatı.
 *                        Yoksa tek seferlik TL fiyatı inline oluşturulur)
 *  - NEXT_PUBLIC_SITE_URL (örn. https://kolaybelge.com)
 */
export async function POST(req: Request) {
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json(
      { error: "Ödeme sistemi yapılandırılmamış. STRIPE_SECRET_KEY ortam değişkenini ekleyin." },
      { status: 503 }
    );
  }

  const site =
    process.env.NEXT_PUBLIC_SITE_URL ??
    req.headers.get("origin") ??
    "http://localhost:3000";

  try {
    const priceId = process.env.STRIPE_PRICE_ID;

    const session = await stripe.checkout.sessions.create({
      mode: priceId ? "subscription" : "payment",
      line_items: priceId
        ? [{ price: priceId, quantity: 1 }]
        : [
            {
              quantity: 1,
              price_data: {
                currency: "try",
                unit_amount: PRO_FIYAT.aylikTl * 100,
                product_data: {
                  name: PRO_FIYAT.ad,
                  description: PRO_FIYAT.aciklama,
                },
              },
            },
          ],
      success_url: `${site}/pro/basari?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${site}/pro`,
      locale: "tr",
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const mesaj = err instanceof Error ? err.message : "Bilinmeyen hata";
    return NextResponse.json({ error: mesaj }, { status: 500 });
  }
}
