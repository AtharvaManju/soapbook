'use client'

import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()

  const scrollToAbout = () => {
    const aboutSection = document.getElementById('about')
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="bg-gradient-to-br from-purple-800 via-purple-900 to-purple-800 text-white scroll-smooth">
      {/* Landing Section */}
      <section className="min-h-screen flex flex-col justify-between relative">
        {/* Background Blobs */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-purple-600 opacity-30 rounded-full blur-3xl" />
          <div className="absolute bottom-[-120px] right-[-120px] w-[400px] h-[400px] bg-fuchsia-400 opacity-20 rounded-full blur-3xl" />
        </div>

        {/* Hero Content */}
        <div className="flex-grow flex items-center justify-center px-6 pt-20">
          <div className="max-w-3xl w-full text-center space-y-10 bg-white/10 backdrop-blur-xl p-10 rounded-3xl border border-white/20 shadow-2xl">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-semibold leading-tight tracking-wide text-white">
                Welcome to Soapbook.
              </h1>
              <p className="text-lg md:text-xl text-purple-100">
                SoapBook helps you book and manage professional cleanings — fast, simple, and stress-free.
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-6 justify-center mt-8">
              <button
                onClick={() => router.push('/login')}
                className="bg-white text-purple-800 hover:bg-purple-100 py-4 px-8 rounded-2xl text-lg font-semibold transition duration-300 shadow-md"
              >
                🧼 I’m a Cleaner
              </button>

              <button
                onClick={() => router.push('/explore')}
                className="border border-white text-white hover:bg-white/20 py-4 px-8 rounded-2xl text-lg font-semibold transition duration-300"
              >
                🧍‍♀️ I’m a Customer
              </button>
            </div>

            <div className="text-sm text-purple-200 mt-10">
              🚀 Trusted by local communities across the country
            </div>
          </div>
        </div>

        {/* Down Arrow at Bottom */}
        <div className="pb-8 flex justify-center">
          <button
            onClick={scrollToAbout}
            className="text-purple-200 hover:text-white text-2xl"
            aria-label="Scroll to About"
          >
            ↓
          </button>
        </div>
      </section>

      {/* Fullscreen About Section */}
      <section
        id="about"
        className="min-h-screen flex items-center justify-center px-6 py-20"
      >
        <div className="max-w-2xl text-center space-y-6">
          <h2 className="text-4xl font-bold">About SoapBook</h2>
          <p className="text-lg text-purple-100">
            SoapBook is the easiest way to find trusted cleaners in your area. Our platform lets
            customers book with confidence while giving local professionals the tools they need to
            grow. Whether you're managing a busy household or building your cleaning business,
            SoapBook is here to help — with simplicity, clarity, and trust.
          </p>
        </div>
      </section>
    </div>
  )
}
