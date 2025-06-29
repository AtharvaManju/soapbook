// types/stripe-version-fix.d.ts

import type Stripe from 'stripe'

declare module 'stripe' {
  interface StripeConstructor {
    new (
      secretKey: string,
      config: {
        apiVersion: '2024-08-15'
      }
    ): Stripe
  }
}
