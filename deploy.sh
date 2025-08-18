#!/bin/bash

# 🚀 EcoTrack Vercel Deployment Script
# This script helps prepare and deploy EcoTrack to Vercel

echo "🌱 EcoTrack Deployment Script"
echo "=============================="

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not found. Please initialize git first:"
    echo "   git init"
    echo "   git add ."
    echo "   git commit -m 'Initial commit'"
    exit 1
fi

# Check if remote origin exists
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "❌ No remote origin found. Please add your GitHub repository:"
    echo "   git remote add origin https://github.com/yourusername/ecotrack.git"
    exit 1
fi

# Check if .env.example exists and create it if not
if [ ! -f ".env.example" ]; then
    echo "📝 Creating .env.example file..."
    cat > .env.example << EOF
# Database
DATABASE_URL="postgresql://user:password@host/database"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# OAuth Providers (Optional)
GITHUB_ID="your-github-client-id"
GITHUB_SECRET="your-github-client-secret"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
EOF
    echo "✅ Created .env.example"
fi

# Check if vercel.json exists
if [ ! -f "vercel.json" ]; then
    echo "❌ vercel.json not found. Please create it first."
    exit 1
fi

# Run build test
echo "🔨 Testing build..."
if npm run build; then
    echo "✅ Build test passed!"
else
    echo "❌ Build test failed. Please fix the issues before deploying."
    exit 1
fi

# Check for uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo "📝 You have uncommitted changes. Please commit them first:"
    echo "   git add ."
    echo "   git commit -m 'Prepare for deployment'"
    exit 1
fi

# Push to GitHub
echo "📤 Pushing to GitHub..."
if git push origin main; then
    echo "✅ Successfully pushed to GitHub!"
else
    echo "❌ Failed to push to GitHub. Please check your remote configuration."
    exit 1
fi

echo ""
echo "🎉 Ready for Vercel deployment!"
echo ""
echo "📋 Next steps:"
echo "1. Go to https://vercel.com"
echo "2. Click 'New Project'"
echo "3. Import your GitHub repository"
echo "4. Configure environment variables:"
echo "   - DATABASE_URL"
echo "   - NEXTAUTH_URL"
echo "   - NEXTAUTH_SECRET"
echo "   - GITHUB_ID (optional)"
echo "   - GITHUB_SECRET (optional)"
echo "5. Click 'Deploy'"
echo ""
echo "📖 For detailed instructions, see VERCEL_DEPLOYMENT.md"
echo ""
echo "🌱 Happy Deploying!" 