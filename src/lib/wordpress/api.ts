"use server";

import { Post } from "./types";

const WP_API_URL = process.env.NEXT_PUBLIC_WP_URL
  ? `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/wp/v2`
  : "https://demo.wp-api.org/wp-json/wp/v2";

export async function getPosts(
  page = 1,
  perPage = 10,
): Promise<{ posts: Post[]; total: number }> {
  try {
    const response = await fetch(
      `${WP_API_URL}/posts?_embed&page=${page}&per_page=${perPage}&status=publish`,
      {
        next: { revalidate: 3600 },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch posts");
    }

    const posts = await response.json();
    const total = Number(response.headers.get("X-WP-Total") || 0);

    return { posts, total };
  } catch (error) {
    console.error("Error fetching posts:", error);
    return { posts: [], total: 0 };
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const response = await fetch(`${WP_API_URL}/posts?slug=${slug}&_embed`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch post: ${slug}`);
    }

    const posts = await response.json();
    return posts[0] || null;
  } catch (error) {
    console.error(`Error fetching post ${slug}:`, error);
    return null;
  }
}

export async function getFeaturedPosts(count = 3): Promise<Post[]> {
  try {
    const response = await fetch(
      `${WP_API_URL}/posts?_embed&per_page=${count}&sticky=true`,
      {
        next: { revalidate: 3600 },
      },
    );

    if (!response.ok) throw new Error("Failed to fetch featured posts");

    const stickyPosts = await response.json();

    // If not enough sticky posts, fill with regular
    if (stickyPosts.length < count) {
      const regularResponse = await fetch(
        `${WP_API_URL}/posts?_embed&per_page=${count - stickyPosts.length}&exclude=${stickyPosts.map((p: any) => p.id).join(",")}`,
        {
          next: { revalidate: 3600 },
        },
      );
      const regularPosts = await regularResponse.json();
      return [...stickyPosts, ...regularPosts];
    }

    return stickyPosts;
  } catch (error) {
    console.error("Error fetching featured posts:", error);
    return [];
  }
}

export async function getPostsByCategory(
  categorySlug: string,
  perPage = 6,
  page = 1,
): Promise<{ posts: Post[]; total: number }> {
  try {
    // First, get the category ID from the slug
    const catResponse = await fetch(
      `${WP_API_URL}/categories?slug=${categorySlug}`,
      { next: { revalidate: 3600 } },
    );

    if (!catResponse.ok) throw new Error(`Category not found: ${categorySlug}`);

    const categories = await catResponse.json();
    if (categories.length === 0) {
      return { posts: [], total: 0 };
    }

    const categoryId = categories[0].id;

    // Fetch posts for this category
    const response = await fetch(
      `${WP_API_URL}/posts?_embed&categories=${categoryId}&per_page=${perPage}&page=${page}&status=publish`,
      { next: { revalidate: 3600 } },
    );

    if (!response.ok) throw new Error("Failed to fetch category posts");

    const posts = await response.json();
    const total = Number(response.headers.get("X-WP-Total") || 0);

    return { posts, total };
  } catch (error) {
    console.error(`Error fetching posts for category ${categorySlug}:`, error);
    return { posts: [], total: 0 };
  }
}

export async function getCategories(): Promise<
  Array<{ id: number; name: string; slug: string; count: number }>
> {
  try {
    const response = await fetch(
      `${WP_API_URL}/categories?per_page=100&hide_empty=false`,
      { next: { revalidate: 3600 } },
    );

    if (!response.ok) throw new Error("Failed to fetch categories");

    return await response.json();
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export async function searchPosts(query: string, perPage = 5): Promise<Post[]> {
  try {
    const response = await fetch(
      `${WP_API_URL}/posts?_embed&search=${encodeURIComponent(query)}&per_page=${perPage}&status=publish`,
      { next: { revalidate: 3600 } },
    );

    if (!response.ok) throw new Error("Failed to search posts");

    return await response.json();
  } catch (error) {
    console.error(`Error searching posts for query "${query}":`, error);
    return [];
  }
}
