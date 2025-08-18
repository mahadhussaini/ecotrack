import { Button } from '@/components/ui/button'
import { ArrowRight, Play } from 'lucide-react'
import Link from 'next/link'

export function Hero() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-32">
      <div className="absolute inset-0 bg-gradient-to-br from-eco-50 to-blue-50 dark:from-eco-950 dark:to-blue-950" />
      <div className="relative container">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-8">
            <div className="inline-flex items-center rounded-full bg-eco-100 px-3 py-1 text-sm text-eco-700 ring-1 ring-eco-600/20 dark:bg-eco-900 dark:text-eco-300">
              🌱 Track • Reduce • Reward
            </div>
          </div>
          
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
            Track Your Carbon Footprint,{' '}
            <span className="gradient-eco bg-clip-text text-transparent">
              Earn Rewards
            </span>
          </h1>
          
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Monitor your environmental impact, get personalized insights, and earn eco-points 
            for sustainable actions. Join thousands making a positive difference for our planet.
          </p>
          
          <div className="mt-10 flex items-center justify-center gap-4 flex-wrap">
            <Button size="lg" variant="eco" asChild>
              <Link href="/auth/signup">
                Start Tracking Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            
            <Button size="lg" variant="outline" asChild>
              <Link href="#demo">
                <Play className="mr-2 h-4 w-4" />
                Watch Demo
              </Link>
            </Button>
          </div>
          
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-eco-600 dark:text-eco-400">500K+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-eco-600 dark:text-eco-400">2.5M</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Tons CO₂ Saved</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-eco-600 dark:text-eco-400">95%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">User Satisfaction</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}