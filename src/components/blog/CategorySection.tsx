import Link from "next/link";
import { ArrowRight } from "lucide-react";
import BlogCard from "./BlogCard";
import { Post } from "@/lib/wordpress/types";

interface CategorySectionProps {
  title: string;
  description: string;
  slug: string;
  posts: Post[];
  totalPosts: number;
  icon: string;
  accentColor: string; // e.g. "blue", "purple", "orange"
}

const accentMap: Record<
  string,
  { border: string; bg: string; text: string; button: string }
> = {
  blue: {
    border: "border-l-blue-600",
    bg: "bg-blue-50",
    text: "text-blue-600",
    button: "bg-blue-600 hover:bg-blue-700",
  },
  purple: {
    border: "border-l-purple-600",
    bg: "bg-purple-50",
    text: "text-purple-600",
    button: "bg-purple-600 hover:bg-purple-700",
  },
  orange: {
    border: "border-l-orange-500",
    bg: "bg-orange-50",
    text: "text-orange-600",
    button: "bg-orange-500 hover:bg-orange-600",
  },
};

export default function CategorySection({
  title,
  description,
  slug,
  posts,
  totalPosts,
  icon,
  accentColor,
}: CategorySectionProps) {
  const colors = accentMap[accentColor] || accentMap.blue;

  if (posts.length === 0) return null;

  return (
    <section className="py-10 md:py-14">
      <div className="container-box px-4">
        {/* Section Header */}
        <div className={`border-l-4 ${colors.border} pl-5 mb-8`}>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">{icon}</span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 font-open-sans">
              {title}
            </h2>
          </div>
          <p className="text-gray-600 text-sm md:text-base max-w-2xl font-open-sans leading-relaxed">
            {description}
          </p>
        </div>

        {/* Blog Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {posts.slice(0, 6).map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>

        {/* Show More Button */}
        {totalPosts > 6 && (
          <div className="mt-8 text-center">
            <Link
              href={`/travel-blogs/category/${slug}`}
              className={`inline-flex items-center gap-2 ${colors.button} text-white font-bold text-sm px-6 py-3 rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5`}
            >
              Show More {title}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
