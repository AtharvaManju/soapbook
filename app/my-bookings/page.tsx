'use client'
import { useEffect, useState } from 'react'
import { auth, db } from '@/lib/firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import { collectionGroup, getDocs } from 'firebase/firestore'

interface Booking {
  day: string
  time: string
  createdAt: any
  cleanerId: string
}

export default function MyBookingsPage() {
  const [user] = useAuthState(auth)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    const fetchBookings = async () => {
      setLoading(true)

      const snap = await getDocs(collectionGroup(db, 'slots'))

      const customerBookings: Booking[] = []

      for (const docSnap of snap.docs) {
        const data = docSnap.data()
        const path = docSnap.ref.path
        const cleanerId = path.split('/')[1]

        if (
          data.customerEmail === user.email &&
          data.day &&
          data.time &&
          data.createdAt
        ) {
          customerBookings.push({
            day: data.day,
            time: data.time,
            createdAt: data.createdAt,
            cleanerId,
          })
        }
      }

      setBookings(customerBookings)
      setLoading(false)
    }

    fetchBookings()
  }, [user])

  return (
    <main className="min-h-screen bg-gray-50 flex justify-center py-10 px-4">
      <div className="w-full max-w-xl bg-white p-8 rounded-2xl shadow-xl space-y-6">
        <h1 className="text-2xl font-bold text-purple-700 text-center">🧾 My Bookings</h1>

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : bookings.length === 0 ? (
          <p className="text-center text-gray-500">No bookings yet.</p>
        ) : (
          <ul className="space-y-4">
            {bookings.map((booking, i) => (
              <li key={i} className="p-4 border rounded-xl shadow-sm bg-gray-50">
                <p className="text-lg font-medium">{booking.day} at {booking.time}</p>
                <p className="text-sm text-gray-600">
                  Cleaner ID: {booking.cleanerId}
                </p>
                <p className="text-sm text-gray-400">
                  {booking.createdAt?.toDate?.().toLocaleString?.() || '—'}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  )
}
