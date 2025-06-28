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
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold mb-4">🧹 Available Cleaners</h1>

      {cleaners.map((cleaner) => (
        <div
          key={cleaner.id}
          className="bg-white rounded-xl shadow p-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            {cleaner.photoURL && (
              <Image
                src={cleaner.photoURL}
                alt={cleaner.name}
                width={50}
                height={50}
                className="rounded-full"
              />
            )}
            <p className="font-medium">{cleaner.name}</p>
          </div>

          <Link
            href={`/cleaner/${cleaner.id}`}
            className="text-purple-600 hover:underline"
          >
            View Profile
          </Link>
        </div>
      ))}
    </div>
  )
}
