'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { db } from '@/lib/firebase'
import { doc, getDoc } from 'firebase/firestore'
import Image from 'next/image'

interface Cleaner {
  name: string
  photoURL?: string
  bio?: string
}

export default function CleanerProfilePage() {
  const { id } = useParams() as { id: string }
  const router = useRouter()
  const [cleaner, setCleaner] = useState<Cleaner | null>(null)

  useEffect(() => {
    const fetchCleaner = async () => {
      const snap = await getDoc(doc(db, 'users', id))
      if (snap.exists()) {
        setCleaner(snap.data() as Cleaner)
      }
    }
    fetchCleaner()
  }, [id])

  if (!cleaner) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-purple-50 to-white flex items-center justify-center px-4">
        <div className="text-center text-gray-500 text-lg">Loading profile...</div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 to-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl bg-white p-8 rounded-3xl shadow-2xl space-y-6 text-center">
        {cleaner.photoURL && (
          <Image
            src={cleaner.photoURL}
            alt={cleaner.name}
            width={120}
            height={120}
            className="mx-auto rounded-full shadow"
          />
        )}

        <h1 className="text-3xl font-extrabold text-purple-700">{cleaner.name}</h1>
        <p className="text-gray-600 text-base">
          {cleaner.bio || 'No bio provided.'}
        </p>

        <div className="space-y-3 mt-6">
          <button
            onClick={() => router.push(`/book/${id}`)}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-semibold text-lg transition"
          >
            🧼 Book Now
          </button>

          <button
            onClick={() => router.push('/history')}
            className="w-full bg-gray-100 hover:bg-gray-200 text-black py-3 rounded-xl font-semibold text-lg transition"
          >
            📖 View My Bookings
          </button>
        </div>
      </div>
    </main>
  )
}
