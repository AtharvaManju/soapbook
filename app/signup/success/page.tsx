'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth, db } from '@/lib/firebase'
import { doc, setDoc } from 'firebase/firestore'

export default function SuccessPage() {
  const router = useRouter()

  useEffect(() => {
    const createAccount = async () => {
      const stored = localStorage.getItem('signupData')
      if (!stored) return

      const { email, password, name } = JSON.parse(stored)

      try {
        const userCred = await createUserWithEmailAndPassword(auth, email, password)
        await setDoc(doc(db, 'users', userCred.user.uid), {
          email,
          name,
          createdAt: new Date()
        })

        localStorage.removeItem('signupData')
        router.push('/dashboard')
      } catch (err) {
        alert((err as Error).message)
      }
    }

    createAccount()
  }, [router])

  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl text-green-600 font-bold">🎉 Payment Successful</h1>
      <p>Finalizing your account...</p>
    </main>
  )
}
