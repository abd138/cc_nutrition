# 🍎 NutriTrack - T3 Nutrition Tracker

A modern, mobile-first nutrition tracking app built with the T3 stack and BMAD methodology. Track your nutrition, achieve your goals, and stay motivated with gamification - all deployed for FREE!

## ✨ Features

- 🔐 **OAuth Authentication** - Sign in with Google, GitHub, or Discord
- 📊 **Smart Nutrition Tracking** - BMAD-powered macro calculations
- 🎮 **Gamification** - Achievements, streaks, and level progression  
- 📱 **Mobile-First PWA** - Install on your phone like a native app
- 🎯 **Goal-Based Nutrition** - Lose fat, gain muscle, or maintain weight
- 📈 **Progress Analytics** - Charts and insights for your journey
- 🔄 **Real-time Sync** - Data syncs across all your devices
- 📴 **Offline Support** - Works even without internet

## 🚀 Live Demo

**[Try NutriTrack →](https://your-app-name.vercel.app)**

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org) with App Router
- **Database**: [Prisma](https://prisma.io) + [Supabase PostgreSQL](https://supabase.com) (Free)
- **Authentication**: [NextAuth.js](https://next-auth.js.org) with OAuth
- **API**: [tRPC](https://trpc.io) for end-to-end type safety
- **Styling**: [Tailwind CSS](https://tailwindcss.com) for mobile-first design
- **Deployment**: [Vercel](https://vercel.com) (Free tier)
- **Type Safety**: [TypeScript](https://typescriptlang.org) throughout

## 🏃‍♂️ Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/nutrition-tracker.git
   cd nutrition-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Fill in your database URL and OAuth credentials

4. **Set up database**
   ```bash
   npx prisma generate
   npx prisma db push
   npm run db:seed
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open [http://localhost:3000](http://localhost:3000)**

## 🌍 Free Deployment

This app is designed to be deployed completely FREE using:

- **Database**: Supabase PostgreSQL (500MB free)
- **Hosting**: Vercel (100GB bandwidth free)  
- **Auth**: NextAuth.js OAuth (free)
- **Domain**: Vercel subdomain (free)

Follow the detailed [**Deployment Guide**](./DEPLOYMENT_GUIDE.md) for step-by-step instructions.

## 🧠 BMAD Integration

This app implements the BMAD (Behavioral Modification and Data) methodology through:

### 🥗 Nutrition Specialist
- **BMR Calculation**: Mifflin-St Jeor equation for accurate metabolic rate
- **TDEE Calculation**: Activity-based total daily energy expenditure
- **Macro Distribution**: Goal-specific protein/carb/fat ratios
- **Progressive Targets**: Adaptive recommendations based on progress

### 📱 Mobile Architect  
- **PWA Configuration**: Installable on any device
- **Offline Support**: Service worker for offline functionality
- **Responsive Design**: Mobile-first with desktop support
- **Performance**: Optimized for mobile networks

### 🎮 Gamification Expert
- **Achievement System**: Unlock badges for hitting targets
- **Streak Tracking**: Build habits with daily logging streaks
- **Level Progression**: XP system based on consistency
- **Social Features**: Compare progress with friends

## 📊 Project Structure

```
src/
├── app/                 # Next.js 14 App Router
├── components/          # Reusable UI components
├── server/
│   ├── api/            # tRPC API routes
│   ├── auth.ts         # NextAuth configuration
│   └── db.ts           # Prisma client
├── styles/             # Global CSS
└── utils/              # Helper functions

prisma/
├── schema.prisma       # Database schema
└── seed.ts            # Sample data

public/                 # Static assets
```

## 🔧 Development Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production  
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking

# Database
npm run db:push      # Push schema changes
npm run db:studio    # Open Prisma Studio
npm run db:seed      # Seed sample data
npm run db:generate  # Generate Prisma client
```

## 🎯 Key Features Deep Dive

### Smart Nutrition Calculations
- **BMI Tracking**: Automatic BMI calculation with health categories
- **Goal-Based Macros**: Different calculations for fat loss vs muscle gain
- **Activity Multipliers**: TDEE adjustments based on exercise level
- **Weight Progression**: Macro updates based on weight changes

### Gamification System
- **Achievement Categories**: Consistency, Accuracy, Streaks, Milestones
- **XP System**: Earn points for logging meals and hitting targets
- **Streak Counters**: Track daily logging and macro accuracy streaks
- **Level Progression**: Unlock features as you level up

### PWA Features
- **Offline Logging**: Log meals without internet connection
- **Push Notifications**: Meal reminders and achievement alerts
- **App-like Experience**: Install on home screen, full-screen mode
- **Background Sync**: Sync offline data when connection returns

## 🔐 Authentication & Security

- **OAuth Providers**: Google, GitHub, Discord integration
- **Session Management**: Secure JWT sessions with NextAuth.js
- **CSRF Protection**: Built-in request verification
- **Type Safety**: End-to-end TypeScript for API security

## 📈 Performance & Monitoring

- **Vercel Analytics**: Built-in performance monitoring (free)
- **Database Monitoring**: Supabase dashboard for query performance
- **Error Tracking**: Built-in error boundaries and logging
- **Lighthouse Score**: Optimized for 90+ performance scores

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **T3 Stack** for the amazing developer experience
- **BMAD Methodology** for evidence-based nutrition science
- **Vercel & Supabase** for generous free tiers
- **Open Source Community** for the incredible tools

## 📞 Support

- 📖 **Documentation**: Check the [Deployment Guide](./DEPLOYMENT_GUIDE.md)
- 🐛 **Bug Reports**: Open an issue on GitHub
- 💡 **Feature Requests**: Open a discussion
- 📧 **Direct Contact**: [your-email@example.com]

---

**Built with ❤️ using the T3 Stack and BMAD methodology**

🚀 **Deploy your own**: [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/nutrition-tracker)