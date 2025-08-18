import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Calculator, 
  BarChart3, 
  Trophy, 
  Users, 
  Gift, 
  Target,
  Smartphone,
  Shield
} from 'lucide-react'

const features = [
  {
    title: 'Carbon Calculator',
    description: 'Track your daily activities and get accurate carbon footprint calculations.',
    icon: Calculator,
    color: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400',
  },
  {
    title: 'Smart Analytics',
    description: 'Visualize your progress with beautiful charts and actionable insights.',
    icon: BarChart3,
    color: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400',
  },
  {
    title: 'Eco Rewards',
    description: 'Earn points for sustainable actions and redeem them for rewards.',
    icon: Trophy,
    color: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-400',
  },
  {
    title: 'Leaderboards',
    description: 'Compete with friends and the global community to maximize impact.',
    icon: Users,
    color: 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400',
  },
  {
    title: 'Rewards Store',
    description: 'Redeem eco-points for discounts, products, and carbon offsets.',
    icon: Gift,
    color: 'bg-pink-100 text-pink-600 dark:bg-pink-900 dark:text-pink-400',
  },
  {
    title: 'Goal Tracking',
    description: 'Set targets, track streaks, and unlock achievements for consistency.',
    icon: Target,
    color: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-400',
  },
  {
    title: 'Mobile First',
    description: 'Beautiful, responsive design optimized for all devices.',
    icon: Smartphone,
    color: 'bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-400',
  },
  {
    title: 'Privacy First',
    description: 'Your data is secure and private. No tracking, no selling.',
    icon: Shield,
    color: 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400',
  },
]

export function Features() {
  return (
    <section className="py-20 sm:py-32">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to live sustainably
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Comprehensive tools to track, reduce, and offset your carbon footprint
            while earning rewards for positive environmental actions.
          </p>
        </div>
        
        <div className="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Card key={feature.title} className="card-hover">
              <CardHeader>
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-lg ${feature.color}`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}