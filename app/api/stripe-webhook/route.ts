import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const PRICE_TO_PLAN: Record<string, { product: string; plan: string }> = {
  // BoxFlow OS
  'price_1TT9nBBEt8l7Ia34s0l71kiA': { product: 'boxflow', plan: 'Starter' },
  'price_1TTA57BEt8l7Ia34R4de9tBH': { product: 'boxflow', plan: 'Professional' },
  'price_1TTAAOBEt8l7Ia341Dkt6FNr': { product: 'boxflow', plan: 'Enterprise' },
  // MedFlow OS
  'price_1TTAIzBEt8l7Ia34YblJyS0v': { product: 'medflow', plan: 'Standard' },
  'price_1TTAMRBEt8l7Ia34P2kiYUZ4': { product: 'medflow', plan: 'Professional' },
  'price_1TTARABEt8l7Ia34wUDTw0NZ': { product: 'medflow', plan: 'Enterprise' },
  // PropFlow OS
  'price_1TTGetBEt8l7Ia34RpzMYm44': { product: 'propflow', plan: 'Starter' },
  'price_1TTGhmBEt8l7Ia34e1tKpf23': { product: 'propflow', plan: 'Professional' },
  'price_1TTGkpBEt8l7Ia34U0y8s9pX': { product: 'propflow', plan: 'Enterprise' },
  // ClassFlow AI
  'price_1TTBiBBEt8l7Ia34DRe2ilHK': { product: 'classflow', plan: 'Starter' },
  'price_1TTBknBEt8l7Ia34hNJSSP0h': { product: 'classflow', plan: 'Professional' },
  'price_1TTBnBBEt8l7Ia34fWXR2ClC': { product: 'classflow', plan: 'Enterprise' },
};

const REDIRECT_MAP: Record<string, string> = {
  boxflow:  'https://boxflow-os.vercel.app/dashboard',
  medflow:  'https://boxflow-os.vercel.app/medflow/dashboard',
  propflow: 'https://boxflow-os.vercel.app/propflow/dashboard',
  classflow:'https://boxflow-os.vercel.app/classflow/dashboard',
};

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig  = req.headers.get('stripe-signature')!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const metadata = session.metadata || {};
    const priceId  = metadata.price_id;
    const info     = priceId ? PRICE_TO_PLAN[priceId] : null;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const headers = {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal',
    };

    const affRef = metadata.affiliate_ref || null;

    // Save subscription to Supabase
    await fetch(`${supabaseUrl}/rest/v1/subscriptions`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        stripe_customer_id:    session.customer,
        stripe_session_id:     session.id,
        stripe_subscription_id: session.subscription,
        email:                 session.customer_details?.email,
        name:                  session.customer_details?.name,
        product:               info?.product || metadata.product,
        plan:                  info?.plan    || metadata.plan,
        status:                'active',
        company_name:          metadata.company_name,
        phone:                 metadata.phone,
        address:               metadata.address,
        affiliate_ref:         affRef,
        metadata:              JSON.stringify(metadata),
      }),
    }).catch(() => {});

    // Log affiliate conversion if ref present
    if (affRef) {
      // Look up the affiliate by ref_code
      const affRes = await fetch(
        `${supabaseUrl}/rest/v1/affiliates?ref_code=eq.${encodeURIComponent(affRef)}&select=id,commission_pct&limit=1`,
        { headers }
      ).catch(() => null);
      const affRows: any[] = affRes ? await affRes.json().catch(() => []) : [];
      const affiliate = affRows[0];

      if (affiliate) {
        const amount = session.amount_total ? session.amount_total / 100 : 0;
        const commissionPct = Number(affiliate.commission_pct) || 3;
        const commissionUsd = parseFloat((amount * commissionPct / 100).toFixed(2));

        await fetch(`${supabaseUrl}/rest/v1/affiliate_conversions`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            aff_id:         affiliate.id,
            product:        info?.product || metadata.product || 'boxflow',
            plan:           info?.plan    || metadata.plan    || 'Starter',
            mrr_usd:        amount,
            commission_pct: commissionPct,
            commission_usd: commissionUsd,
            status:         'pending',
            converted_at:   new Date().toISOString(),
            notes:          `Stripe session ${session.id} — customer ${session.customer_details?.email}`,
          }),
        }).catch(() => {});
      }
    }
  }

  return NextResponse.json({ received: true });
}