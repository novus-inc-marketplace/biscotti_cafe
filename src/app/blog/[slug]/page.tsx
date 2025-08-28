import fs from 'fs';
import path from 'path';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Add type definition for params
interface BlogPostParams {
  slug: string;
}

interface BlogPostProps {
  params: Promise<BlogPostParams>;
}

export default async function BlogPost({ params }: BlogPostProps) {
  const { slug } = await params;
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

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const postsDirectory = path.join(process.cwd(), 'src/app/blog/posts');
  const filenames = await fs.promises.readdir(postsDirectory);

  return filenames.map((filename) => ({
    slug: filename.replace(/\.md$/, ''),
  }));
}



