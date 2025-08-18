import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'EcoTrack - Carbon Footprint Tracker',
  description: 'Track your carbon footprint, earn eco points, and make a positive impact on the environment.',
  keywords: ['carbon footprint', 'sustainability', 'eco-friendly', 'environmental impact', 'green living'],
  authors: [{ name: 'EcoTrack Team' }],
  openGraph: {
    title: 'EcoTrack - Carbon Footprint Tracker',
    description: 'Track your carbon footprint and earn rewards for eco-friendly actions.',
    type: 'website',
    locale: 'en_US',
    siteName: 'EcoTrack',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}