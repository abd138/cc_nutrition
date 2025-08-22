# 🚀 Free Deployment Guide - NutriTrack T3 App

This guide will help you deploy your nutrition tracker app completely free using modern services.

## 📋 Prerequisites

- GitHub account
- Google account (for OAuth)
- Email address for service signups

## 🗄️ Step 1: Set up Supabase (Free PostgreSQL Database)

### 1.1 Create Supabase Account
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project" 
3. Sign up with GitHub account
4. Create a new organization (use your name)

### 1.2 Create New Project
1. Click "New Project"
2. Choose your organization
3. **Project Name**: `nutrition-tracker`
4. **Database Password**: Generate a strong password (save it!)
5. **Region**: Choose closest to your location
6. Click "Create new project"

### 1.3 Get Database Connection Details
1. Go to Settings → Database
2. Copy the **Connection string** (URI format)
3. Replace `[YOUR-PASSWORD]` with your database password
4. Your connection string looks like:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-ID].supabase.co:5432/postgres
   ```

## 🔐 Step 2: Set up Google OAuth

### 2.1 Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "New Project"
3. **Project Name**: `NutriTrack`
4. Click "Create"

### 2.2 Enable Google+ API
1. Go to APIs & Services → Library
2. Search for "Google+ API"
3. Click and "Enable"

### 2.3 Configure OAuth Consent Screen
1. Go to APIs & Services → OAuth consent screen
2. Choose "External" user type
3. **App Name**: `NutriTrack`
4. **User support email**: Your email
5. **Developer contact**: Your email
6. Add scopes: `email`, `profile`, `openid`
7. Save and continue

### 2.4 Create OAuth Credentials
1. Go to APIs & Services → Credentials
2. Click "Create Credentials" → "OAuth 2.0 Client IDs"
3. **Application type**: Web application
4. **Name**: `NutriTrack Web Client`
5. **Authorized redirect URIs**:
   - `http://localhost:3000/api/auth/callback/google` (for local dev)
   - `https://your-app-name.vercel.app/api/auth/callback/google` (for production)
6. Click "Create"
7. **Save the Client ID and Client Secret** - you'll need these!

## 🚀 Step 3: Deploy to Vercel

### 3.1 Push to GitHub
1. Initialize git in your project:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - NutriTrack T3 app"
   ```

2. Create GitHub repository:
   - Go to [github.com](https://github.com)
   - Click "New repository"
   - **Name**: `nutrition-tracker`
   - Make it **Public** (required for free Vercel)
   - Don't initialize with README (we already have files)
   - Click "Create repository"

3. Connect and push:
   ```bash
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/nutrition-tracker.git
   git push -u origin main
   ```

### 3.2 Deploy with Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub account
3. Click "New Project"
4. Import your `nutrition-tracker` repository
5. **Framework**: Next.js (auto-detected)
6. **Build Command**: `npm run build`
7. **Install Command**: `npm install`
8. Click "Deploy"

### 3.3 Configure Environment Variables
1. In Vercel dashboard, go to your project
2. Go to Settings → Environment Variables
3. Add these variables:

```bash
# Database
DATABASE_URL="postgresql://postgres:[JeX.a8&wA%up4C7]@db.opfblpudhmfsfgypnttb.supabase.co:5432/postgres"

# NextAuth
NEXTAUTH_SECRET="your-super-secret-key-here-generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="https://your-app-name.vercel.app"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Optional: USDA API for food data
USDA_API_KEY="DEMO_KEY"

# App Config
NEXT_PUBLIC_APP_URL="https://your-app-name.vercel.app"
```

4. Click "Save" for each variable
5. Go to Deployments tab and redeploy latest deployment

## 🗃️ Step 4: Initialize Database

### 4.1 Install Dependencies Locally
```bash
npm install
```

### 4.2 Set up Local Environment
1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in your `.env.local` with the same values as Vercel

### 4.3 Generate and Push Database Schema
```bash
# Generate Prisma client
npx prisma generate

# Push schema to Supabase
npx prisma db push
```

### 4.4 Seed Initial Data (Optional)
```bash
# Create seed file first, then run:
npm run db:seed
```

## ✅ Step 5: Verify Deployment

### 5.1 Test Your App
1. Visit your Vercel URL: `https://your-app-name.vercel.app`
2. Try signing in with Google
3. Complete profile setup
4. Test basic functionality

### 5.2 Configure Custom Domain (Optional)
1. In Vercel, go to Settings → Domains
2. Add your custom domain if you have one
3. Update OAuth redirect URLs in Google Console

## 📱 Step 6: Enable PWA (Progressive Web App)

### 6.1 Test PWA Features
1. Visit your app on mobile browser
2. Look for "Install" or "Add to Home Screen" option
3. Install and test offline functionality

### 6.2 Add App Icons
1. Generate PWA icons at [PWABuilder](https://www.pwabuilder.com/imageGenerator)
2. Upload to `/public/` folder
3. Update `manifest.json` with correct paths

## 🎯 Free Tier Limits

### Supabase Free Tier:
- ✅ 500MB database storage
- ✅ 2GB bandwidth per month
- ✅ 50MB file storage
- ✅ Unlimited API requests
- ✅ Real-time subscriptions

### Vercel Free Tier:
- ✅ 100GB bandwidth per month
- ✅ Unlimited deployments
- ✅ Custom domains
- ✅ Automatic HTTPS
- ✅ Global CDN

### Google OAuth:
- ✅ Free for up to 1M users
- ✅ No API quotas for basic auth

## 🔧 Troubleshooting

### Common Issues:

1. **OAuth Redirect URI Mismatch**
   - Update Google Console with exact Vercel URL
   - Include `/api/auth/callback/google`

2. **Database Connection Failed**
   - Check DATABASE_URL format
   - Ensure Supabase project is active
   - Verify password is correct

3. **Build Failed on Vercel**
   - Check environment variables are set
   - Ensure all dependencies are in package.json
   - Review build logs in Vercel dashboard

4. **NEXTAUTH_SECRET Missing**
   - Generate with: `openssl rand -base64 32`
   - Add to both local and Vercel env vars

## 📊 Monitoring & Analytics

### Free Monitoring Options:
- **Vercel Analytics**: Built-in performance monitoring
- **Supabase Dashboard**: Database performance and usage
- **Google Analytics**: User behavior tracking (optional)

## 🚀 Next Steps After Deployment

1. ✅ Test all functionality on mobile
2. ✅ Share with friends for feedback
3. ✅ Monitor usage in dashboards
4. ✅ Optimize based on performance metrics
5. ✅ Consider premium features as you grow

---

## 📞 Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check Supabase database logs
3. Review Google Cloud Console for OAuth issues
4. Test locally first to isolate problems

Your nutrition tracker app is now deployed for FREE with professional-grade infrastructure! 🎉