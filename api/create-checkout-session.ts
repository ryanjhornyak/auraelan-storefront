import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2023-10-16',
});

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { items, discount_code } = req.body as {
      items: { name: string; unit_amount: number; quantity: number }[];
      discount_code?: string;
    };

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'No items' });
    }

    const line_items = items.map((item) => ({
      quantity: item.quantity,
      price_data: {
        currency: 'usd',
        product_data: { name: item.name },
        unit_amount: item.unit_amount,
      },
      adjustable_quantity: { enabled: true, minimum: 1 },
    }));

    const origin =
      (req.headers.origin as string) ||
      ((req.headers.referer as string) || '').replace(/\/$/, '') ||
      'https://auraelan.vercel.app';

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items,
      discounts: discount_code ? [{ coupon: discount_code }] : undefined,
      success_url: `${origin}/?success=true`,
      cancel_url: `${origin}/?canceled=true`,
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB', 'AU', 'NZ', 'IE', 'DE', 'FR'],
      },
      allow_promotion_codes: true,
    });

    return res.status(200).json({ url: session.url });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}
