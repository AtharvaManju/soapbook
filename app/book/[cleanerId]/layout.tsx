export default function CleanerLayout({
    children,
    params,
  }: {
    children: React.ReactNode
    params: { cleanerId: string }
  }) {
    return (
      <div>
        {/* Pass cleanerId as context or just render children */}
        {children}
      </div>
    )
  }
  