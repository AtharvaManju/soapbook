// app/dashboard/layout.tsx
'use client'

import { ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { auth, db } from '@/lib/firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import { doc, getDoc } from 'firebase/firestore'
import { useEffect, useState } from 'react'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [user, loading] = useAuthState(auth)
  const [name, setName] = useState('')
  const router = useRouter()

  useEffect(() => {
    const fetchName = async () => {
      if (user) {
        const snap = await getDoc(doc(db, 'users', user.uid))
        if (snap.exists()) setName(snap.data()?.name || '')
      }
    }
    fetchName()
  }, [user])

  if (!loading && !user) {
    router.push('/login')
    return null
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-purple-700 text-white flex flex-col py-8 px-6">
        <h1 className="text-2xl font-bold mb-4">🧼 SoapBook</h1>

        <nav className="space-y-4 flex-1">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-left w-full hover:underline"
          >
            🏠 Dashboard
          </button>
          <button
            onClick={() => router.push('/dashboard/availability')}
            className="text-left w-full hover:underline"
          >
            ✏️ Availability
          </button>
          <button
            onClick={() => router.push('/dashboard/bookings')}
            className="text-left w-full hover:underline"
          >
            📅 Bookings
          </button>
          <button
            onClick={() => auth.signOut()}
            className="text-left w-full hover:underline mt-6 text-red-200"
          >
            🚪 Log Out
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-10 overflow-y-auto relative">
        {/* Profile on top right */}
        <div className="absolute top-4 right-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-purple-700 text-white flex items-center justify-center font-bold text-lg">
            {name ? name[0].toUpperCase() : '?'}
          </div>
          <span className="font-medium text-gray-700">{name || 'Cleaner'}</span>
        </div>
        {children}
      </main>
    </div>
  )
}
