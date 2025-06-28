// app/history/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { collectionGroup, getDocs, query, where } from 'firebase/firestore'
import { db } from '@/lib/firebase'

interface Booking {
  day: string
  time: string
  createdAt: any
  cleanerId: string
  cleanerName?: string
}

export default function BookingHistoryPage() {
  const [email, setEmail] = useState('')
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(false)

  const fetchBookings = async () => {
    if (!email.includes('@')) return alert('Enter a valid email')

    setLoading(true)
    setBookings([])

    const q = query(collectionGroup(db, 'slots'), where('customerEmail', '==', email))
    const snap = await getDocs(q)

    const results: Booking[] = []

    for (const docSnap of snap.docs) {
      const data = docSnap.data()
      const pathParts = docSnap.ref.path.split('/')
      const cleanerId = pathParts[1]

      results.push({
        ...data,
        cleanerId,
      } as Booking)
    }

    setBookings(results)
    setLoading(false)
  }

  return (
    <main className="min-h-screen flex flex-col items-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-xl bg-white p-8 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold text-center text-purple-700 mb-6">
          Your Booking History
        </h1>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email to view bookings"
          className="w-full border px-4 py-2 rounded mb-4"
        />

        <button
          onClick={fetchBookings}
          className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
        >
          View History
        </button>

        {loading ? (
          <p className="mt-6 text-center text-gray-500">Loading...</p>
        ) : bookings.length > 0 ? (
          <ul className="mt-6 space-y-4">
            {bookings.map((b, i) => (
              <li
                key={i}
                className="border p-4 rounded bg-gray-50 shadow-sm"
              >
                <p className="font-medium">{b.day} @ {b.time}</p>
                <p className="text-sm text-gray-600">
                  {b.createdAt?.toDate?.().toLocaleString?.() || '—'}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Cleaner ID: {b.cleanerId}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-6 text-center text-gray-400">No bookings found.</p>
        )}
      </div>
    </main>
  )
}
