# 🔧 Troubleshooting Guide - Internal Server Error

## 🚨 Issue: 500 Internal Server Error on Signup

The "Internal Server Error" you're experiencing is most likely due to missing environment variables or database connection issues. Here's how to fix it:

## 🔍 Step 1: Check Environment Variables

### Required Environment Variables in Vercel:

1. **Go to your Vercel Dashboard**
2. **Navigate to your project**
3. **Go to Settings > Environment Variables**
4. **Add these variables:**

```bash
# Required
DATABASE_URL="postgresql://user:password@host/database"
NEXTAUTH_URL="https://your-app.vercel.app"
NEXTAUTH_SECRET="your-generated-secret"

# Optional (for OAuth)
GITHUB_ID="your-github-client-id"
GITHUB_SECRET="your-github-client-secret"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### Generate NEXTAUTH_SECRET:
```bash
# Run this command to generate a secure secret
openssl rand -base64 32
```

## 🗄️ Step 2: Set Up Database

### Option 1: Neon (Recommended)
1. Go to [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string
4. Add it as `DATABASE_URL` in Vercel

### Option 2: Supabase
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings > Database
4. Copy the connection string
5. Add it as `DATABASE_URL` in Vercel

## 🔧 Step 3: Run Database Migrations

After setting up the database, you need to run migrations:

### Using Vercel CLI:
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Pull environment variables
vercel env pull .env.local

# Run database migration
npx prisma db push
```

### Alternative: Create a Migration API Route
Create a temporary API route to run migrations:

```typescript
// src/app/api/migrate/route.ts
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    // This will create the database schema
    await prisma.$executeRaw`CREATE SCHEMA IF NOT EXISTS public;`
    
    return NextResponse.json({ 
      message: 'Database migration completed successfully' 
    })
  } catch (error) {
    return NextResponse.json({ 
      error: 'Migration failed', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}
```

## 🧪 Step 4: Test Database Connection

Visit this URL to test your database connection:
```
https://your-app.vercel.app/api/health
```

This will show you:
- Database connection status
- Environment variable status
- User count
- Any specific errors

## 🔄 Step 5: Redeploy

After setting up environment variables:

1. **Go to Vercel Dashboard**
2. **Navigate to Deployments**
3. **Click "Redeploy" on your latest deployment**
4. **Or push a new commit to trigger automatic deployment**

## 🐛 Common Issues and Solutions

### Issue 1: "DATABASE_URL is not set"
**Solution**: Add the DATABASE_URL environment variable in Vercel

### Issue 2: "Database connection failed"
**Solution**: 
- Check your database URL format
- Ensure the database is accessible from Vercel
- Verify database credentials

### Issue 3: "Schema does not exist"
**Solution**: Run database migrations using the steps above

### Issue 4: "NEXTAUTH_SECRET is not set"
**Solution**: Generate and add the NEXTAUTH_SECRET environment variable

### Issue 5: "NEXTAUTH_URL is not set"
**Solution**: Set NEXTAUTH_URL to your Vercel app URL

## 📋 Environment Variables Checklist

Make sure you have ALL of these set in Vercel:

- [ ] `DATABASE_URL` - Your PostgreSQL connection string
- [ ] `NEXTAUTH_URL` - Your Vercel app URL (e.g., https://your-app.vercel.app)
- [ ] `NEXTAUTH_SECRET` - A secure random string
- [ ] `GITHUB_ID` - (Optional) GitHub OAuth client ID
- [ ] `GITHUB_SECRET` - (Optional) GitHub OAuth client secret

## 🔍 Debug Steps

1. **Check Vercel Function Logs**:
   - Go to Vercel Dashboard > Functions
   - Check the logs for your signup API route

2. **Test Health Endpoint**:
   - Visit `/api/health` to see detailed status

3. **Check Environment Variables**:
   - Use the health endpoint to verify all variables are set

4. **Test Database Connection**:
   - The health endpoint will test database connectivity

## 🚀 Quick Fix Commands

```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32

# Test locally (if you have .env.local)
npm run dev

# Check build locally
npm run build
```

## 📞 Still Having Issues?

If you're still experiencing problems:

1. **Check Vercel Function Logs** for specific error messages
2. **Verify all environment variables** are set correctly
3. **Test database connection** using the health endpoint
4. **Ensure database migrations** have been run
5. **Check that your database** is accessible from Vercel's servers

## 🎯 Expected Result

After following these steps, you should be able to:
- ✅ Sign up new users successfully
- ✅ Sign in with existing users
- ✅ Access all application features
- ✅ No more 500 Internal Server Errors

---

**Need more help? Check the Vercel logs for specific error messages! 🔍** 