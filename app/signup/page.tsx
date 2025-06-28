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
  const [error, setError] = useState<string | null>(null)

  // ✅ Simple client-side email validation
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
      const tempUser = await createUserWithEmailAndPassword(auth, email, password)
      await tempUser.user.delete()

      localStorage.setItem('signupData', JSON.stringify({ email, password, name }))

      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()
      const stripe = await stripePromise
      await stripe?.redirectToCheckout({ sessionId: data.id })
    } catch (err: any) {
      console.error('❌ Firebase error:', err)

      if (err.code === 'auth/email-already-in-use') {
        setError('Email is already in use.')
      } else if (err.code === 'auth/invalid-email') {
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
