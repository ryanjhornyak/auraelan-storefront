import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-06-20',
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { items, discount_code } = req.body as {
      items: { name: string; unit_amount: number; quantity: number }[];
      discount_code?: string;
    };

    if (!items?.length) return res.status(400).json({ error: 'No items' });

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map((i) => ({
      quantity: i.quantity,
      price_data: {
        currency: 'usd',
        product_data: { name: i.name },
        unit_amount: i.unit_amount,
      },
      adjustable_quantity: { enabled: true, minimum: 1 },
    }));

    const origin =
      (req.headers['origin'] as string) ||
      (req.headers['referer'] as string)?.replace(/\/$/, '') ||
      'https://auraelan.vercel.app';

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items,
      discounts: discount_code ? [{ coupon: discount_code }] : undefined,
      success_url: `${origin}/?success=true`,
      cancel_url: `${origin}/?canceled=true`,
      shipping_address_collection: { allowed_countries: ['US', 'CA', 'GB', 'AU', 'NZ', 'IE', 'DE', 'FR'] },
      allow_promotion_codes: true,
    });

    return res.status(200).json({ url: session.url });
  } catch (err: any) {
    console.error('Stripe checkout error:', err);
    return res.status(500).json({ error: err?.message || 'Server error' });
  }
}
