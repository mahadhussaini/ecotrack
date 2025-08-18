import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'

export function CTA() {
  return (
    <section className="py-20 sm:py-32">
      <div className="container">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-eco-500 to-eco-600 px-8 py-16 sm:px-16">
          <div className="absolute inset-0 bg-eco-600/20" />
          <div className="relative mx-auto max-w-2xl text-center">
            <div className="mb-6">
              <Sparkles className="mx-auto h-12 w-12 text-white" />
            </div>
            
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to make a difference?
            </h2>
            
            <p className="mt-4 text-lg text-eco-100">
              Join EcoTrack today and start your journey towards a more sustainable lifestyle. 
              Track your impact, earn rewards, and help save the planet.
            </p>
            
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/auth/signup">
                  Start Your Eco Journey
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-eco-600" asChild>
                <Link href="/features">
                  Learn More
                </Link>
              </Button>
            </div>
            
            <p className="mt-4 text-sm text-eco-100">
              Free to start • No credit card required • Join 500K+ users
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}