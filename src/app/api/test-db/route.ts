import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Test database connection
    await prisma.$connect()
    
    // Try a simple query
    const userCount = await prisma.user.count()
    
    await prisma.$disconnect()
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database connection successful',
      userCount,
      databaseUrl: process.env.DATABASE_URL ? 'Set' : 'Not set',
      nodeEnv: process.env.NODE_ENV
    })
    
  } catch (error) {
    console.error('Database test error:', error)
    
    return NextResponse.json({ 
      error: 'Database connection failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      databaseUrl: process.env.DATABASE_URL ? 'Set' : 'Not set',
      nodeEnv: process.env.NODE_ENV
    }, { status: 500 })
  }
} 