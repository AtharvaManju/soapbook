import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: NextRequest) {
  const body = await req.json()

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Soapbook Signup',
          },
          unit_amount: 5000, // $50
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/signup/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/signup/cancel`,
    metadata: {
      email: body.email,
    },
  })

  return NextResponse.json({ id: session.id })
}
