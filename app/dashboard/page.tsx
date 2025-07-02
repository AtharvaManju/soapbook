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
    <main className="min-h-screen bg-gradient-to-br from-purple-800 via-purple-900 to-purple-800 flex items-center justify-center px-6 py-16 text-white relative">
      {/* Background Blobs */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-purple-600 opacity-30 rounded-full blur-3xl" />
        <div className="absolute bottom-[-120px] right-[-120px] w-[400px] h-[400px] bg-fuchsia-400 opacity-20 rounded-full blur-3xl" />
      </div>

      {/* Glass Card */}
      <div className="max-w-md w-full p-10 bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl space-y-8 text-center">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Welcome, {name || 'Cleaner'} 👋
          </h1>
          <p className="text-purple-100 text-base">
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
            className="w-full bg-white/10 hover:bg-white/20 text-white py-3 px-4 rounded-xl text-lg font-semibold transition duration-150 border border-white/10"
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
      className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-xl text-lg font-semibold shadow-md transition duration-150"
    >
      {children}
    </button>
  )
}
