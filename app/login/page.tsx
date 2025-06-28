'use client'
import { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { useRouter } from 'next/navigation'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await signInWithEmailAndPassword(auth, email, password)
      router.push('/dashboard')
    } catch (err) {
      alert((err as Error).message)
    }
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Log In</h1>
      <form onSubmit={handleLogin} className="flex flex-col gap-3 w-80">
        <input
          className="border p-2"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          className="border p-2"
          placeholder="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button type="submit" className="bg-purple-600 text-white py-2 rounded">
          Log In
        </button>
      </form>

      <p className="mt-4 text-sm text-gray-600">
        Don’t have an account?{' '}
        <span
          onClick={() => router.push('/signup')}
          className="text-purple-600 hover:underline cursor-pointer"
        >
          Sign up here
        </span>
      </p>
    </main>
  )
}
