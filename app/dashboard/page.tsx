'use client'

import { useRouter } from 'next/navigation'
import { auth, db } from '@/lib/firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'

export default function DashboardHome() {
  const [user, loading] = useAuthState(auth)
  const [name, setName] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    const fetchName = async () => {
      if (!user) return
      const ref = doc(db, 'users', user.uid)
      const snap = await getDoc(ref)
      const data = snap.data()
      setName(data?.name || 'Cleaner')
    }

    if (user) fetchName()
  }, [user])

  if (!user) return null

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 to-white flex items-center justify-center px-4">
      <div className="max-w-md w-full p-8 bg-white rounded-3xl shadow-2xl space-y-8">
        <div className="text-center space-y-1">
          <h1 className="text-4xl font-extrabold text-purple-700">
            Welcome, {name || 'Cleaner'} 👋
          </h1>
          <p className="text-gray-500 text-base">
            Manage your schedule and bookings
          </p>
        </div>

        <div className="space-y-4">
          <ActionButton onClick={() => router.push('/dashboard/availability')}>
            ✏️ Edit Availability
          </ActionButton>

          <ActionButton onClick={() => router.push('/dashboard/bookings')}>
            📅 View Bookings
          </ActionButton>

          <ActionButton onClick={() => router.push('/dashboard/edit-profile')}>
            🧍‍♂️ Edit Profile
          </ActionButton>

          <button
            onClick={() => auth.signOut()}
            className="w-full text-center bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-xl text-lg font-semibold transition duration-150"
          >
            🚪 Log Out
          </button>
        </div>
      </div>
    </main>
  )
}

function ActionButton({
  children,
  onClick,
}: {
  children: React.ReactNode
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-xl text-lg font-semibold shadow-sm transition duration-150"
    >
      {children}
    </button>
  )
}
