# 🚀 Vercel Deployment Guide for EcoTrack

This guide will help you deploy EcoTrack to Vercel with all the necessary configurations.

## 📋 Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Push your code to GitHub
3. **Database**: Set up a PostgreSQL database (recommended: [Neon](https://neon.tech) or [Supabase](https://supabase.com))
4. **OAuth Apps**: Set up GitHub/Google OAuth applications (optional)
5. **OpenAI API Key**: Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)

## 🗄️ Database Setup

### Option 1: Neon (Recommended)
1. Go to [neon.tech](https://neon.tech) and create an account
2. Create a new project
3. Copy the connection string from the dashboard
4. The connection string looks like: `postgresql://user:password@host/database`

### Option 2: Supabase
1. Go to [supabase.com](https://supabase.com) and create an account
2. Create a new project
3. Go to Settings > Database
4. Copy the connection string

## 🔐 Environment Variables

You'll need to set these environment variables in Vercel:

### Required Variables
```bash
# Database
DATABASE_URL="postgresql://user:password@host/database"

# NextAuth
NEXTAUTH_URL="https://your-app.vercel.app"
NEXTAUTH_SECRET="your-secret-key-here"

# OpenAI API
OPENAI_API_KEY="sk-your-openai-api-key-here"

# OAuth Providers (Optional)
GITHUB_ID="your-github-client-id"
GITHUB_SECRET="your-github-client-secret"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### Generating NEXTAUTH_SECRET
```bash
# Generate a secure secret
openssl rand -base64 32
```

## 🚀 Deployment Steps

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### Step 2: Connect to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Select the repository

### Step 3: Configure Project
1. **Framework Preset**: Next.js (should auto-detect)
2. **Root Directory**: `./` (leave empty)
3. **Build Command**: `npx prisma generate && npm run build` (auto-filled)
4. **Output Directory**: `.next` (auto-filled)
5. **Install Command**: `npm install` (auto-filled)

### Step 4: Set Environment Variables
1. In the Vercel dashboard, go to your project
2. Navigate to Settings > Environment Variables
3. Add each environment variable:

| Name | Value | Environment |
|------|-------|-------------|
| `DATABASE_URL` | Your database connection string | Production, Preview, Development |
| `NEXTAUTH_URL` | `https://your-app.vercel.app` | Production, Preview, Development |
| `NEXTAUTH_SECRET` | Your generated secret | Production, Preview, Development |
| `OPENAI_API_KEY` | Your OpenAI API key | Production, Preview, Development |
| `GITHUB_ID` | Your GitHub OAuth client ID | Production, Preview, Development |
| `GITHUB_SECRET` | Your GitHub OAuth client secret | Production, Preview, Development |
| `GOOGLE_CLIENT_ID` | Your Google OAuth client ID | Production, Preview, Development |
| `GOOGLE_CLIENT_SECRET` | Your Google OAuth client secret | Production, Preview, Development |

### Step 5: Deploy
1. Click "Deploy"
2. Wait for the build to complete
3. Your app will be available at `https://your-app.vercel.app`

## 🔧 Post-Deployment Setup

### Step 1: Database Migration
After deployment, you need to run the database migrations:

1. Go to your Vercel project dashboard
2. Navigate to Functions
3. Create a new API route or use the Vercel CLI:

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Run database migration
vercel env pull .env.local
npx prisma db push
```

### Step 2: Verify Deployment
1. Visit your deployed URL
2. Test the sign-up/sign-in functionality
3. Verify that the database is working
4. Check that all features are functioning

## 🔍 Troubleshooting

### Common Issues

#### 1. Build Failures
- **Issue**: Prisma client not generated
- **Solution**: Ensure `npx prisma generate` is in the build command

#### 2. Database Connection Issues
- **Issue**: Cannot connect to database
- **Solution**: Check DATABASE_URL format and network access

#### 3. NextAuth Issues
- **Issue**: Authentication not working
- **Solution**: Verify NEXTAUTH_URL and NEXTAUTH_SECRET

#### 4. Environment Variables
- **Issue**: Variables not available
- **Solution**: Ensure variables are set for all environments (Production, Preview, Development)

### Debug Commands
```bash
# Check build logs
vercel logs

# Check environment variables
vercel env ls

# Redeploy with fresh build
vercel --force
```

## 📊 Monitoring

### Vercel Analytics
1. Enable Vercel Analytics in your project settings
2. Monitor performance and user behavior

### Database Monitoring
- Use your database provider's dashboard
- Monitor connection pools and query performance

## 🔄 Continuous Deployment

Vercel automatically deploys when you push to your main branch. Each pull request creates a preview deployment.

### Custom Domains
1. Go to your project settings
2. Navigate to Domains
3. Add your custom domain
4. Update DNS records as instructed

## 🛡️ Security

### Environment Variables
- Never commit `.env` files to Git
- Use Vercel's environment variable system
- Rotate secrets regularly

### Database Security
- Use connection pooling
- Enable SSL connections
- Restrict database access

## 📈 Performance Optimization

### Vercel Optimizations
- Enable Edge Functions where appropriate
- Use Image Optimization
- Enable caching strategies

### Database Optimization
- Use connection pooling
- Optimize queries
- Monitor performance

## 🎉 Success!

Your EcoTrack application is now deployed on Vercel! 

### Next Steps
1. Set up monitoring and analytics
2. Configure custom domain
3. Set up CI/CD for automated testing
4. Monitor performance and user feedback

### Support
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)

---

**Happy Deploying! 🌱✨** 