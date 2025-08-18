import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight } from 'lucide-react'

const steps = [
  {
    step: '01',
    title: 'Track Activities',
    description: 'Log your daily activities - transport, energy use, diet, and shopping habits.',
    details: 'Our smart calculator converts your activities into CO₂ emissions using scientific data.',
  },
  {
    step: '02',
    title: 'Get Insights',
    description: 'View detailed analytics and personalized recommendations to reduce your footprint.',
    details: 'Discover which activities have the biggest impact and get AI-powered suggestions.',
  },
  {
    step: '03',
    title: 'Take Action',
    description: 'Make sustainable choices and earn eco-points for every positive action.',
    details: 'Walk instead of drive, use renewable energy, recycle - every action counts.',
  },
  {
    step: '04',
    title: 'Earn Rewards',
    description: 'Redeem your eco-points for discounts, products, or fund carbon offset projects.',
    details: 'Turn your environmental impact into tangible rewards and real-world benefits.',
  },
]

export function HowItWorks() {
  return (
    <section className="py-20 sm:py-32 bg-muted/30">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            How EcoTrack Works
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Four simple steps to start making a positive environmental impact
            while earning rewards for your sustainable choices.
          </p>
        </div>
        
        <div className="mx-auto mt-16 max-w-6xl">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {steps.map((step, index) => (
              <div key={step.step} className="relative">
                <Card className="h-full">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-eco-500 text-white font-bold text-lg">
                        {step.step}
                      </div>
                      <div>
                        <CardTitle className="text-xl">{step.title}</CardTitle>
                        <CardDescription className="text-base mt-1">
                          {step.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{step.details}</p>
                  </CardContent>
                </Card>
                
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 z-10">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-eco-100 dark:bg-eco-900">
                      <ArrowRight className="h-4 w-4 text-eco-600 dark:text-eco-400" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}