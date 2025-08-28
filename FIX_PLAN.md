# Fix Plan for Next.js Website

## Issue Summary
The project has several issues that prevent it from building and deploying correctly:

1. TypeScript error in the blog post component due to missing type definitions
2. Configuration issues with Next.js export settings
3. Potential compatibility issues with the chosen deployment target (Vercel with server-side features)

## Fix 1: TypeScript Error in Blog Post Component

### Problem
The blog post component at `src/app/blog/[slug]/page.tsx` is missing type definitions for the `params` prop, causing TypeScript compilation errors.

### Solution
Update the component with proper TypeScript types:

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

## Fix 2: Next.js Configuration for Vercel Deployment

### Problem
The project needs to be configured properly for Vercel deployment with server-side features.

### Solution
Update `next.config.ts` to remove static export configuration:

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

## Fix 3: Blog Post Loading Solution

### Problem
The blog post component uses file system operations which are compatible with Vercel's serverless functions but were causing TypeScript errors.

### Solution
The current implementation is actually fine for Vercel deployment. After fixing the TypeScript errors, it should work correctly.

## Testing Plan

1. Apply the TypeScript fixes to the blog component
2. Verify Next.js configuration is correct for Vercel deployment
3. Run a local build to ensure there are no errors:
   ```bash
   npm run build
   ```
4. Test the application locally:
   ```bash
   npm run dev
   ```
5. Verify all pages work correctly:
   - Home page
   - Blog listing page
   - Individual blog post page
   - Authentication pages (sign in, sign up)

## Deployment to Vercel

After applying the fixes, you can deploy to Vercel with the default settings:
1. Connect your GitHub repository to Vercel
2. Use the default build settings:
   - Build Command: `next build`
   - Output Directory: `.next`
   - Framework Preset: Next.js