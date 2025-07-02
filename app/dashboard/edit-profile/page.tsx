'use client'

import { useEffect, useState } from 'react'
import { auth, db, storage } from '@/lib/firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import Image from 'next/image'

export default function EditProfilePage() {
  const [user] = useAuthState(auth)
  const [bio, setBio] = useState('')
  const [zipCodes, setZipCodes] = useState('')
  const [photoURL, setPhotoURL] = useState('')
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (!user) return
    const fetchProfile = async () => {
      const snap = await getDoc(doc(db, 'users', user.uid))
      if (snap.exists()) {
        const data = snap.data()
        setBio(data.bio || '')
        setZipCodes(data.zipCodes || '')
        setPhotoURL(data.photoURL || '')
      }
    }
    fetchProfile()
  }, [user])

  const handleSave = async () => {
    if (!user) return
    await setDoc(
      doc(db, 'users', user.uid),
      {
        bio,
        zipCodes,
        photoURL,
      },
      { merge: true }
    )
    alert('✅ Profile updated!')
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !e.target.files?.[0]) return
    const file = e.target.files[0]
    const storageRef = ref(storage, `profilePics/${user.uid}`)
    setUploading(true)
    await uploadBytes(storageRef, file)
    const url = await getDownloadURL(storageRef)
    setPhotoURL(url)
    setUploading(false)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-800 via-purple-900 to-purple-800 flex justify-center items-center px-4 py-16 text-white relative">
      {/* Background Blobs */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-purple-600 opacity-30 rounded-full blur-3xl" />
        <div className="absolute bottom-[-120px] right-[-120px] w-[400px] h-[400px] bg-fuchsia-400 opacity-20 rounded-full blur-3xl" />
      </div>

      {/* Glass Card */}
      <div className="w-full max-w-2xl bg-white/10 backdrop-blur-xl border border-white/10 p-10 rounded-3xl shadow-2xl space-y-10">
        <h1 className="text-3xl font-extrabold text-white text-center">🧍 Edit Your Profile</h1>

        <div className="space-y-6">
          {/* Profile Pic Upload */}
          <div>
            <label className="block text-sm font-medium text-purple-100 mb-2">
              Profile Picture
            </label>
            <input
              type="file"
              onChange={handleImageChange}
              className="block w-full text-sm text-purple-100 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-purple-600 file:text-white hover:file:bg-purple-700 transition"
            />
            {uploading && (
              <p className="mt-2 text-sm text-purple-200 italic">Uploading...</p>
            )}
            {photoURL && (
              <div className="mt-4">
                <Image
                  src={photoURL}
                  alt="Profile"
                  width={100}
                  height={100}
                  className="rounded-full shadow-md border border-white/20"
                />
              </div>
            )}
          </div>

          {/* Bio Field */}
          <div>
            <label className="block text-sm font-medium text-purple-100 mb-2">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              placeholder="Tell us about your services..."
              className="w-full bg-white/10 text-white placeholder-purple-300 border border-white/10 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-300 transition text-sm"
            />
          </div>

          {/* ZIP Codes Field */}
          <div>
            <label className="block text-sm font-medium text-purple-100 mb-2">
              Service ZIP Codes
            </label>
            <input
              type="text"
              value={zipCodes}
              onChange={(e) => setZipCodes(e.target.value)}
              placeholder="e.g., 94110, 94016"
              className="w-full bg-white/10 text-white placeholder-purple-300 border border-white/10 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-300 transition text-sm"
            />
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-semibold text-lg transition"
          >
            💾 Save Profile
          </button>
        </div>
      </div>
    </main>
  )
}
