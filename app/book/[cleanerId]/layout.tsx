import type { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
  params: { cleanerId: string }
}

export default function Layout({ children }: LayoutProps) {
  return <>{children}</>
}
