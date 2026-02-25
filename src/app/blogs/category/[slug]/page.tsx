import { notFound } from "next/navigation";
import BlogCard from "@/components/blog/BlogCard";
import Link from "next/link";
import { getPostsByCategory } from "@/lib/wordpress/api";
import { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const CATEGORY_INFO: Record<
  string,
  { title: string; description: string; icon: string }
> = {
  domestic: {
    title: "Domestic Travel",
    description:
      "Explore the best domestic travel packages across India — from serene hill stations to vibrant coastal towns.",
    icon: "🏠",
  },
  international: {
    title: "International Travel",
    description:
      "Discover affordable international destinations with curated guides, visa tips, and budget-friendly itineraries.",
    icon: "🌍",
  },
  "travel-insights": {
    title: "Travel Insights",
    description:
      "Get expert travel tips, guides, and insights to make your next budget-friendly trip a breeze.",
    icon: "✨",
  },
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const info = CATEGORY_INFO[slug];

  return {
    title: info ? `${info.title} - Blogs` : "Category - Blogs",
    description: info?.description || "Browse travel blog posts by category.",
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const info = CATEGORY_INFO[slug];

  if (!info) {
    notFound();
  }

  const { posts, total } = await getPostsByCategory(slug, 50);

  return (
    <div className="bg-white min-h-screen">
      {/* Category Header */}
      <section className="bg-gray-50 py-12 md:py-16 border-b border-gray-100">
        <div className="container-box px-4">
          {/* Breadcrumb */}
          <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2 font-open-sans">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link
              href="/blogs"
              className="hover:text-primary transition-colors"
            >
              Blogs
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{info.title}</span>
          </nav>

          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">{info.icon}</span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 font-open-sans">
              {info.title}
            </h1>
          </div>
          <p className="text-gray-600 text-base md:text-lg max-w-2xl font-open-sans leading-relaxed">
            {info.description}
          </p>
          <p className="text-sm text-gray-400 mt-3 font-open-sans">
            {total} {total === 1 ? "article" : "articles"} found
          </p>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-12 md:py-16">
        <div className="container-box px-4">
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {posts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-xl font-bold text-gray-900">
                No posts in this category yet.
              </p>
              <p className="text-gray-500 mt-2">
                Check back later — we&apos;re adding new content soon!
              </p>
              <Link
                href="/blogs"
                className="inline-flex items-center gap-2 mt-6 bg-primary text-white font-bold text-sm px-6 py-3 rounded-xl transition-all shadow-md hover:shadow-lg"
              >
                ← Back to All Blogs
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
