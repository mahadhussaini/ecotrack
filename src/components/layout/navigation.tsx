'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { 
  Home, 
  Calculator, 
  Activity, 
  TrendingUp, 
  Gift, 
  Award, 
  Settings,
  Users,
  Leaf,
  LogOut
} from 'lucide-react'

const userRoutes = [
  { href: '/dashboard', label: 'Dashboard', icon: Home, badge: null },
  { href: '/calculator', label: 'Calculator', icon: Calculator, badge: null },
  { href: '/activities', label: 'Activities', icon: Activity, badge: null },
  { href: '/leaderboard', label: 'Leaderboard', icon: TrendingUp, badge: 'New' },
  { href: '/rewards', label: 'Rewards', icon: Gift, badge: null },
  { href: '/progress', label: 'Progress', icon: Award, badge: null },
]

const adminRoutes = [
  { href: '/admin', label: 'Overview', icon: Home, badge: null },
  { href: '/admin/users', label: 'Users', icon: Users, badge: null },
  { href: '/admin/rewards', label: 'Rewards', icon: Gift, badge: null },
]

export function Navigation() {
  const pathname = usePathname()
  const { data: session } = useSession()
  
  if (!session) return null

  const isAdmin = (session.user as any)?.role === 'ADMIN'
  const routes = pathname.startsWith('/admin') ? adminRoutes : userRoutes

  return (
    <nav className="w-64 bg-card border-r border-border h-screen sticky top-0 hidden lg:block">
      <div className="p-6 space-y-6">
        {/* Logo/Brand */}
        <div className="flex items-center gap-3 pb-4 border-b border-border">
          <div className="p-2 rounded-lg bg-green-500">
            <Leaf className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold">
              {pathname.startsWith('/admin') ? 'Admin Panel' : 'EcoTrack'}
            </h2>
            <p className="text-xs text-muted-foreground">
              {pathname.startsWith('/admin') ? 'Management Dashboard' : 'Carbon Footprint Tracker'}
            </p>
          </div>
        </div>

        {/* User Info */}
        <div className="p-3 rounded-lg bg-muted border border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
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
                <span className="font-semibold text-green-600">
                  {(session.user as any)?.points?.toLocaleString() || 0}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <div className="space-y-1">
          {routes.map((route) => {
            const Icon = route.icon
            const isActive = pathname === route.href
            return (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  'block',
                  isActive && 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                )}
              >
                <div className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200',
                  isActive 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                )}>
                  <Icon className={cn(
                    'h-4 w-4 transition-colors',
                    isActive && 'text-green-600'
                  )} />
                  <span className="font-medium">{route.label}</span>
                  {route.badge && (
                    <Badge variant="default" size="sm" className="ml-auto">
                      {route.badge}
                    </Badge>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
        
        {/* Admin/App Switch */}
        {isAdmin && !pathname.startsWith('/admin') && (
          <div className="pt-4 border-t border-border">
            <Link
              href="/admin"
              className="block"
            >
              <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200">
                <Settings className="h-4 w-4" />
                <span className="font-medium">Admin Panel</span>
                <Badge variant="default" size="sm" className="ml-auto">
                  Admin
                </Badge>
              </div>
            </Link>
          </div>
        )}
        
        {pathname.startsWith('/admin') && (
          <div className="pt-4 border-t border-border">
            <Link
              href="/dashboard"
              className="block"
            >
              <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200">
                <Home className="h-4 w-4" />
                <span className="font-medium">Back to App</span>
              </div>
            </Link>
          </div>
        )}

        {/* Sign Out */}
        <div className="pt-4 border-t border-border">
          <button
            onClick={() => {
              // Handle sign out
              window.location.href = '/api/auth/signout'
            }}
            className="w-full"
          >
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200">
              <LogOut className="h-4 w-4" />
              <span className="font-medium">Sign Out</span>
            </div>
          </button>
        </div>
      </div>
    </nav>
  )
}