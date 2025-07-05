import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

// ✅ Ensure your .env.local has this defined:
// STRIPE_SECRET_KEY=sk_test_...
// NEXT_PUBLIC_BASE_URL=http://localhost:3000 (or your deployed URL)

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    console.log('📨 Received body:', body)

    if (!body.email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // ✅ Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: body.email,
      line_items: [
        {
          price: 'price_1RhRtKKsymaLZl8c4NqfUBYg', // ✅ Replace with your real Price ID
          quantity: 1,
        },
      ],
      subscription_data: {
        trial_period_days: 7,
        metadata: { email: body.email },
      },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/signup/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/signup/cancel`,
    })

    console.log('✅ Stripe session created:', session.id)
    return NextResponse.json({ id: session.id })
  } catch (err: any) {
    console.error('❌ Stripe session error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
