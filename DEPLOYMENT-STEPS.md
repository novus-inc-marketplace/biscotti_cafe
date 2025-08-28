# How to Deploy Your Next.js Site to GitHub Pages

## Problem Summary

Your Next.js site isn't displaying on GitHub Pages because:
1. GitHub Pages only serves static files, but your site uses server-side features (NextAuth, database)
2. No static export configuration is set up
3. No automated deployment workflow exists

## Solution Overview

To fix this, you need to:
1. Configure Next.js for static export
2. Remove incompatible features (authentication, database)
3. Set up GitHub Actions for automated deployment
4. Configure GitHub Pages settings

## Step-by-Step Instructions

### Step 1: Update Next.js Configuration

1. Update `next.config.ts` with static export settings:
   ```typescript
   import type { NextConfig } from "next";

   const nextConfig: NextConfig = {
     // Configure for static export
     output: 'export',
     
     // Disable image optimization since it requires a server
     images: {
       unoptimized: true,
     },
   };

   export default nextConfig;
   ```

### Step 2: Remove Authentication Features

1. Modify `src/app/page.tsx` to remove authentication code:
   - Remove `import { useSession, signOut } from 'next-auth/react'`
   - Remove `const { data: session } = useSession();`
   - Remove sign-in/sign-out buttons and conditional rendering

2. Update navigation to remove auth-related links

### Step 3: Set Up GitHub Actions Workflow

1. Create `.github/workflows/deploy.yml`:
   ```yaml
   name: Deploy to GitHub Pages

   on:
     push:
       branches: [main]
     workflow_dispatch:

   permissions:
     contents: read
     pages: write
     id-token: write

   concurrency:
     group: "pages"
     cancel-in-progress: false

   jobs:
     build:
       runs-on: ubuntu-latest
       steps:
         - name: Checkout
           uses: actions/checkout@v4

         - name: Setup Node
           uses: actions/setup-node@v4
           with:
             node-version: "20"
             cache: "npm"

         - name: Setup Pages
           uses: actions/configure-pages@v3

         - name: Install dependencies
           run: npm ci

         - name: Build with Next.js
           run: npx next build

         - name: Upload artifact
           uses: actions/upload-pages-artifact@v3
           with:
             path: ./out

     deploy:
       environment:
         name: github-pages
         url: ${{ steps.deployment.outputs.page_url }}
       runs-on: ubuntu-latest
       needs: build
       steps:
         - name: Deploy to GitHub Pages
           id: deployment
           uses: actions/deploy-pages@v3
   ```

### Step 4: Configure GitHub Pages

1. Go to your repository settings on GitHub
2. Navigate to "Pages" in the sidebar
3. Under "Build and deployment":
   - Select "GitHub Actions" as the source
4. Save the settings

### Step 5: Commit and Push Changes

1. Commit all changes:
   ```bash
   git add .
   git commit -m "Configure for GitHub Pages deployment"
   git push
   ```

2. Wait for the GitHub Actions workflow to complete (check the "Actions" tab)

### Step 6: View Your Site

After the workflow completes successfully, your site will be available at:
`https://your-username.github.io/mysite/`

## Alternative: Use the Vite/React App

If the Next.js approach seems too complex, you can deploy the existing Vite/React app in the `my-app` directory:

1. Move the contents of `my-app` to the root directory
2. Create a simpler GitHub Actions workflow for Vite:
   ```yaml
   name: Deploy to GitHub Pages

   on:
     push:
       branches: [main]
     workflow_dispatch:

   permissions:
     contents: read
     pages: write
     id-token: write

   jobs:
     build:
       runs-on: ubuntu-latest
       steps:
         - name: Checkout
           uses: actions/checkout@v4

         - name: Setup Node
           uses: actions/setup-node@v4
           with:
             node-version: "20"
             cache: "npm"

         - name: Setup Pages
           uses: actions/configure-pages@v3

         - name: Install dependencies
           run: npm ci

         - name: Build
           run: npm run build

         - name: Upload artifact
           uses: actions/upload-pages-artifact@v3
           with:
             path: ./dist

     deploy:
       environment:
         name: github-pages
         url: ${{ steps.deployment.outputs.page_url }}
       runs-on: ubuntu-latest
       needs: build
       steps:
         - name: Deploy to GitHub Pages
           id: deployment
           uses: actions/deploy-pages@v3
   ```

## Important Notes

1. **Database features won't work**: Contact form submissions and user accounts won't function on GitHub Pages
2. **Consider alternatives**: For a full-featured site, consider Vercel or Netlify which better support Next.js applications
3. **Custom domain**: If you set up a custom domain, remove the `basePath` configuration from `next.config.ts`

## Troubleshooting

If your site still doesn't appear:

1. Check that the GitHub Actions workflow completed successfully
2. Verify GitHub Pages is configured to deploy from GitHub Actions
3. Ensure your repository is public (required for GitHub Pages)
4. Check the browser console for any errors
5. Make sure you're accessing the correct URL