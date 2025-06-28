'use client'
import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function BookingConfirmedPage() {
  const params = useSearchParams()
  const router = useRouter()

  const cleanerId = params.get('cleanerId')
  const name = params.get('name')
  const day = params.get('day')
  const time = params.get('time')

  useEffect(() => {
    if (!cleanerId || !name || !day || !time) {
      router.push('/')
    }
  }, [cleanerId, name, day, time, router])

  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-3xl font-bold text-purple-700 mb-4">🎉 Booking Confirmed!</h1>
      <p className="text-lg text-gray-700 mb-2">
        You booked <strong>{name}</strong> on <strong>{day}</strong> at <strong>{time}</strong>.
      </p>
      <p className="text-gray-500">A confirmation has been saved.</p>

      <button
        onClick={() => router.push(`/book/${cleanerId}`)}
        className="mt-6 px-6 py-2 bg-purple-600 text-white rounded"
      >
        Return to Booking Page
      </button>
    </main>
  )
}
