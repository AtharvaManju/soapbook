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
    <main className="min-h-screen bg-gradient-to-br from-purple-800 via-purple-900 to-purple-800 flex justify-center items-center px-4 py-16 text-white relative">
      {/* Blurred Background Blobs */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-purple-600 opacity-30 rounded-full blur-3xl" />
        <div className="absolute bottom-[-120px] right-[-120px] w-[400px] h-[400px] bg-fuchsia-400 opacity-20 rounded-full blur-3xl" />
      </div>

      {/* Glass Card */}
      <div className="w-full max-w-2xl bg-white/10 backdrop-blur-xl border border-white/10 p-10 rounded-3xl shadow-2xl space-y-10">
        <h1 className="text-3xl font-extrabold text-white text-center">
          🕒 Set Your Weekly Availability
        </h1>

        <div className="space-y-5">
          {days.map((day) => (
            <div
              key={day}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4"
            >
              <span className="w-28 font-semibold text-white">{day}</span>
              <div className="flex gap-3 flex-grow items-center">
                <TimeInput
                  value={availability[day]?.start || ''}
                  onChange={(val) => handleTimeChange(day, 'start', val)}
                />
                <span className="text-white text-sm">to</span>
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
      className="w-full sm:w-40 bg-white/20 text-white placeholder-white/50 border border-white/20 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300 transition duration-150 text-sm"
    />
  )
}
