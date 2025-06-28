'use client'

import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl space-y-6 text-center">
        <h1 className="text-3xl font-bold text-purple-700">Welcome to SoapBook</h1>
        <p className="text-gray-500">Choose your role to get started</p>

        <div className="space-y-4">
          <button
            onClick={() => router.push('/login')}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-xl text-lg font-medium"
          >
            🧼 I’m a Cleaner
          </button>

          <button
            onClick={() => router.push('/explore')}
            className="w-full bg-purple-100 hover:bg-purple-200 text-purple-700 py-3 px-4 rounded-xl text-lg font-medium"
          >
            🧍‍♀️ I’m a Customer
          </button>
        </div>
      </div>
    </main>
  )
}
