import { MetadataRoute } from "next";
import { getPosts } from "@/lib/wordpress"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://budgettravelpackages.in";

  // Static routes
  const routes = [
    "",
    "/about",
    "/contact",
    "/travel-blogs",
    "/privacy-policy",
    "/terms-and-conditions",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  // Dynamic blog posts
  const { posts } = await getPosts();
  const blogRoutes = posts.map((post: any) => ({
    url: `${baseUrl}/travel-blogs/${post.slug}`,
    lastModified: new Date(post.date).toISOString(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...routes, ...blogRoutes];
}
