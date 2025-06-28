'use client'
import { useState } from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth, db } from '@/lib/firebase'
import { doc, setDoc } from 'firebase/firestore'
import { useRouter } from 'next/navigation'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const router = useRouter()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password)
      await setDoc(doc(db, 'users', userCred.user.uid), {
        email,
        name,
        createdAt: new Date()
      })
      router.push('/dashboard')
    } catch (err) {
      alert((err as Error).message)
    }
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
      <form onSubmit={handleSignup} className="flex flex-col gap-3 w-80">
        <input className="border p-2" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
        <input className="border p-2" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input className="border p-2" placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <button type="submit" className="bg-purple-600 text-white py-2 rounded">Create Account</button>
      </form>
    </main>
  )
}
