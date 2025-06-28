'use client'

import { useEffect, useState } from 'react'
import { auth, db } from '@/lib/firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy
} from 'firebase/firestore'

interface Booking {
  id: string
  day: string
  time: string
  createdAt: any
}

export default function BookingsPage() {
  const [user] = useAuthState(auth)
  const [bookings, setBookings] = useState<Booking[]>([])

  useEffect(() => {
    if (!user) return

    const fetchBookings = async () => {
      const ref = query(
        collection(db, 'bookings', user.uid, 'slots'),
        orderBy('createdAt', 'desc')
      )
      const snap = await getDocs(ref)
      const data = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Booking[]
      setBookings(data)
    }

    fetchBookings()
  }, [user])

  const handleCancel = async (id: string) => {
    if (!user) return
    await deleteDoc(doc(db, 'bookings', user.uid, 'slots', id))
    setBookings((prev) => prev.filter((b) => b.id !== id))
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 to-white flex justify-center py-10 px-4">
      <div className="w-full max-w-xl bg-white p-8 rounded-3xl shadow-2xl space-y-8">
        <h1 className="text-3xl font-extrabold text-purple-700 text-center">📅 Your Bookings</h1>

        {bookings.length === 0 ? (
          <div className="text-center text-gray-500 text-base py-10">
            You don't have any bookings yet.
          </div>
        ) : (
          <ul className="space-y-4">
            {bookings.map((booking) => (
              <li
                key={booking.id}
                className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl border shadow-sm"
              >
                <div>
                  <p className="text-lg font-semibold text-gray-800">{booking.day}</p>
                  <p className="text-sm text-gray-500">⏰ {booking.time}</p>
                </div>
                <div className="text-right space-y-1">
                  <span className="block text-xs text-gray-400">
                    {booking.createdAt?.toDate?.().toLocaleString?.() || '—'}
                  </span>
                  <button
                    onClick={() => handleCancel(booking.id)}
                    className="text-sm text-red-600 hover:underline transition"
                  >
                    ❌ Cancel
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  )
}
