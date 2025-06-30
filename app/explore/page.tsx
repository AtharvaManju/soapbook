'use client'

import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'

interface Cleaner {
  id: string
  name: string
  photoURL?: string
}

export default function CleanerList() {
  const [cleaners, setCleaners] = useState<Cleaner[]>([])

  useEffect(() => {
    const fetchCleaners = async () => {
      const snap = await getDocs(collection(db, 'users'))
      const data = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Cleaner[]
      setCleaners(data)
    }
    fetchCleaners()
  }, [])

  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4">
      <h1 className="text-2xl font-bold mb-6">Available Cleaners</h1>

      <div className="w-full max-w-md flex flex-col gap-4">
        {cleaners.map((cleaner) => (
          <div
            key={cleaner.id}
            className="border p-4 rounded-lg flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              {cleaner.photoURL ? (
                <Image
                  src={cleaner.photoURL}
                  alt={cleaner.name}
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 bg-gray-200 text-gray-600 flex items-center justify-center rounded-full font-bold text-sm">
                  {cleaner.name?.charAt(0)}
                </div>
              )}
              <span className="font-medium">{cleaner.name}</span>
            </div>

            <Link
              href={`/cleaner/${cleaner.id}`}
              className="text-purple-600 text-sm hover:underline"
            >
              View
            </Link>
          </div>
        ))}

        {cleaners.length === 0 && (
          <p className="text-gray-500 text-center">No cleaners available.</p>
        )}
      </div>
    </main>
  )
}
