'use client'
import { useState } from 'react'
import { fetchSignInMethodsForEmail } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isEmailValid = email.includes('@') && email.includes('.')
  const isPasswordValid = password.length >= 6
  const isNameValid = name.trim().length > 0
  const formValid = isEmailValid && isPasswordValid && isNameValid

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!formValid) return
    setLoading(true)

    try {
      // ✅ Check if email already exists
      const methods = await fetchSignInMethodsForEmail(auth, email)
      if (methods.length > 0) {
        setError('Email is already in use.')
        setLoading(false)
        return
      }

      // Save user input for later use after Stripe redirect
      localStorage.setItem('signupData', JSON.stringify({ email, password, name }))

      // Call backend to create Stripe session
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()
      console.log('🔍 Checkout session response:', data)

      if (!data.id) throw new Error('No Stripe session ID returned.')

      const stripe = await stripePromise
      if (!stripe) throw new Error('Stripe failed to load.')

      const result = await stripe.redirectToCheckout({ sessionId: data.id })
      if (result.error) throw new Error(result.error.message)
    } catch (err: any) {
      console.error('❌ Signup error:', err)
      if (err.code === 'auth/invalid-email') {
        setError('Invalid email format.')
      } else {
        setError(err.message || 'Signup failed.')
      }
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
        {error && <p className="text-red-600 text-sm -mt-2">{error}</p>}
        <button
          type="submit"
          className={`py-2 rounded text-white ${
            formValid && !loading
              ? 'bg-purple-600 hover:bg-purple-700'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
          disabled={!formValid || loading}
        >
          {loading ? 'Checking...' : 'Create Account & Pay'}
        </button>
      </form>
    </main>
  )
}
