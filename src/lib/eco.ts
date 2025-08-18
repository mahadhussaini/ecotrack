export type ActivityInput = {
  category: 'TRANSPORT' | 'ENERGY' | 'FOOD' | 'SHOPPING'
  type: string
  amount: number
  unit: string
  date?: string | Date
}

export const emissionFactors: Record<string, Record<string, number>> = {
  TRANSPORT: {
    car: 0.21, // kg CO2 per km
    bus: 0.089,
    train: 0.041,
    plane: 0.255,
    bike: 0,
    walk: 0,
    public_transport: 0.089,
  },
  ENERGY: {
    electricity: 0.4, // kg CO2 per kWh
    gas: 2.3, // kg CO2 per m3
    heating: 0.18,
    solar: 0, // renewable
  },
  FOOD: {
    meat: 7.2, // kg per kg
    dairy: 3.2,
    vegetables: 0.4,
    fruits: 0.7,
    vegan_meal: 1.6, // avg per meal
  },
  SHOPPING: {
    electronics: 0.6, // kg per $ (very rough placeholder)
    clothing: 0.3,
    recycle: -1.0, // negative as credit per kg recycled (placeholder)
    reuse: -0.5,
  },
}

export function computeEmissionKgCO2(input: ActivityInput): number {
  const factor = emissionFactors[input.category]?.[input.type] ?? 0
  const emission = input.amount * factor
  return Number(emission.toFixed(3))
}

// Simple eco points heuristic rewarding eco-friendly actions
export function awardEcoPoints(input: ActivityInput, emissionKgCO2: number): number {
  let points = 0
  if (input.category === 'TRANSPORT') {
    if (input.type === 'walk' || input.type === 'bike') points += Math.round(input.amount * 2)
    if (input.type === 'public_transport' || input.type === 'bus' || input.type === 'train') points += Math.round(input.amount * 1)
  }
  if (input.category === 'ENERGY') {
    if (input.type === 'solar') points += 50
    // small reward for low usage
    if (input.type === 'electricity' && input.amount < 5) points += 5
  }
  if (input.category === 'FOOD') {
    if (input.type === 'vegan_meal') points += 5
    if (input.type === 'vegetables' || input.type === 'fruits') points += Math.max(1, Math.round(input.amount * 1))
  }
  if (input.category === 'SHOPPING') {
    if (input.type === 'recycle') points += Math.max(1, Math.round(input.amount * 2))
    if (input.type === 'reuse') points += Math.max(1, Math.round(input.amount * 1))
  }
  // bonus for negative emissions entries
  if (emissionKgCO2 < 0) points += Math.abs(Math.round(emissionKgCO2))
  return points
}

export function getDateKeys(date = new Date()) {
  const d = new Date(date)
  const dayKey = d.toISOString().slice(0, 10) // YYYY-MM-DD
  const week = getISOWeek(d)
  const year = d.getUTCFullYear()
  const weekKey = `${year}-W${String(week).padStart(2, '0')}`
  const monthKey = `${year}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`
  return { dayKey, weekKey, monthKey }
}

function getISOWeek(date: Date) {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))
  // set to nearest Thursday: current date + 4 - current day number
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
}

