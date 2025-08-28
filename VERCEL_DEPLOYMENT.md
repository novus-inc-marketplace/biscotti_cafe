# Vercel Deployment Guide

## Simple Deployment (Current Version)

### 1. Push to GitHub
Make sure your code is pushed to a GitHub repository:
```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 2. Connect to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up or log in to your account
3. Click "New Project"
4. Import your GitHub repository
5. Click "Deploy"

### 3. That's It!
Vercel will automatically:
- Detect it's a Next.js app
- Install dependencies
- Build your site
- Deploy it with a Vercel URL

## For Full Features (With Authentication)

If you want to restore authentication and database features:

1. **Restore package dependencies**:
   ```bash
   npm install next-auth @auth/prisma-adapter bcrypt prisma @prisma/client
   ```

2. **Restore authentication code** in `src/app/page.tsx`:
   - Re-add `import { useSession, signOut } from 'next-auth/react'`
   - Re-add `const { data: session } = useSession();`
   - Re-add sign-in/sign-out buttons

3. **Restore Providers** in `src/app/providers.tsx`:
   - Re-add `import { SessionProvider } from 'next-auth/react'`
   - Wrap children with `<SessionProvider>`

4. **Re-add authentication directories** (`src/app/auth`, `src/app/api/auth`)

5. **Set up environment variables** in Vercel:
   - Add your `DATABASE_URL` in the Vercel project settings

The current version will work on Vercel without any additional configuration, but with limited features since authentication has been removed.