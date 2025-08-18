'use client'

import { Button } from '@/components/ui/button'
import { Leaf, LogOut } from 'lucide-react'
import Link from 'next/link'

export default function QuickActions() {
  const handleSignOut = () => {
    window.location.href = '/api/auth/signout'
  }

  return (
    <div className="space-y-3">
      <Button variant="eco" size="sm" className="w-full" leftIcon={<Leaf className="h-4 w-4" />} asChild>
        <Link href="/activities">Log Activity</Link>
      </Button>
      <Button variant="eco-outline" size="sm" className="w-full" asChild>
        <Link href="/rewards">View Rewards</Link>
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        className="w-full" 
        leftIcon={<LogOut className="h-4 w-4" />}
        onClick={handleSignOut}
      >
        Sign Out
      </Button>
    </div>
  )
} 