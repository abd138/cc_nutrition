# 🚀 Quick Local Setup

## Missing Environment Variables

You still need to get:

### 1. Google Client Secret
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Go to APIs & Services → Credentials
4. Click on your OAuth client ID: `1002986944046-19fdo5hct06sgjcve0hhk48gc5n38k7j`
5. Copy the **Client Secret** (starts with `GOCSPX-`)
6. Replace `GOCSPX-your-actual-google-client-secret-here` in `.env.local`

### 2. Generate NextAuth Secret
Run this command to generate a secure secret:
```bash
openssl rand -base64 32
```
Or use this one I generated: `K8fH2jR9mN7qP5wX3vL1cB6nM8kS4tY9`

## Quick Local Test

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up database:**
   ```bash
   npx prisma generate
   npx prisma db push
   npm run db:seed
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Open:** http://localhost:3000

## For Vercel Deployment

Use these environment variables in Vercel dashboard:

```bash
# Database  
DATABASE_URL="postgresql://postgres:[JeX.a8&wA%up4C7]@db.opfblpudhmfsfgypnttb.supabase.co:5432/postgres"

# NextAuth
NEXTAUTH_SECRET="K8fH2jR9mN7qP5wX3vL1cB6nM8kS4tY9"
NEXTAUTH_URL="https://your-actual-vercel-url.vercel.app"

# Google OAuth
GOOGLE_CLIENT_ID="1002986944046-19fdo5hct06sgjcve0hhk48gc5n38k7j.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-your-actual-google-client-secret"

# Optional
USDA_API_KEY="DEMO_KEY"
NEXT_PUBLIC_APP_URL="https://your-actual-vercel-url.vercel.app"
```

## Important: Update OAuth Redirect URLs

In Google Cloud Console, add your Vercel URL to authorized redirect URIs:
- `https://your-actual-vercel-url.vercel.app/api/auth/callback/google`

## Test Checklist

- [ ] Google sign-in works
- [ ] Profile setup flow works  
- [ ] Dashboard loads with sample data
- [ ] Food search works
- [ ] PWA install prompt appears on mobile

🎉 **You're ready to go!**