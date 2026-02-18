import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const WEBHOOK_SECRET = process.env.LEMONSQUEEZY_WEBHOOK_SECRET || "";

function verifySignature(payload: string, signature: string): boolean {
  if (!WEBHOOK_SECRET) return false;
  const hmac = crypto.createHmac("sha256", WEBHOOK_SECRET);
  const digest = hmac.update(payload).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-signature") || "";

    if (WEBHOOK_SECRET && !verifySignature(rawBody, signature)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(rawBody);
    const eventName = event.meta?.event_name;

    console.log(`[LemonSqueezy Webhook] ${eventName}`, JSON.stringify(event.meta));

    switch (eventName) {
      case "order_created": {
        const plan = event.meta?.custom_data?.plan || "starter";
        const orderId = event.data?.id;
        const customerEmail = event.data?.attributes?.user_email;
        
        // TODO: Save to DB when ready
        console.log(`[Order] Plan: ${plan}, Order: ${orderId}, Email: ${customerEmail}`);
        break;
      }
      case "subscription_created":
      case "subscription_updated": {
        const status = event.data?.attributes?.status;
        console.log(`[Subscription] Status: ${status}`);
        break;
      }
      default:
        console.log(`[LemonSqueezy] Unhandled event: ${eventName}`);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
