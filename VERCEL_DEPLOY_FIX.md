# 🚀 VERCEL DEPLOYMENT - ENVIRONMENT VARIABLES FIX

## ⚡ Quick Fix for Deployment Error

The deployment failed because of missing environment variables. Here's how to fix it:

### Step 1: Set Required Environment Variables in Vercel

In your Vercel project dashboard:

1. Go to **Settings** → **Environment Variables**
2. Add these **REQUIRED** variables:

```bash
# Database (REQUIRED)
DATABASE_URL=postgresql://placeholder-url-will-replace-later

# Authentication (REQUIRED) 
NEXTAUTH_SECRET=your-secret-key-here-generate-with-openssl-rand-base64-32

# NextAuth URL (REQUIRED)
NEXTAUTH_URL=https://your-vercel-app-name.vercel.app
```

### Step 2: Optional Variables (for full functionality)

```bash
# Google OAuth (needed for login)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-vercel-app-name.vercel.app
USDA_API_KEY=DEMO_KEY
```

### Step 3: Generate NEXTAUTH_SECRET

Run this command locally to generate a secure secret:

```bash
openssl rand -base64 32
```

Copy the output and use it as your `NEXTAUTH_SECRET`.

### Step 4: Get Database URL (After Initial Deploy)

1. Go to [supabase.com](https://supabase.com)
2. Create new project: `nutrition-tracker`  
3. Go to Settings → Database
4. Copy connection string
5. Update `DATABASE_URL` in Vercel environment variables
6. Redeploy

### Step 5: Redeploy

After adding the environment variables:
1. Go to **Deployments** tab in Vercel
2. Click **"Redeploy"** on the latest deployment
3. ✅ Should deploy successfully!

## 🎯 Minimal Working Setup

For a quick deployment that works, you only need:

```bash
DATABASE_URL=postgresql://placeholder
NEXTAUTH_SECRET=any-random-32-char-string-here-abc123
NEXTAUTH_URL=https://your-app.vercel.app
```

You can update the database URL later once you set up Supabase.

## 🔧 Full Setup After Deployment

Once deployed successfully:

1. **Set up Supabase database**
2. **Update DATABASE_URL** in Vercel
3. **Set up Google OAuth** for login
4. **Run database migrations**: `npx prisma db push`
5. **Seed the database**: `npm run db:seed`

## ❓ Common Issues

**Q: Still getting build errors?**  
A: Make sure all environment variables are set in the "Production" environment in Vercel.

**Q: App loads but no login?**  
A: You need to set up Google OAuth credentials and update the CLIENT_ID/SECRET.

**Q: Database errors?**  
A: Set up Supabase and update the DATABASE_URL, then redeploy.

---

**After fixing these environment variables, your app should deploy successfully!** 🎉