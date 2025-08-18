'use client'

import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { LogOut, User, Settings, Leaf, LogIn, UserPlus } from 'lucide-react'
import Link from 'next/link'

export function Header() {
  const { data: session, status } = useSession()

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        {/* Left side - Logo and User info */}
        <div className="flex items-center gap-6">
          {/* Logo */}
          <Link href={session ? "/dashboard" : "/"} className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-eco-gradient shadow-lg">
              <Leaf className="h-5 w-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-lg text-gradient">EcoTrack</span>
            </div>
          </Link>

          {/* User info - Only show when logged in */}
          {session && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-eco-gradient flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {(session.user?.name || 'U')[0].toUpperCase()}
                  </span>
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium">{session.user?.name || 'User'}</p>
                  <p className="text-xs text-muted-foreground">{session.user?.email}</p>
                </div>
              </div>
              {!window.location.pathname.startsWith('/admin') && (
                <Badge variant="eco" size="sm">
                  {(session.user as any)?.points?.toLocaleString() || 0} pts
                </Badge>
              )}
              {(session.user as any)?.role === 'ADMIN' && (
                <Badge variant="warning" size="sm" className="hidden sm:inline-flex">
                  Admin
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-2">
          {/* Theme toggle - Always visible */}
          <ThemeToggle />

          {/* Show different content based on authentication status */}
          {status === 'loading' ? (
            // Loading state
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full border-2 border-muted border-t-eco-500 animate-spin"></div>
            </div>
          ) : session ? (
            // Logged in user actions
            <>
              {/* Admin panel link for admins */}
              {(session.user as any)?.role === 'ADMIN' && !window.location.pathname.startsWith('/admin') && (
                <Button
                  variant="eco-outline"
                  size="sm"
                  onClick={() => window.location.href = '/admin'}
                  className="hidden sm:inline-flex"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Admin
                </Button>
              )}

              {/* Back to app link for admin pages */}
              {window.location.pathname.startsWith('/admin') && (
                <Button
                  variant="eco-outline"
                  size="sm"
                  onClick={() => window.location.href = '/dashboard'}
                  className="hidden sm:inline-flex"
                >
                  <User className="h-4 w-4 mr-2" />
                  App
                </Button>
              )}

              {/* Sign out button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.href = '/api/auth/signout'}
                className="hidden sm:inline-flex"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>

              {/* Mobile sign out button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.href = '/api/auth/signout'}
                className="sm:hidden"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            // Not logged in - show auth buttons
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.href = '/api/auth/signin'}
                className="hidden sm:inline-flex"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Sign In
              </Button>
              
              <Button
                variant="eco"
                size="sm"
                onClick={() => window.location.href = '/api/auth/signin'}
                className="hidden sm:inline-flex"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Sign Up
              </Button>

              {/* Mobile auth button */}
              <Button
                variant="eco"
                size="sm"
                onClick={() => window.location.href = '/api/auth/signin'}
                className="sm:hidden"
              >
                <LogIn className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}