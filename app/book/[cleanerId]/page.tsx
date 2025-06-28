'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { db } from '@/lib/firebase'
import { doc, getDoc, collection, addDoc, getDocs, Timestamp } from 'firebase/firestore'

export default function BookingPage() {
  const { cleanerId } = useParams() as { cleanerId: string }
  const router = useRouter()

  const [availability, setAvailability] = useState<any>(null)
  const [selectedDay, setSelectedDay] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [cleanerName, setCleanerName] = useState('')
  const [bookedSlots, setBookedSlots] = useState<{ day: string; time: string }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      if (!cleanerId) return

      const [availSnap, userSnap, bookingsSnap] = await Promise.all([
        getDoc(doc(db, 'availability', cleanerId)),
        getDoc(doc(db, 'users', cleanerId)),
        getDocs(collection(db, 'bookings', cleanerId, 'slots')),
      ])

      if (availSnap.exists()) setAvailability(availSnap.data())
      if (userSnap.exists()) setCleanerName(userSnap.data()?.name || '')

      const booked = bookingsSnap.docs.map((doc) => doc.data())
      setBookedSlots(booked as { day: string; time: string }[])

      setLoading(false)
    }

    fetchData()
  }, [cleanerId])

  const handleBooking = async () => {
    if (!selectedDay || !selectedTime || !customerEmail.includes('@')) {
      alert('Please select a day and time and enter a valid email.')
      return
    }

    await addDoc(collection(db, 'bookings', cleanerId, 'slots'), {
      day: selectedDay,
      time: selectedTime,
      createdAt: Timestamp.now(),
      customerEmail: customerEmail,
    })

    router.push(
      `/confirmed?cleanerId=${cleanerId}&name=${encodeURIComponent(cleanerName)}&day=${selectedDay}&time=${selectedTime}`
    )
  }

  const isSlotBooked = (day: string, time: string) =>
    bookedSlots.some((slot) => slot.day === day && slot.time === time)

  if (loading) {
    return <div className="p-10 text-center text-gray-500">Loading availability...</div>
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-md">
        <h1 className="text-3xl font-bold text-center mb-6">
          Book a cleaning with {cleanerName || 'Cleaner'}
        </h1>

        <div className="space-y-6">
          {Object.keys(availability).map((day) => {
            const { start, end } = availability[day]
            if (!start || !end) return null

            const slots: string[] = []
            let [sh] = start.split(':').map(Number)
            const [eh] = end.split(':').map(Number)

            while (sh < eh) {
              slots.push(`${String(sh).padStart(2, '0')}:00`)
              sh++
            }

            return (
              <div key={day}>
                <h2 className="text-xl font-semibold mb-2">{day}</h2>
                <div className="flex flex-wrap gap-3">
                  {slots.map((time) => {
                    const booked = isSlotBooked(day, time)
                    return (
                      <button
                        key={time}
                        disabled={booked}
                        className={`px-4 py-2 rounded border transition-colors duration-150 ${
                          booked
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            : selectedDay === day && selectedTime === time
                            ? 'bg-purple-600 text-white'
                            : 'bg-white text-black hover:bg-purple-100'
                        }`}
                        onClick={() => {
                          if (!booked) {
                            setSelectedDay(day)
                            setSelectedTime(time)
                          }
                        }}
                      >
                        {time}
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Email
            </label>
            <input
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="you@example.com"
              required
            />
          </div>

          <button
            onClick={handleBooking}
            className="w-full mt-6 bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded text-lg font-medium"
          >
            Book Slot
          </button>

          <p className="mt-8 text-center text-sm text-gray-600">
  Already booked before?{' '}
  <a
    href="/history"
    className="text-purple-600 underline hover:text-purple-800"
  >
    View your booking history
  </a>
</p>

        </div>
      </div>
    </main>
  )
}
