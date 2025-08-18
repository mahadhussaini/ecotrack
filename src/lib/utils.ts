import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { computeEmissionKgCO2, type ActivityInput } from '@/lib/eco'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat().format(num)
}

export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

export function calculateCarbonFootprint(activities: ActivityInput[]): number {
  return activities.reduce((total, activity) => {
    const emission = computeEmissionKgCO2(activity)
    return total + emission
  }, 0)
}