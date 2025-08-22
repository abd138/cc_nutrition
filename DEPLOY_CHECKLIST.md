# 📋 Deployment Checklist

## ✅ Completed
- [x] Supabase database created
- [x] Google OAuth Client ID created  
- [x] Database URL configured
- [x] T3 app built with all features

## 🔄 Next Steps

### 1. Get Google Client Secret
- [ ] Go to Google Cloud Console
- [ ] Copy the Client Secret from your OAuth credentials
- [ ] Save it for both local `.env.local` and Vercel environment variables

### 2. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit - NutriTrack T3 app"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/nutrition-tracker.git
git push -u origin main
```

### 3. Deploy to Vercel
- [ ] Go to [vercel.com](https://vercel.com)
- [ ] Import your GitHub repository
- [ ] Add environment variables (see setup-local.md)
- [ ] Deploy

### 4. Update OAuth Redirect URLs
- [ ] Add your Vercel URL to Google OAuth authorized redirect URIs
- [ ] Format: `https://your-app-name.vercel.app/api/auth/callback/google`

### 5. Initialize Database
```bash
# After Vercel deployment
npx prisma db push
npm run db:seed
```

## 🎯 Test Your Live App

- [ ] Visit your Vercel URL
- [ ] Sign in with Google
- [ ] Complete profile setup
- [ ] Add a food entry
- [ ] Check achievements
- [ ] Test PWA install on mobile

## 🚀 Free Resources Used

- **Supabase**: PostgreSQL database (500MB free)
- **Vercel**: Hosting (100GB bandwidth free)  
- **Google OAuth**: Authentication (free)
- **USDA API**: Food data (free with demo key)

**Total Cost: $0/month** 🎉

## 📱 Mobile PWA Features

Once deployed, your app will:
- ✅ Be installable on phones like a native app
- ✅ Work offline with cached data
- ✅ Send push notifications (when configured)
- ✅ Sync data across devices
- ✅ Have app-like navigation and gestures

## 🔧 Optional Enhancements

After basic deployment:
- [ ] Set up custom domain in Vercel
- [ ] Configure push notifications
- [ ] Add more OAuth providers (GitHub, Discord)
- [ ] Get real USDA API key for more food data
- [ ] Add Vercel Analytics for insights

Your nutrition tracker is ready to help users achieve their health goals! 🍎💪