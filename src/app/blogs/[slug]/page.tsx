import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getPostBySlug, getPosts } from "@/lib/wordpress/api";
import { extractFeaturedImage } from "@/lib/wordpress/utils";
import { Metadata } from "next";
import Newsletter from "@/components/blog/Newsletter";
import { ArrowLeft, Tag } from "lucide-react";

// Category configuration
const CATEGORIES = [
  { slug: "domestic", title: "Domestic Travel" },
  { slug: "international", title: "International Travel" },
  { slug: "qa", title: "Questions & Answers" },
];

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  const ogImage = extractFeaturedImage(post);
  return {
    title: `${post.title.rendered} - Budget Travel Packages`,
    description: post.excerpt.rendered.replace(/<[^>]+>/g, "").slice(0, 160),
    openGraph: {
      images: ogImage ? [ogImage] : [],
    },
  };
}

export async function generateStaticParams() {
  const { posts } = await getPosts(1, 10);
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const featuredImage = extractFeaturedImage(post);

  const author = post._embedded?.author?.[0];
  const authorAvatar = author?.avatar_urls
    ? Object.values(author.avatar_urls).pop()
    : null;
  const date = new Date(post.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <article className="container-box px-4 py-8 lg:py-12 max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/blogs" className="hover:text-primary transition-colors">
            Blogs
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium truncate max-w-[200px]">
            {post.slug}
          </span>
        </nav>

        {/* Header */}
        <header className="mb-8 lg:mb-12">
          <h1
            className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6 leading-tight"
            dangerouslySetInnerHTML={{ __html: post.title.rendered }}
          />

          <div className="flex items-center gap-4 text-sm text-gray-600 border-b border-gray-100 pb-6">
            <div className="flex items-center gap-2">
              {authorAvatar && (
                <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                  <Image
                    src={authorAvatar}
                    alt={author?.name || "Author"}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <span className="font-medium text-gray-900">
                By {author?.name || "Budget Travel Team"}
              </span>
            </div>
            <span>•</span>
            <time dateTime={post.date}>{date}</time>
            <span>•</span>
            <span className="bg-primary/10 text-primary-dark px-2 py-0.5 rounded text-xs font-bold">
              {post._embedded?.["wp:term"]?.[0]?.[0]?.name || "Travel"}
            </span>
          </div>
        </header>

        {/* Featured Image */}
        {featuredImage && (
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-10 shadow-lg">
            <Image
              src={featuredImage}
              alt={post.title.rendered}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
            />
          </div>
        )}

        {/* Content */}
        <div
          className="prose prose-lg md:prose-xl max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-primary prose-a:font-semibold hover:prose-a:text-primary-dark prose-img:rounded-xl prose-img:shadow-md"
          dangerouslySetInnerHTML={{ __html: post.content.rendered }}
        />

        {/* Article Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-100">
          <div className="space-y-8">
            {/* Categories */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Categories:
              </span>
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/blogs/category/${cat.slug}`}
                  className="text-sm font-medium text-gray-600 hover:text-secondary transition-colors"
                >
                  {cat.title}
                </Link>
              ))}
            </div>

            {/* Back Link */}
            <div>
              <Link
                href="/blogs"
                className="text-sm font-bold text-secondary hover:underline underline-offset-4"
              >
                ← Back to All Stories
              </Link>
            </div>
          </div>
        </footer>
      </article>

      <div className="mb-20">
        <Newsletter />
      </div>
    </>
  );
}
