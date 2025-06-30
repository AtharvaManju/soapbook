'use client'

import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-800 via-purple-900 to-purple-800 flex items-center justify-center px-6 py-16 text-white relative">
      
      {/* Background blur blobs for visual depth */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-purple-600 opacity-30 rounded-full blur-3xl" />
        <div className="absolute bottom-[-120px] right-[-120px] w-[400px] h-[400px] bg-fuchsia-400 opacity-20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-3xl w-full text-center space-y-10 bg-white/10 backdrop-blur-xl p-10 rounded-3xl shadow-xl border border-white/20">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-semibold text-white leading-tight tracking-wide">
            Welcome to Soapbook.
          </h1>
          <p className="text-lg md:text-xl text-purple-100">
            SoapBook helps you book and manage professional cleanings — fast, simple, and stress-free.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6 justify-center mt-8">
          <button
            onClick={() => router.push('/login')}
            className="bg-white text-purple-800 hover:bg-purple-100 py-4 px-8 rounded-2xl text-lg font-semibold transition duration-300 shadow-md hover:shadow-xl"
          >
            🧼 I’m a Cleaner
          </button>

          <button
            onClick={() => router.push('/explore')}
            className="border border-white text-white hover:bg-white/20 py-4 px-8 rounded-2xl text-lg font-semibold transition duration-300 shadow-md hover:shadow-xl"
          >
            🧍‍♀️ I’m a Customer
          </button>
        </div>

        <div className="text-sm text-purple-200 mt-10">
          🚀 Trusted by local communities across the country
        </div>
      </div>
    </main>
  )
}
