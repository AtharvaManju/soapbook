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
    <main className="min-h-screen bg-gradient-to-br from-purple-800 via-purple-900 to-purple-800 flex justify-center items-center px-4 py-16 text-white relative">
      {/* Background Blobs */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-purple-600 opacity-30 rounded-full blur-3xl" />
        <div className="absolute bottom-[-120px] right-[-120px] w-[400px] h-[400px] bg-fuchsia-400 opacity-20 rounded-full blur-3xl" />
      </div>

      {/* Glass Card */}
      <div className="w-full max-w-xl bg-white/10 backdrop-blur-xl border border-white/10 p-10 rounded-3xl shadow-2xl space-y-10">
        <h1 className="text-3xl font-extrabold text-white text-center">📅 Your Bookings</h1>

        {bookings.length === 0 ? (
          <div className="text-center text-purple-100 text-base py-10">
            You don't have any bookings yet.
          </div>
        ) : (
          <ul className="space-y-4">
            {bookings.map((booking) => (
              <li
                key={booking.id}
                className="flex justify-between items-center bg-white/5 border border-white/10 p-4 rounded-2xl shadow-sm"
              >
                <div>
                  <p className="text-lg font-semibold text-white">{booking.day}</p>
                  <p className="text-sm text-purple-200">⏰ {booking.time}</p>
                </div>
                <div className="text-right space-y-1">
                  <span className="block text-xs text-purple-300">
                    {booking.createdAt?.toDate?.().toLocaleString?.() || '—'}
                  </span>
                  <button
                    onClick={() => handleCancel(booking.id)}
                    className="text-sm text-red-300 hover:underline transition"
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
