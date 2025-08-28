# GitHub Pages Deployment Plan for Next.js Site

## Current Issues

1. **Next.js app with dynamic features**: The site uses NextAuth for authentication which requires a server, but GitHub Pages only serves static files
2. **No static export configuration**: Next.js needs to be configured for static export to work with GitHub Pages
3. **No GitHub Actions workflow**: There's no automated build process to generate and deploy static files
4. **Database dependencies**: The site uses Prisma with PostgreSQL which won't work on GitHub Pages

## Solution Overview

To deploy this Next.js site to GitHub Pages, we need to:

1. **Modify Next.js configuration** for static export
2. **Create GitHub Actions workflow** to build and deploy the site
3. **Handle authentication limitations** (either remove or adapt for static site)
4. **Update routing** for GitHub Pages compatibility

## Detailed Steps

### 1. Update Next.js Configuration

Create or update `next.config.ts` with static export settings:

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

### 2. Create GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

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

### 3. Handle Authentication Limitations

Since GitHub Pages is static-only:
- Remove or comment out NextAuth-related code in `src/app/page.tsx`
- Consider using a third-party authentication service that works with static sites (like Firebase Auth)
- Or remove authentication features entirely for the static version

### 4. Update Routing

If your repository is named `username.github.io/repo-name`, you'll need to:
- Uncomment and set the `basePath` in `next.config.ts` to `/repo-name`
- If using a custom domain, no basePath is needed

## Alternative Approach: Use the Vite/React App

The project also contains a Vite/React app in the `my-app` directory which might be easier to deploy to GitHub Pages:

1. Move the contents of `my-app` to the root directory
2. Add a simple GitHub Actions workflow to build and deploy the Vite app
3. This approach avoids the complexity of Next.js static export

## Important Notes

1. **Database features won't work**: Any database-dependent features (user accounts, contact form submissions) won't work on GitHub Pages
2. **Server-side features won't work**: API routes, server-side rendering, etc. won't function
3. **Consider alternatives**: For a full-featured site with authentication and database, consider Vercel, Netlify, or similar platforms