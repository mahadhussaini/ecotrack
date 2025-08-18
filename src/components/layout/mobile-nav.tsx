'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Menu, X, Leaf, LogOut, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { 
  Home, 
  Calculator, 
  Activity, 
  TrendingUp, 
  Gift, 
  Award 
} from 'lucide-react'

const routes = [
  { href: '/dashboard', label: 'Dashboard', icon: Home, badge: null },
  { href: '/calculator', label: 'Calculator', icon: Calculator, badge: null },
  { href: '/activities', label: 'Activities', icon: Activity, badge: null },
  { href: '/leaderboard', label: 'Leaderboard', icon: TrendingUp, badge: 'New' },
  { href: '/rewards', label: 'Rewards', icon: Gift, badge: null },
  { href: '/progress', label: 'Progress', icon: Award, badge: null },
]

export function MobileNav() {
  const [isOpen, setIsOpen] = React.useState(false)
  const pathname = usePathname()
  const { data: session } = useSession()

  if (!session) return null

  const isAdmin = (session.user as any)?.role === 'ADMIN'

  const handleSignOut = () => {
    window.location.href = '/api/auth/signout'
  }

  return (
    <div className="lg:hidden">
      {/* Mobile header */}
      <div className="flex items-center justify-between p-4 border-b bg-background">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="p-1 rounded-lg bg-eco-gradient">
            <Leaf className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-gradient">EcoTrack</span>
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-md hover:bg-muted transition-colors"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
          <div className="fixed inset-y-0 left-0 w-72 bg-background border-r shadow-lg">
            <div className="p-6 h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Navigation</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-md hover:bg-muted transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* User Info */}
              <div className="p-3 rounded-lg bg-muted/50 border border-border mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-eco-gradient flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {(session.user?.name || 'U')[0].toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{session.user?.name || 'User'}</p>
                    <p className="text-xs text-muted-foreground truncate">{session.user?.email}</p>
                  </div>
                </div>
                {!pathname.startsWith('/admin') && (
                  <div className="mt-2 pt-2 border-t border-border">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Eco Points</span>
                      <span className="font-semibold text-eco-600">
                        {(session.user as any)?.points?.toLocaleString() || 0}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation Links */}
              <div className="flex-1 space-y-1">
                {routes.map((route) => {
                  const Icon = route.icon
                  const isActive = pathname === route.href
                  return (
                    <Link
                      key={route.href}
                      href={route.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200',
                        isActive 
                          ? 'bg-eco-100 text-eco-700 dark:bg-eco-900 dark:text-eco-300' 
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      )}
                    >
                      <Icon className={cn(
                        'h-4 w-4 transition-colors',
                        isActive && 'text-eco-600'
                      )} />
                      <span className="font-medium">{route.label}</span>
                      {route.badge && (
                        <Badge variant="eco" size="sm" className="ml-auto">
                          {route.badge}
                        </Badge>
                      )}
                    </Link>
                  )
                })}
              </div>

              {/* Admin/App Switch */}
              {isAdmin && !pathname.startsWith('/admin') && (
                <div className="pt-4 border-t border-border mb-4">
                  <Link
                    href="/admin"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200"
                  >
                    <Settings className="h-4 w-4" />
                    <span className="font-medium">Admin Panel</span>
                    <Badge variant="warning" size="sm" className="ml-auto">
                      Admin
                    </Badge>
                  </Link>
                </div>
              )}
              
              {pathname.startsWith('/admin') && (
                <div className="pt-4 border-t border-border mb-4">
                  <Link
                    href="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200"
                  >
                    <Home className="h-4 w-4" />
                    <span className="font-medium">Back to App</span>
                  </Link>
                </div>
              )}

              {/* Sign Out */}
              <div className="pt-4 border-t border-border">
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="font-medium">Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}