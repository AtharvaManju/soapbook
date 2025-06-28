import { Suspense } from 'react'
import ConfirmedClient from './confirmedclient'

export default function BookingConfirmedPage() {
  return (
    <Suspense fallback={<div className="text-center mt-10 text-gray-500">Loading confirmation...</div>}>
      <ConfirmedClient />
    </Suspense>
  )
}
