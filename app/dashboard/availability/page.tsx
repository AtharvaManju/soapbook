'use client'

import { useEffect, useState } from 'react'
import { auth, db } from '@/lib/firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { useRouter } from 'next/navigation'

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export default function AvailabilityPage() {
  const [user] = useAuthState(auth)
  const [availability, setAvailability] = useState<Record<string, { start: string; end: string }>>({})
  const router = useRouter()

  useEffect(() => {
    if (!user) return
    const fetchAvailability = async () => {
      const ref = doc(db, 'availability', user.uid)
      const snap = await getDoc(ref)
      if (snap.exists()) setAvailability(snap.data() as any)
    }
    fetchAvailability()
  }, [user])

  const handleTimeChange = (day: string, field: 'start' | 'end', value: string) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
      },
    }))
  }

  const handleSave = async () => {
    if (!user) return
    await setDoc(doc(db, 'availability', user.uid), availability)
    alert('✅ Availability saved!')
    router.push('/dashboard')
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 to-white flex justify-center py-10 px-4">
      <div className="w-full max-w-2xl bg-white p-8 rounded-3xl shadow-2xl space-y-8">
        <h1 className="text-3xl font-extrabold text-purple-700 text-center">
          🕒 Set Your Weekly Availability
        </h1>

        <div className="space-y-5">
          {days.map((day) => (
            <div
              key={day}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4"
            >
              <span className="w-28 font-semibold text-gray-700">{day}</span>
              <div className="flex gap-3 flex-grow items-center">
                <TimeInput
                  value={availability[day]?.start || ''}
                  onChange={(val) => handleTimeChange(day, 'start', val)}
                />
                <span className="text-gray-500 text-sm">to</span>
                <TimeInput
                  value={availability[day]?.end || ''}
                  onChange={(val) => handleTimeChange(day, 'end', val)}
                />
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-xl font-semibold text-lg transition duration-150"
        >
          💾 Save Availability
        </button>
      </div>
    </main>
  )
}

function TimeInput({
  value,
  onChange,
}: {
  value: string
  onChange: (val: string) => void
}) {
  return (
    <input
      type="time"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full sm:w-40 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 transition duration-150 text-sm"
    />
  )
}
