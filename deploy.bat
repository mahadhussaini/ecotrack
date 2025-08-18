@echo off
REM 🚀 EcoTrack Vercel Deployment Script for Windows
REM This script helps prepare and deploy EcoTrack to Vercel

echo 🌱 EcoTrack Deployment Script
echo ==============================

REM Check if git is initialized
if not exist ".git" (
    echo ❌ Git repository not found. Please initialize git first:
    echo    git init
    echo    git add .
    echo    git commit -m "Initial commit"
    pause
    exit /b 1
)

REM Check if remote origin exists
git remote get-url origin >nul 2>&1
if errorlevel 1 (
    echo ❌ No remote origin found. Please add your GitHub repository:
    echo    git remote add origin https://github.com/yourusername/ecotrack.git
    pause
    exit /b 1
)

REM Check if .env.example exists and create it if not
if not exist ".env.example" (
    echo 📝 Creating .env.example file...
    (
        echo # Database
        echo DATABASE_URL="postgresql://user:password@host/database"
        echo.
        echo # NextAuth
        echo NEXTAUTH_URL="http://localhost:3000"
        echo NEXTAUTH_SECRET="your-secret-key-here"
        echo.
        echo # OAuth Providers ^(Optional^)
        echo GITHUB_ID="your-github-client-id"
        echo GITHUB_SECRET="your-github-client-secret"
        echo GOOGLE_CLIENT_ID="your-google-client-id"
        echo GOOGLE_CLIENT_SECRET="your-google-client-secret"
    ) > .env.example
    echo ✅ Created .env.example
)

REM Check if vercel.json exists
if not exist "vercel.json" (
    echo ❌ vercel.json not found. Please create it first.
    pause
    exit /b 1
)

REM Run build test
echo 🔨 Testing build...
call npm run build
if errorlevel 1 (
    echo ❌ Build test failed. Please fix the issues before deploying.
    pause
    exit /b 1
) else (
    echo ✅ Build test passed!
)

REM Check for uncommitted changes
git diff-index --quiet HEAD --
if errorlevel 1 (
    echo 📝 You have uncommitted changes. Please commit them first:
    echo    git add .
    echo    git commit -m "Prepare for deployment"
    pause
    exit /b 1
)

REM Push to GitHub
echo 📤 Pushing to GitHub...
git push origin main
if errorlevel 1 (
    echo ❌ Failed to push to GitHub. Please check your remote configuration.
    pause
    exit /b 1
) else (
    echo ✅ Successfully pushed to GitHub!
)

echo.
echo 🎉 Ready for Vercel deployment!
echo.
echo 📋 Next steps:
echo 1. Go to https://vercel.com
echo 2. Click 'New Project'
echo 3. Import your GitHub repository
echo 4. Configure environment variables:
echo    - DATABASE_URL
echo    - NEXTAUTH_URL
echo    - NEXTAUTH_SECRET
echo    - GITHUB_ID ^(optional^)
echo    - GITHUB_SECRET ^(optional^)
echo 5. Click 'Deploy'
echo.
echo 📖 For detailed instructions, see VERCEL_DEPLOYMENT.md
echo.
echo 🌱 Happy Deploying!
pause 