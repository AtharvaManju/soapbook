'use client'
import { useState } from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // ✅ Step 1: Validate email/password with Firebase
      const tempUser = await createUserWithEmailAndPassword(auth, email, password)

      // ✅ Step 2: Delete the temp account (we’ll recreate after payment)
      await tempUser.user.delete()

      // ✅ Step 3: Store signup data locally
      localStorage.setItem('signupData', JSON.stringify({ email, password, name }))

      // ✅ Step 4: Call Stripe to create checkout session
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      // ✅ Step 5: Redirect to Stripe Checkout
      const stripe = await stripePromise
      await stripe?.redirectToCheckout({ sessionId: data.id })
    } catch (err: any) {
      console.error('Validation or Stripe error:', err.message)
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
      <form onSubmit={handleSignup} className="flex flex-col gap-3 w-80">
        <input
          className="border p-2"
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <input
          className="border p-2"
          placeholder="Email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          className="border p-2"
          placeholder="Password (6+ chars)"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-purple-600 text-white py-2 rounded"
          disabled={loading}
        >
          {loading ? 'Validating...' : 'Create Account & Pay'}
        </button>
      </form>
    </main>
  )
}
