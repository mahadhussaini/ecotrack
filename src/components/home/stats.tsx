import { Card, CardContent } from '@/components/ui/card'

const stats = [
  {
    label: 'CO₂ Saved',
    value: '2.5M',
    unit: 'tons',
    description: 'Total carbon emissions prevented by our community',
    color: 'text-eco-600',
  },
  {
    label: 'Active Users',
    value: '500K',
    unit: '+',
    description: 'People tracking their environmental impact',
    color: 'text-blue-600',
  },
  {
    label: 'Trees Planted',
    value: '1.2M',
    unit: '',
    description: 'Through our carbon offset programs',
    color: 'text-green-600',
  },
  {
    label: 'Eco Points',
    value: '45M',
    unit: '+',
    description: 'Rewards earned by sustainable actions',
    color: 'text-yellow-600',
  },
]

export function Stats() {
  return (
    <section className="py-20 sm:py-32">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Making a Real Impact
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Join a growing community of environmentally conscious individuals
            working together to create positive change.
          </p>
        </div>
        
        <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="card-hover text-center">
              <CardContent className="pt-6">
                <div className="mb-2">
                  <span className={`text-3xl font-bold ${stat.color}`}>
                    {stat.value}
                  </span>
                  <span className={`text-lg font-semibold ${stat.color}`}>
                    {stat.unit}
                  </span>
                </div>
                <div className="text-lg font-semibold text-foreground mb-1">
                  {stat.label}
                </div>
                <p className="text-sm text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}