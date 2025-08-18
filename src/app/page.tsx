import { Hero } from '@/components/home/hero'
import { Features } from '@/components/home/features'
import { HowItWorks } from '@/components/home/how-it-works'
import { Stats } from '@/components/home/stats'
import { CTA } from '@/components/home/cta'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Stats />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}