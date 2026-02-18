import { NextRequest, NextResponse } from "next/server";

const LEMONSQUEEZY_API_KEY = process.env.LEMONSQUEEZY_API_KEY;
const LEMONSQUEEZY_STORE_ID = process.env.LEMONSQUEEZY_STORE_ID;

// Variant IDs mapped to plan names — set these in env or hardcode after creating products
const VARIANT_MAP: Record<string, string> = {
  starter: process.env.LEMONSQUEEZY_STARTER_VARIANT_ID || "",
  pro: process.env.LEMONSQUEEZY_PRO_VARIANT_ID || "",
};

export async function POST(req: NextRequest) {
  try {
    const { plan } = await req.json();

    if (!plan || !["starter", "pro"].includes(plan)) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    if (!LEMONSQUEEZY_API_KEY || !LEMONSQUEEZY_STORE_ID) {
      return NextResponse.json(
        { error: "NOT_CONFIGURED", message: "결제 시스템 준비 중입니다." },
        { status: 503 }
      );
    }

    const variantId = VARIANT_MAP[plan];
    if (!variantId) {
      return NextResponse.json(
        { error: "NOT_CONFIGURED", message: "상품이 아직 등록되지 않았습니다." },
        { status: 503 }
      );
    }

    const origin = req.nextUrl.origin;

    const res = await fetch("https://api.lemonsqueezy.com/v1/checkouts", {
      method: "POST",
      headers: {
        Accept: "application/vnd.api+json",
        "Content-Type": "application/vnd.api+json",
        Authorization: `Bearer ${LEMONSQUEEZY_API_KEY}`,
      },
      body: JSON.stringify({
        data: {
          type: "checkouts",
          attributes: {
            checkout_data: {
              custom: { plan },
            },
            product_options: {
              redirect_url: `${origin}/pricing/success?plan=${plan}`,
            },
          },
          relationships: {
            store: { data: { type: "stores", id: LEMONSQUEEZY_STORE_ID } },
            variant: { data: { type: "variants", id: variantId } },
          },
        },
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Lemon Squeezy error:", text);
      return NextResponse.json({ error: "Checkout creation failed" }, { status: 500 });
    }

    const data = await res.json();
    const checkoutUrl = data.data.attributes.url;

    return NextResponse.json({ url: checkoutUrl });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
