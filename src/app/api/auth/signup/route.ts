import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    // Validate request
    const { name, email, password } = await request.json()
    
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })
    }

    // Check if user already exists
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 })
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10)

    // Create user
    const user = await prisma.user.create({ 
      data: { 
        name: name || null, 
        email, 
        password: hashed,
        points: 0,
        role: 'USER'
      } 
    })

    return NextResponse.json({ 
      ok: true, 
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email 
      } 
    })

  } catch (error) {
    console.error('Signup error:', error)
    
    // Check for specific database errors
    if (error instanceof Error) {
      if (error.message.includes('DATABASE_URL')) {
        return NextResponse.json({ 
          error: 'Database configuration error. Please check your environment variables.' 
        }, { status: 500 })
      }
      
      if (error.message.includes('connect')) {
        return NextResponse.json({ 
          error: 'Database connection failed. Please check your database URL and network connection.' 
        }, { status: 500 })
      }
      
      if (error.message.includes('schema')) {
        return NextResponse.json({ 
          error: 'Database schema error. Please run database migrations.' 
        }, { status: 500 })
      }
    }

    return NextResponse.json({ 
      error: 'Internal Server Error',
      details: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.message : 'Unknown error' : undefined
    }, { status: 500 })
  }
}

