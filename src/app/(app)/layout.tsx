import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { Navigation } from '@/components/layout/navigation'
import { MobileNav } from '@/components/layout/mobile-nav'
import { Header } from '@/components/layout/header'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/auth/signin')

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <MobileNav />
      <div className="flex">
        <Navigation />
        <main className="flex-1 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  )
}