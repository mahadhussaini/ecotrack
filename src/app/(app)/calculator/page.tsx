'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { computeEmissionKgCO2, emissionFactors } from '@/lib/eco'

type Category = 'TRANSPORT' | 'ENERGY' | 'FOOD' | 'SHOPPING'

export default function CalculatorPage() {
  const [category, setCategory] = React.useState<Category>('TRANSPORT')
  const [type, setType] = React.useState<string>('car')
  const [amount, setAmount] = React.useState<number>(10)
  const [unit, setUnit] = React.useState<string>('km')
  const emission = computeEmissionKgCO2({ category, type, amount, unit })

  React.useEffect(() => {
    const firstType = Object.keys(emissionFactors[category])[0]
    setType(firstType)
    setUnit(defaultUnitFor(category))
  }, [category])

  async function logActivity() {
    const res = await fetch('/api/activities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category, type, amount, unit }),
    })
    if (res.ok) alert('Activity logged!')
  }

  return (
    <div className="container py-4 md:py-8">
      <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Carbon Calculator</h1>
      
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-base md:text-lg">Estimate your emissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select 
                  className="w-full border rounded-md px-3 py-2" 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value as Category)}
                >
                  {Object.keys(emissionFactors).map((k) => (
                    <option key={k} value={k}>
                      {k.toLowerCase().replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select 
                  className="w-full border rounded-md px-3 py-2" 
                  value={type} 
                  onChange={(e) => setType(e.target.value)}
                >
                  {Object.keys(emissionFactors[category]).map((t) => (
                    <option key={t} value={t}>
                      {t.replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Amount</label>
                  <input 
                    type="number" 
                    step="any" 
                    className="w-full border rounded-md px-3 py-2" 
                    value={amount} 
                    onChange={(e) => setAmount(parseFloat(e.target.value))} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Unit</label>
                  <input 
                    className="w-full border rounded-md px-3 py-2" 
                    value={unit} 
                    onChange={(e) => setUnit(e.target.value)} 
                  />
                </div>
              </div>
              
              <Button onClick={logActivity} className="w-full sm:w-auto">
                Log Activity
              </Button>
            </div>
            
            <div className="flex flex-col justify-center items-center lg:items-start p-6 bg-muted/30 rounded-lg">
              <div className="text-center lg:text-left">
                <h3 className="text-lg font-semibold mb-2">Estimated Emissions</h3>
                <div className="text-3xl font-bold text-eco-600 mb-2">
                  {emission} kg CO₂
                </div>
                <p className="text-sm text-muted-foreground">
                  Based on {amount} {unit} of {type.replace('_', ' ')} in {category.toLowerCase()}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function defaultUnitFor(category: Category): string {
  switch (category) {
    case 'TRANSPORT':
      return 'km'
    case 'ENERGY':
      return 'kWh'
    case 'FOOD':
      return 'kg'
    case 'SHOPPING':
      return 'kg'
    default:
      return 'unit'
  }
}