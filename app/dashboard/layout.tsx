'use client'

import { ReactNode, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { auth, db } from '@/lib/firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import { doc, getDoc } from 'firebase/firestore'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [user, loading] = useAuthState(auth)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      if (!loading && !user) {
        router.push('/login')
      }
    }
    checkAuth()
  }, [user, loading, router])

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-800 via-purple-900 to-purple-800 text-white">
      {/* Sidebar */}
      <aside className="w-64 p-6 bg-white/10 backdrop-blur-xl border-r border-white/10 shadow-md flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-6">🧼 SoapBook</h1>
          <nav className="space-y-4 text-sm">
            <SidebarButton href="/dashboard">🏠 Dashboard</SidebarButton>
            <SidebarButton href="/dashboard/availability">✏️ Availability</SidebarButton>
            <SidebarButton href="/dashboard/bookings">📅 Bookings</SidebarButton>
          </nav>
        </div>
        <button
          onClick={() => auth.signOut()}
          className="mt-6 w-full bg-white/10 hover:bg-white/20 text-sm font-semibold text-white py-2 px-4 rounded-lg border border-white/10 transition"
        >
          🚪 Log Out
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}

function SidebarButton({ href, children }: { href: string; children: React.ReactNode }) {
  const router = useRouter()
  return (
    <button
      onClick={() => router.push(href)}
      className="w-full text-left py-2 px-3 rounded-lg hover:bg-white/10 transition"
    >
      {children}
    </button>
  )
}
