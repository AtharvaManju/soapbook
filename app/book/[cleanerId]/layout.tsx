// app/book/[cleanerId]/layout.tsx
import { ReactNode } from 'react'

export default function CleanerBookingLayout({
  children,
  params,
}: {
  children: ReactNode
  params: { cleanerId: string }
}) {
  return (
    <div>
      {/* You can use params.cleanerId if needed */}
      {children}
    </div>
  )
}
