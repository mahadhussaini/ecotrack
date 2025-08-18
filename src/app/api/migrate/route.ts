import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    // Test database connection
    await prisma.$connect()
    
    // Run database push (this will create tables if they don't exist)
    const { execSync } = require('child_process')
    
    try {
      execSync('npx prisma db push', { 
        stdio: 'pipe',
        env: { ...process.env }
      })
    } catch (pushError) {
      console.error('Prisma push error:', pushError)
      // If push fails, try to generate client first
      try {
        execSync('npx prisma generate', { 
          stdio: 'pipe',
          env: { ...process.env }
        })
        execSync('npx prisma db push', { 
          stdio: 'pipe',
          env: { ...process.env }
        })
      } catch (generateError) {
        console.error('Prisma generate error:', generateError)
        throw generateError
      }
    }
    
    await prisma.$disconnect()
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database migration completed successfully' 
    })
    
  } catch (error) {
    console.error('Migration error:', error)
    
    return NextResponse.json({ 
      error: 'Migration failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      databaseUrl: process.env.DATABASE_URL ? 'Set' : 'Not set'
    }, { status: 500 })
  }
} 