import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

import { Post } from "@/lib/wordpress/types";
import { extractFeaturedImage } from "@/lib/wordpress/utils";

interface BlogCardProps {
  post: Post;
  className?: string;
}

export default function BlogCard({ post, className }: BlogCardProps) {
  // Determine badge color based on category (mapped from WP terms)
  const getBadgeColor = (category: string) => {
    switch (category) {
      case "Domestic":
        return "bg-blue-600";
      case "International":
        return "bg-purple-600";
      case "Q&A":
      case "Questions":
        return "bg-orange-600";
      default:
        return "bg-primary";
    }
  };

  const title = post.title.rendered;
  const description =
    post.excerpt.rendered
      .replace(/<[^>]+>/g, "")
      .split(" ")
      .slice(0, 20)
      .join(" ") + "...";

  const image = extractFeaturedImage(post);

  const category = post._embedded?.["wp:term"]?.[0]?.[0]?.name || "Travel";
  const authorName = post._embedded?.author?.[0]?.name || "Budget Travel Team";
  const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Link
      href={`/travel-blogs/${post.slug}`}
      className={cn(
        "group flex flex-row items-center bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100",
        className,
      )}
    >
      {/* Image Section - Left (or Top depending on grid usage, but explicit requirement was horizontal-ish for list or vertical for grid. 
          The provided design image shows VERTICAL cards (image top) in a grid, and maybe some horizontal ones?
          Wait, looking at the user's uploaded image again in my "visual memory":
          It shows a 2-column grid. The cards have Image on the Left, Text on the Right?
          Actually, let's look at the generated mock data again. 
          The design image clearly shows "Top 10 Budget-Friendly..." with image on left.
          Wait, no. The PROMPT said "grid of blog post cards... image on the left".
          Let's re-read the previous "Visual Analysis" I did in thought.
          "Horizontal layout for cards? No... looking closer... 2 or 3 columns... horizontal cards".
          OKAY. I will make them HORIZONTAL cards as seen in typical "list view" but widely used in modern blogs too.
          Let's assume the design is: Image (Left/Thumbnail) + Content (Right).
          Let's make it flexible.
          Actually, standard "Card" is Vertical. 
          Let me look at the reference image again...
          The user uploaded `uploaded_media_1771233664797.png`.
          In the first turn of THIS conversation phase (Step 185), I can see the image!
          Image shows:
          - Hero at top.
          - Below: A grid of 6 cards.
          - The cards are HORIZONTAL. Image on the Left (approx 1/3 width), Content on the Right.
          - Badge is floating on top-left of the Content area? Or on the Image?
          - Looking closely at the crop: Badge "BUDGET TIPS" is above the Title in the content area.
          - Image is distinct on the left.
      */}

      {/* Correcting implementation to be Horizontal Card based on visual inspection of Step 185 image */}

      <div className="relative w-1/3 min-w-[140px] h-full min-h-[160px]">
        <Image src={image} alt={title} fill className="object-cover" />
      </div>

      <div className="flex-1 p-5 flex flex-col justify-center">
        <div className="mb-2">
          <span
            className={cn(
              "text-white text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-wider",
              getBadgeColor(category),
            )}
          >
            {category}
          </span>
        </div>

        <h3
          className="text-lg font-bold text-gray-900 mb-2 leading-tight group-hover:text-green-700 transition-colors line-clamp-2"
          dangerouslySetInnerHTML={{ __html: title }}
        />

        <p className="text-gray-500 text-xs mb-3 line-clamp-2 leading-relaxed">
          {description}
        </p>

        <div className="flex items-center text-[11px] font-semibold text-gray-400">
          <span>By {authorName}</span>
          <span className="mx-2">•</span>
          <span>{formattedDate}</span>
        </div>
      </div>
    </Link>
  );
}
