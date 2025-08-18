# EcoTrack - Carbon Footprint Tracker with Rewards

A comprehensive web application built with Next.js that helps users track their carbon footprint, earn eco-points for sustainable actions, and redeem rewards. Features gamification, analytics, leaderboards, and a marketplace for eco-friendly rewards.

## 🌱 Features

- **Carbon Footprint Calculator** - Track daily activities and calculate environmental impact
- **Smart Analytics** - Visualize progress with interactive charts and insights  
- **Gamified Rewards System** - Earn eco-points for sustainable actions
- **Leaderboards** - Compete with friends and global community
- **Rewards Marketplace** - Redeem points for discounts and eco-products
- **Progress Tracking** - Streaks, badges, and achievements
- **Mobile-First Design** - Responsive design optimized for all devices
- **Admin Panel** - Manage rewards, users, and track engagement

## 🚀 Tech Stack

- **Frontend**: Next.js 14 with App Router, React 18, TypeScript
- **Styling**: TailwindCSS with custom eco-themed design system
- **State Management**: React Query + Zustand
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with multiple providers
- **Charts**: Recharts and Chart.js for data visualization
- **UI Components**: Radix UI primitives with custom styling
- **Deployment**: Docker-ready with CI/CD support

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ecotrack
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Copy `.env.example` to `.env.local` and configure:
   ```bash
   DATABASE_URL="postgresql://username:password@localhost:5432/ecotrack"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
src/
├── app/                 # Next.js App Router pages
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   ├── layout/         # Layout components
│   ├── home/           # Homepage components
│   ├── dashboard/      # Dashboard components
│   └── auth/           # Authentication components
├── lib/                # Utility functions
├── hooks/              # Custom React hooks
├── store/              # Zustand state management
├── types/              # TypeScript type definitions
└── styles/             # Global styles
```

## 🌍 Core Modules

### 1. Authentication System
- User registration and login
- OAuth providers (Google, GitHub)
- Profile management
- Role-based access control

### 2. Carbon Calculator
- Activity input forms (transport, energy, diet, shopping)
- Real-time carbon footprint calculation
- Historical data tracking
- Emission factor database

### 3. Dashboard & Analytics
- Interactive charts and graphs
- Progress tracking over time
- Personalized insights and recommendations
- Goal setting and monitoring

### 4. Gamification & Rewards
- Eco-points system for sustainable actions
- Achievement badges and streaks
- Leaderboards (global and friends)
- Rewards marketplace integration

### 5. Admin Panel
- User management
- Rewards configuration
- Analytics and reporting
- Content management

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler

### Code Style

- ESLint configuration for code quality
- Prettier for code formatting
- TypeScript for type safety
- Tailwind CSS for styling

## 🚀 Deployment

### Docker Deployment

1. **Build the Docker image**
   ```bash
   docker build -t ecotrack .
   ```

2. **Run the container**
   ```bash
   docker run -p 3000:3000 ecotrack
   ```

### Environment Setup

Ensure all environment variables are properly configured for production:
- Database connection strings
- Authentication secrets
- API keys for third-party services

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Carbon emission factors from EPA and IPCC guidelines
- Design inspiration from leading sustainability platforms
- Open source community for amazing tools and libraries

## 🌟 Roadmap

- [ ] IoT/Smart device integration
- [ ] AI-powered recommendations
- [ ] Carbon offset marketplace
- [ ] Mobile app development
- [ ] API for third-party integrations
- [ ] Multi-language support

---

**EcoTrack** - Making sustainability rewarding, one action at a time. 🌱