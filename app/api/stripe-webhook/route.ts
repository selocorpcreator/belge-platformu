import { NextResponse } from "next/server";
import { getStripe } from "@/lib/payments/stripe";

export const runtime = "nodejs";

/**
 * POST /api/stripe-webhook
 * Stripe Dashboard > Webhooks'ta bu URL'yi tanımlayın ve
 * STRIPE_WEBHOOK_SECRET ortam değişkenini ekleyin.
 *
 * Ödeme tamamlandığında (checkout.session.completed) burada
 * müşteri kaydı yapılabilir (örn. Supabase'e Pro üyelik yazmak).
 */
export async function POST(req: Request) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) {
    return NextResponse.json({ error: "Webhook yapılandırılmamış" }, { status: 503 });
  }

  const imza = req.headers.get("stripe-signature");
  if (!imza) {
    return NextResponse.json({ error: "İmza eksik" }, { status: 400 });
  }

  const govde = await req.text();

  try {
    const event = await stripe.webhooks.constructEventAsync(govde, imza, secret);

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        // TODO: Üyelik sistemi eklendiğinde burada Pro erişimi tanımlanır.
        console.log("Ödeme tamamlandı:", session.id, session.customer_details?.email);
        break;
      }
      case "customer.subscription.deleted": {
        console.log("Abonelik iptal edildi:", event.data.object.id);
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ error: "İmza doğrulanamadı" }, { status: 400 });
  }
}
