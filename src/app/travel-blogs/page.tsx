import FeaturedHero from "@/components/blog/FeaturedHero";
import BlogCard from "@/components/blog/BlogCard";
import blogsData from "@/data/blogs.json";

export const metadata = {
  title: "Travel Blogs - Budget Travel Packages",
  description: "Explore our latest travel tips, guides, and stories.",
};

export default function TravelBlogsPage() {
  // Use the first blog as featured (mock logic)
  const featuredPost = blogsData[0];
  // Use the rest as grid items
  const gridPosts = blogsData.slice(1);

  return (
    <>
      {/* Featured Hero Section */}
      <FeaturedHero post={featuredPost} />

      {/* Blog Grid Section */}
      <div className="container-box px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {gridPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </>
  );
}
