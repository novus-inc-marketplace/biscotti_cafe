# Next.js Deployment Troubleshooting Guide

This guide addresses the build errors you're experiencing both locally and on Vercel, along with deployment issues.

## Common Issues and Solutions

### 1. TypeScript Error in Blog Post Component

**Issue**: The blog post component at `src/app/blog/[slug]/page.tsx` is missing type definitions for the `params` prop, causing TypeScript compilation errors.

**Solution**: Update the component with proper TypeScript types:

```typescript
// src/app/blog/[slug]/page.tsx
import fs from 'fs';
import path from 'path';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Add type definition for params
interface BlogPostParams {
  slug: string;
}

interface BlogPostProps {
  params: BlogPostParams;
}

export default async function BlogPost({ params }: BlogPostProps) {
  const { slug } = params;
  const postFilePath = path.join(process.cwd(), 'src/app/blog/posts', `${slug}.md`);
  let content = '';

  try {
    content = await fs.promises.readFile(postFilePath, 'utf8');
  } catch (error) {
    console.error('Error reading blog post:', error);
    // Handle error, e.g., display a 404 message
    return (
      <div className="container py-12 text-center">
        <h2 className="text-4xl font-bold text-red-500 mb-4">404 - Post Not Found</h2>
        <p className="text-lg text-gray-700 dark:text-gray-300">The blog post you are looking for does not exist.</p>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <article className="prose dark:prose-invert max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {content}
        </ReactMarkdown>
      </article>
    </div>
  );
}

export async function generateStaticParams() {
  const postsDirectory = path.join(process.cwd(), 'src/app/blog/posts');
  const filenames = await fs.promises.readdir(postsDirectory);

  return filenames.map((filename) => ({
    slug: filename.replace(/\.md$/, ''),
  }));
}
```

### 2. Static Export Compatibility Issues

**Issue**: The blog post component uses file system operations (`fs.promises.readFile`, `fs.promises.readdir`) which won't work with static export since these operations require a Node.js runtime environment.

**Solution Options**:

#### Option A: Move to Dynamic Rendering (Recommended for Vercel)

If you're deploying to Vercel and want to keep the file system operations, remove the static export configuration:

1. Update `next.config.ts`:
```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remove static export for Vercel deployment
  // output: 'export',  // Comment out or remove this line
  
  // You can keep image optimization for Vercel
  images: {
    // Remove unoptimized: true for Vercel
  },
};

export default nextConfig;
```

#### Option B: Pre-process Markdown Files (For GitHub Pages)

If you want to keep static export for GitHub Pages, you'll need to pre-process the markdown files at build time:

1. Create a script to convert markdown files to JSON at build time
2. Import the JSON data instead of reading files at runtime

### 3. Local Build Issues

**Issue**: Build errors when running `npm run build` locally.

**Solutions**:

1. **Clean build cache**:
   ```bash
   # Remove Next.js build output
   rm -rf .next
   # Remove static export output if it exists
   rm -rf out
   # Reinstall dependencies
   npm ci
   # Run build
   npm run build
   ```

2. **Check Node.js version**:
   Ensure you're using Node.js 18.17 or later:
   ```bash
   node --version
   ```

3. **Check for TypeScript errors**:
   Run TypeScript check separately:
   ```bash
   npx tsc --noEmit
   ```

### 4. Vercel Deployment Issues

**Issue**: Deployment errors on Vercel.

**Solutions**:

1. **Update Vercel project settings**:
   - Go to your Vercel project dashboard
   - Navigate to Settings > General
   - In the "Build & Development Settings" section:
     - Set "Framework Preset" to "Next.js"
     - Set "Build Command" to `next build`
     - Set "Output Directory" to `.next`

2. **Environment variables**:
   - If you're using environment variables, make sure they're added to your Vercel project settings
   - In Vercel dashboard: Settings > Environment Variables

3. **Check Vercel logs**:
   - In your Vercel dashboard, go to the "Deployments" tab
   - Click on the failed deployment to see detailed logs
   - Look for specific error messages to identify the root cause

### 5. GitHub Pages Deployment Issues

**Issue**: Site not appearing on GitHub Pages.

**Solutions**:

1. **Verify GitHub Pages configuration**:
   - Go to your repository settings on GitHub
   - Navigate to "Pages" in the sidebar
   - Under "Build and deployment":
     - Select "GitHub Actions" as the source
   - Save the settings

2. **Check GitHub Actions workflow**:
   - Go to the "Actions" tab in your repository
   - Verify that the "Deploy to GitHub Pages" workflow is running successfully
   - Check the logs for any errors

3. **Repository visibility**:
   - Ensure your repository is public (required for GitHub Pages)

## Recommended Approach

Based on your requirements, I recommend the following approach:

### For Vercel Deployment (Full Features):
1. Fix the TypeScript error in the blog component
2. Remove static export configuration from `next.config.ts`
3. Restore authentication features if needed
4. Deploy to Vercel with default settings

### For GitHub Pages Deployment (Static Site):
1. Fix the TypeScript error in the blog component
2. Pre-process markdown files at build time instead of reading them at runtime
3. Keep the static export configuration
4. Deploy via GitHub Actions

## Quick Fix for Immediate Deployment

If you want a quick fix to get your site deployed without the blog functionality:

1. Temporarily remove the blog route by deleting or renaming the `src/app/blog` directory
2. Run the build process:
   ```bash
   npm run build
   ```
3. Deploy to either platform

You can always add the blog functionality back later with a proper implementation that's compatible with your chosen deployment target.