import Link from 'next/link';

export default function Blog() {
  return (
    <div className="container py-12">
      <h2 className="text-4xl font-bold text-center text-primary-color mb-8">Our Blog & Resources</h2>
      <p className="text-center text-lg text-gray-700 dark:text-gray-300 mb-12">
        Stay updated with the latest trends, insights, and tips in web development, SEO, UI/UX, and digital marketing.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Example Blog Post Link */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <img src="https://via.placeholder.com/400x250?text=SEO+Basics" alt="SEO Basics" className="w-full h-48 object-cover" />
          <div className="p-6">
            <h4 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Understanding SEO Basics</h4>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">Published on August 17, 2025</p>
            <p className="text-gray-700 dark:text-gray-300 mb-4">Dive into the fundamentals of Search Engine Optimization and learn how to make your website more visible to your target audience...</p>
            <Link href="/blog/understanding-seo-basics" className="text-primary-color hover:underline font-semibold">
              Read More
            </Link>
          </div>
        </div>

        {/* Add more blog post previews here */}

      </div>
    </div>
  );
}
