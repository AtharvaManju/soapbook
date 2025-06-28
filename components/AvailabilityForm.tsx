'use client'
import { useEffect, useState } from 'react'
import { auth, db } from '@/lib/firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function AvailabilityForm() {
  const [availability, setAvailability] = useState<any>({})
  const [loading, setLoading] = useState(true)

  const user = auth.currentUser

  useEffect(() => {
    const load = async () => {
      if (!user) return
      const ref = doc(db, 'availability', user.uid)
      const snap = await getDoc(ref)
      if (snap.exists()) {
        setAvailability(snap.data())
      } else {
        const initial = Object.fromEntries(
          daysOfWeek.map(day => [day, { start: '', end: '' }])
        )
        setAvailability(initial)
      }
      setLoading(false)
    }

    load()
  }, [user])

  const handleChange = (day: string, field: 'start' | 'end', value: string) => {
    setAvailability((prev: any) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value
      }
    }))
  }

  const saveAvailability = async () => {
    if (!user) return
    await setDoc(doc(db, 'availability', user.uid), availability)
    alert('Availability saved ✅')
  }

  if (loading) return <p className="mt-6">Loading availability...</p>

  return (
    <div className="mt-6 border rounded p-6 w-full max-w-md">
      <h2 className="text-xl font-semibold mb-4">Set Weekly Availability</h2>
      {daysOfWeek.map(day => (
        <div key={day} className="flex items-center gap-2 mb-3">
          <label className="w-12">{day}</label>
          <input
            type="time"
            value={availability[day]?.start || ''}
            onChange={(e) => handleChange(day, 'start', e.target.value)}
            className="border p-1 w-24"
          />
          <span>to</span>
          <input
            type="time"
            value={availability[day]?.end || ''}
            onChange={(e) => handleChange(day, 'end', e.target.value)}
            className="border p-1 w-24"
          />
        </div>
      ))}
      <button onClick={saveAvailability} className="mt-4 bg-purple-600 text-white py-2 px-4 rounded">
        Save
      </button>
    </div>
  )
}
