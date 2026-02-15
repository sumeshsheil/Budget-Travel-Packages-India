import Link from "next/link";
import Image from "next/image";
import { getPosts, getFeaturedPosts } from "@/lib/wordpress/api";
import { Post } from "@/lib/wordpress/types";

export const metadata = {
  title: "Travel Blogs - Budget Travel Packages",
  description: "Explore our latest travel tips, guides, and stories.",
};

export default async function TravelBlogsPage() {
  const { posts } = await getPosts(1, 10);
  const featuredPosts = await getFeaturedPosts(3);

  // Helper to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <>
      {/* Decorative Header Background */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-linear-to-b from-primary/5 to-transparent pointer-events-none -z-10" />

      <div className="container-box px-4 pt-4 lg:pt-8">
        {/* Page Header */}
        <section className="mb-16 text-center relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[url('/images/grid.svg')] opacity-[0.03] pointer-events-none" />
          <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary-dark text-sm font-bold tracking-wide mb-4">
            EXPLORE THE WORLD
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-inter text-gray-900 mb-6 tracking-tight">
            Travel{" "}
            <span className="text-primary relative inline-block">
              Stories
              <svg
                className="absolute w-full h-3 -bottom-1 left-0 text-primary/30"
                viewBox="0 0 100 10"
                preserveAspectRatio="none"
              >
                <path
                  d="M0 5 Q 50 10 100 5"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                />
              </svg>
            </span>{" "}
            & Guides
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed">
            Discover hidden gems, expert tips, and inspiring itineraries for
            your next adventure.
          </p>
        </section>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <section className="mb-20">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl md:text-3xl font-bold font-inter text-gray-900 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-secondary rounded-full"></span>
                Featured Stories
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredPosts.map((post) => (
                <FeaturedCard
                  key={post.id}
                  post={post}
                  formatDate={formatDate}
                />
              ))}
            </div>
          </section>
        )}

        {/* Latest Posts */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold font-inter text-gray-900 flex items-center gap-3">
              <span className="w-1.5 h-8 bg-primary rounded-full"></span>
              Latest Articles
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} formatDate={formatDate} />
            ))}
          </div>

          {posts.length === 0 && (
            <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-gray-200">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                📝
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                No posts found
              </h3>
              <p className="text-gray-500">
                Please check back later for new updates.
              </p>
            </div>
          )}
        </section>
      </div>
    </>
  );
}

function FeaturedCard({
  post,
  formatDate,
}: {
  post: Post;
  formatDate: (d: string) => string;
}) {
  const imageUrl =
    post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
    "/images/placeholders/blog-placeholder.jpg";
  const authorName = post._embedded?.author?.[0]?.name || "Budget Travel";
  const categories = post._embedded?.["wp:term"]?.[0]; // Categories

  return (
    <Link href={`/travel-blogs/${post.slug}`} className="group block h-full">
      <article className="relative h-full flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 group-hover:-translate-y-1">
        <div className="relative h-64 w-full overflow-hidden">
          <Image
            src={imageUrl}
            alt={post.title.rendered}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

          <div className="absolute top-4 left-4 flex gap-2">
            <span className="bg-white/90 backdrop-blur-sm text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
              Featured
            </span>
            {categories && categories[0] && (
              <span className="bg-primary/90 backdrop-blur-sm text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                {categories[0].name}
              </span>
            )}
          </div>
        </div>
        <div className="p-6 flex flex-col flex-1 relative">
          <div className="flex items-center gap-3 text-xs font-semibold text-gray-500 mb-4 uppercase tracking-wide">
            <span className="flex items-center gap-1">
              🗓 {formatDate(post.date)}
            </span>
            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
            <span>✍️ {authorName}</span>
          </div>

          <h3
            className="text-xl font-extrabold text-gray-900 mb-3 leading-tight group-hover:text-primary transition-colors line-clamp-2"
            dangerouslySetInnerHTML={{ __html: post.title.rendered }}
          />

          <div
            className="text-gray-600 text-sm line-clamp-3 mb-6 flex-1 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
          />

          <div className="flex items-center text-secondary font-bold text-sm group/btn">
            <span className="border-b-2 border-secondary/20 group-hover/btn:border-secondary transition-colors pb-0.5">
              Read Full Story
            </span>
            <svg
              className="w-4 h-4 ml-2 transform group-hover/btn:translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </div>
        </div>
      </article>
    </Link>
  );
}

function BlogCard({
  post,
  formatDate,
}: {
  post: Post;
  formatDate: (d: string) => string;
}) {
  const imageUrl =
    post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
    "/images/placeholders/blog-placeholder.jpg";
  const authorName = post._embedded?.author?.[0]?.name || "Budget Travel";
  const categories = post._embedded?.["wp:term"]?.[0]; // Categories

  return (
    <Link href={`/travel-blogs/${post.slug}`} className="group block">
      <article className="flex flex-col h-full bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group-hover:-translate-y-1">
        <div className="relative h-52 w-full overflow-hidden bg-gray-100">
          <Image
            src={imageUrl}
            alt={post.title.rendered}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {categories && categories[0] && (
            <div className="absolute top-3 left-3">
              <span className="bg-white/95 backdrop-blur-md text-gray-800 text-[10px] font-bold px-2.5 py-1 rounded-md shadow-sm uppercase tracking-wider">
                {categories[0].name}
              </span>
            </div>
          )}
        </div>

        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
            <span className="font-medium text-primary-dark bg-primary/5 px-2 py-0.5 rounded">
              {formatDate(post.date)}
            </span>
          </div>

          <h3
            className="text-lg font-bold text-gray-900 mb-3 leading-snug group-hover:text-primary transition-colors line-clamp-2"
            dangerouslySetInnerHTML={{ __html: post.title.rendered }}
          />

          <div
            className="text-gray-600 text-sm line-clamp-2 mb-4 flex-1 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
          />

          <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500">
                {authorName.charAt(0)}
              </div>
              <span className="text-xs font-semibold text-gray-500">
                {authorName}
              </span>
            </div>
            <span className="text-primary font-bold text-xs flex items-center gap-1 group-hover:underline">
              Read more
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
