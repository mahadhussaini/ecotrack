'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    try {
      await signIn('credentials', { email, password, callbackUrl: '/dashboard' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container max-w-md py-16">
      <Card>
        <CardHeader>
          <CardTitle>Welcome back</CardTitle>
          <CardDescription>Sign in to continue your eco journey</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <input
                type="email"
                className="w-full rounded-md border px-3 py-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <input
                type="password"
                className="w-full rounded-md border px-3 py-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
          <div className="my-4 text-center text-sm text-muted-foreground">or</div>
          <div className="grid gap-2">
            <Button variant="outline" onClick={() => signIn('github', { callbackUrl: '/dashboard' })}>
              Continue with GitHub
            </Button>
            <Button variant="outline" onClick={() => signIn('google', { callbackUrl: '/dashboard' })}>
              Continue with Google
            </Button>
          </div>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link className="underline" href="/auth/signup">Sign up</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

