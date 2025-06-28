import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

// Initialize Stripe with correct API version
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
})

export async function POST(req: NextRequest) {
  const body = await req.json()

  try {
    // Create a new Checkout session for a subscription with trial
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      customer_email: body.email,
      line_items: [
        {
          price: 'price_1OabcXYZREPLACE_THIS', // ⬅️ Replace with your real Price ID from Stripe Dashboard
          quantity: 1,
        },
      ],
      subscription_data: {
        trial_period_days: 7, // ✅ Add a 7-day trial before billing
        metadata: {
          email: body.email,
        },
      },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/signup/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/signup/cancel`,
    })

    // Return the session ID to redirect in frontend
    return NextResponse.json({ id: session.id })
  } catch (err: any) {
    console.error('❌ Stripe session error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
