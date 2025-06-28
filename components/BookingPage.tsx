'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { db } from '@/lib/firebase'
import { doc, getDoc, collection, addDoc, Timestamp } from 'firebase/firestore'

export default function BookingPage() {
  const { cleanerId } = useParams() as { cleanerId: string }
  const [availability, setAvailability] = useState<any>(null)
  const [selectedDay, setSelectedDay] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [cleanerName, setCleanerName] = useState('')
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      if (!cleanerId) return
      const availSnap = await getDoc(doc(db, 'availability', cleanerId))
      const userSnap = await getDoc(doc(db, 'users', cleanerId))

      if (availSnap.exists()) setAvailability(availSnap.data())
      if (userSnap.exists()) setCleanerName(userSnap.data()?.name || '')
    }

    if (hasMounted) fetchData()
  }, [hasMounted, cleanerId])

  const handleBooking = async () => {
    if (!selectedDay || !selectedTime) {
      alert('Please select a day and time.')
      return
    }

    await addDoc(collection(db, 'bookings', cleanerId, 'slots'), {
      day: selectedDay,
      time: selectedTime,
      createdAt: Timestamp.now(),
    })

    alert('✅ Booking submitted!')
    setSelectedDay('')
    setSelectedTime('')
  }

  if (!hasMounted || !availability) {
    return <div className="p-10 text-gray-500">Loading availability...</div>
  }

  return (
    <main className="p-10">
      <h1 className="text-2xl font-bold mb-4">
        Book a cleaning with {cleanerName || 'Cleaner'}
      </h1>

      <div className="space-y-4">
        {Object.keys(availability).map((day) => {
          const { start, end } = availability[day]
          if (!start || !end) return null

          const slots = []
          let [sh] = start.split(':').map(Number)
          const [eh] = end.split(':').map(Number)

          while (sh < eh) {
            const timeStr = `${String(sh).padStart(2, '0')}:00`
            slots.push(timeStr)
            sh++
          }

          return (
            <div key={day}>
              <h2 className="text-lg font-semibold">{day}</h2>
              <div className="flex flex-wrap gap-2">
                {slots.map((time) => (
                  <button
                    key={time}
                    className={`px-3 py-1 rounded border ${
                      selectedDay === day && selectedTime === time
                        ? 'bg-purple-600 text-white'
                        : 'bg-white text-black'
                    }`}
                    onClick={() => {
                      setSelectedDay(day)
                      setSelectedTime(time)
                    }}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <button
        onClick={handleBooking}
        className="mt-6 bg-purple-600 text-white py-2 px-4 rounded"
      >
        Book Slot
      </button>
    </main>
  )
}
