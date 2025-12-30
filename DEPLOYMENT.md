# EcoTrack Deployment Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL database
- Git

### Local Development

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd ecotrack
   npm install
   ```

2. **Environment Setup**
   Create `.env.local`:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/ecotrack"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"
   OPENAI_API_KEY="sk-your-openai-api-key-here"

   # Optional OAuth providers
   GITHUB_ID=""
   GITHUB_SECRET=""
   GOOGLE_CLIENT_ID=""
   GOOGLE_CLIENT_SECRET=""
   ```

3. **Database Setup**
   ```bash
   npm run prisma:generate
   npm run prisma:push
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```
   Visit [http://localhost:3000](http://localhost:3000)

## 🐳 Docker Deployment

### Using Docker Compose (Recommended)

```bash
# Start with PostgreSQL included
docker-compose up -d

# The app will be available at http://localhost:3000
```

### Manual Docker Build

```bash
# Build image
docker build -t ecotrack .

# Run with external database
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://user:pass@host:5432/db" \
  -e NEXTAUTH_SECRET="your-secret" \
  ecotrack
```

## ☁️ Production Deployment

### Vercel (Recommended)

1. **Deploy to Vercel**
   ```bash
   npm i -g vercel
   vercel
   ```

2. **Configure Environment Variables**
   In Vercel dashboard, add:
   - `DATABASE_URL`
   - `NEXTAUTH_URL` 
   - `NEXTAUTH_SECRET`
   - OAuth provider keys (optional)

3. **Database Migration**
   ```bash
   # Run once after deployment
   npx prisma db push
   ```

### Other Platforms

**Railway:**
- Connect GitHub repo
- Add PostgreSQL add-on
- Set environment variables
- Deploy automatically

**Netlify:**
- Use with external database (PlanetScale, Supabase)
- Configure build settings
- Set environment variables

## 🗄️ Database Options

### PostgreSQL (Recommended)
- **Local:** PostgreSQL server
- **Cloud:** 
  - Railway PostgreSQL
  - Supabase
  - AWS RDS
  - Google Cloud SQL

### Setup Steps
1. Create database
2. Set `DATABASE_URL` environment variable
3. Run `npx prisma db push`
4. (Optional) Seed initial data

## 🔧 Configuration

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `NEXTAUTH_URL` | ✅ | Application URL |
| `NEXTAUTH_SECRET` | ✅ | JWT signing secret |
| `OPENAI_API_KEY` | ✅ | OpenAI API key for AI features |
| `GITHUB_ID` | ❌ | GitHub OAuth ID |
| `GITHUB_SECRET` | ❌ | GitHub OAuth secret |
| `GOOGLE_CLIENT_ID` | ❌ | Google OAuth ID |
| `GOOGLE_CLIENT_SECRET` | ❌ | Google OAuth secret |

### OAuth Setup

**GitHub OAuth:**
1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Create new OAuth app
3. Set Authorization callback URL: `{NEXTAUTH_URL}/api/auth/callback/github`
4. Add Client ID and Secret to environment

**Google OAuth:**
1. Go to Google Cloud Console
2. Create OAuth 2.0 credentials
3. Set authorized redirect URI: `{NEXTAUTH_URL}/api/auth/callback/google`
4. Add Client ID and Secret to environment

## 🔍 Monitoring & Maintenance

### Health Checks
- `/api/hello` - Basic API health check
- Check database connectivity
- Monitor memory usage

### Database Maintenance
```bash
# Backup database
pg_dump $DATABASE_URL > backup.sql

# Monitor table sizes
npx prisma studio

# Reset database (development only)
npx prisma db push --force-reset
```

### Performance
- Enable database connection pooling
- Add Redis caching for sessions
- Use CDN for static assets
- Monitor API response times

## 🔐 Security

### Production Checklist
- [ ] Use strong `NEXTAUTH_SECRET`
- [ ] Enable HTTPS
- [ ] Configure CORS appropriately  
- [ ] Use environment variables for secrets
- [ ] Regular dependency updates
- [ ] Database backups
- [ ] Monitor for security vulnerabilities

### Rate Limiting
Consider adding rate limiting for:
- Authentication endpoints
- Activity logging
- Admin operations

## 🚨 Troubleshooting

### Common Issues

**Prisma Client Not Generated:**
```bash
npx prisma generate
```

**Database Connection Failed:**
- Check `DATABASE_URL` format
- Verify database is running
- Check network connectivity
- Ensure database exists

**OAuth Not Working:**
- Verify callback URLs match exactly
- Check OAuth app configuration
- Ensure secrets are correctly set

**Build Failures:**
- Check Node.js version (requires 20+)
- Clear `node_modules` and reinstall
- Check for TypeScript errors

### Logs & Debugging
```bash
# View application logs
docker logs ecotrack

# Database logs
docker logs ecotrack_db_1

# Next.js debug mode
DEBUG=* npm run dev
```

## 📊 Scaling

### Database Scaling
- Connection pooling (PgBouncer)
- Read replicas for analytics
- Database indexing optimization

### Application Scaling
- Horizontal scaling with load balancer
- Stateless session management
- CDN for static assets
- Background job processing

---

For support or issues, please check the [README.md](README.md) or create an issue in the repository.