"use server";

import { Post } from "./types";

const WP_API_URL = process.env.NEXT_PUBLIC_WP_URL
  ? `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/wp/v2`
  : "https://demo.wp-api.org/wp-json/wp/v2";

// ✅ TEST MODE: Set to false when connecting to real WordPress
const USE_MOCK_DATA = true;

const MOCK_POSTS: Post[] = [
  {
    id: 1,
    date: new Date().toISOString(),
    slug: "ultimate-bali-travel-guide-2024",
    title: {
      rendered:
        "The Ultimate Bali Travel Guide: Where to Go and What to See in 2024",
    },
    content: {
      rendered: `
            <p>Bali, often referred to as the "Island of the Gods," is a destination that truly has it all—from lush rainforests and ancient temples to world-class surfing and vibrant nightlife. Whether you're a spiritual seeker, an adrenaline junkie, or someone just looking to unwind on a pristine beach, Bali offers something special for everyone.</p>
            <h2>1. Ubud: The Heart of Culture</h2>
            <p>Nestled among rice paddies and steep ravines, Ubud is Bali's cultural capital. Don't miss the Sacred Monkey Forest Sanctuary or a morning stroll through the Tegalalang Rice Terrace.</p>
            <h2>2. Seminyak and Canggu: Coastal Cool</h2>
            <p>For those looking for trendy cafes, boutique shopping, and epic sunset views, these coastal towns are the place to be. Enjoy a day at a luxury beach club or catch some waves at Echo Beach.</p>
            <h2>3. Nusa Penida: Rugged Beauty</h2>
            <p>Take a day trip to Nusa Penida to see some of the most dramatic coastal scenery in the world, including the famous Kelingking Beach (often called T-Rex Bay).</p>
            `,
      protected: false,
    },
    excerpt: {
      rendered:
        "<p>Discover the best beaches, hidden temples, and cultural hotspots in our comprehensive 2024 Bali travel guide.</p>",
      protected: false,
    },
    featured_media: 0,
    author: 1,
    categories: [1],
    tags: [],
    _embedded: {
      "wp:featuredmedia": [
        {
          source_url:
            "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80",
          alt_text: "Ubud Bali Rice Terrace",
        },
      ],
      author: [
        {
          id: 1,
          name: "Sazzad Hossain",
          description: "Global Traveler & Writer",
          avatar_urls: {
            "96": "https://secure.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=96&d=mm&r=g",
          },
        },
      ],
      "wp:term": [[{ id: 1, name: "Destinations", slug: "destinations" }]],
    },
  },
  {
    id: 2,
    date: new Date(Date.now() - 172800000).toISOString(),
    slug: "10-essential-travel-packing-hacks",
    title: {
      rendered: "10 Essential Packing Hacks Every Traveler Should Know",
    },
    content: {
      rendered: `
            <p>Packing for a trip can be one of the most stressful parts of travel. We've all been there—overpacking "just in case" items only to realize we didn't use half of them. Here are 10 hacks to help you pack lighter, smarter, and faster.</p>
            <h2>1. Use Packing Cubes</h2>
            <p>If you aren't using packing cubes yet, you're missing out. They help organize your clothes by type (shirts, socks, underwear) and maximize the space in your suitcase.</p>
            <h2>2. Roll, Don't Fold</h2>
            <p>Rolling your clothes instead of folding them not only saves space but also reduces wrinkles. It's a game-changer for fitting more into a carry-on.</p>
            <h2>3. Wear Your Heaviest Items</h2>
            <p>Save weight in your suitcase by wearing your boots, coats, and heaviest jeans on the plane. You can always take them off once you're on board.</p>
            `,
      protected: false,
    },
    excerpt: {
      rendered:
        "<p>Master the art of packing with these clever hacks designed to save space and reduce travel stress.</p>",
      protected: false,
    },
    featured_media: 0,
    author: 2,
    categories: [2],
    tags: [],
    _embedded: {
      "wp:featuredmedia": [
        {
          source_url:
            "https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=800&q=80",
          alt_text: "Travel Packing Kit",
        },
      ],
      author: [
        {
          id: 2,
          name: "Emily Chen",
          description: "Organization Expert",
          avatar_urls: {
            "96": "https://secure.gravatar.com/avatar/3b3d5b78b598b9e6027ab5789ae64082?s=96&d=mm&r=g",
          },
        },
      ],
      "wp:term": [[{ id: 2, name: "Travel Tips", slug: "tips" }]],
    },
  },
  {
    id: 3,
    date: new Date(Date.now() - 345600000).toISOString(),
    slug: "best-street-food-bangkok-guide",
    title: { rendered: "A Foodie's Paradise: The Best Street Food in Bangkok" },
    content: {
      rendered: `
            <p>Bangkok is widely considered the street food capital of the world. The city's bustling streets are lined with vendors serving up incredible flavors at unbelievably low prices. Here's your guide to eating like a local in Bangkok.</p>
            <h2>1. Yaowarat Road (Chinatown)</h2>
            <p>At night, Yaowarat Road transforms into one of the world's greatest food streets. Try the toasted buns, seafood, and the famous rolled rice noodles.</p>
            <h2>2. Mango Sticky Rice</h2>
            <p>You can't leave Thailand without trying this iconic dessert. Sweet, ripe mangoes served with coconut milk-infused sticky rice—a perfect treat to beat the heat.</p>
            <h2>3. Pad Thai from the Cart</h2>
            <p>While available in fancy restaurants, the best Pad Thai is often found at a humble street cart where the chef has been perfecting their recipe for decades.</p>
            `,
      protected: false,
    },
    excerpt: {
      rendered:
        "<p>From bustling night markets to hidden alleyway gems, explore the world-renowned street food scene of Bangkok.</p>",
      protected: false,
    },
    featured_media: 0,
    author: 3,
    categories: [3],
    tags: [],
    _embedded: {
      "wp:featuredmedia": [
        {
          source_url:
            "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80",
          alt_text: "Bangkok Night Market Street Food",
        },
      ],
      author: [
        {
          id: 3,
          name: "Marcus Wong",
          description: "Culinary Explorer",
          avatar_urls: {
            "96": "https://secure.gravatar.com/avatar/785055b863773ed862d9878a2e128183?s=96&d=mm&r=g",
          },
        },
      ],
      "wp:term": [[{ id: 3, name: "Food & Drink", slug: "food" }]],
    },
  },
  {
    id: 4,
    date: new Date(Date.now() - 518400000).toISOString(),
    slug: "travel-europe-under-50-dollars-day",
    title: { rendered: "How to Travel Europe for Under $50 a Day" },
    content: {
      rendered: `
            <p>Traveling through Europe on a budget is not only possible but can lead to much more authentic experiences. By venturing beyond the tourist traps, you can discover incredible history and culture without spending a fortune.</p>
            <h2>1. Head East</h2>
            <p>Countries in Central and Eastern Europe like Poland, Hungary, and Romania offer incredible value. You can find high-quality meals and accommodation for a fraction of the price of cities like London or Paris.</p>
            <h2>2. Use Budget Airlines Carefully</h2>
            <p>Europe's budget airlines (like Ryanair and EasyJet) can get you between countries for as little as $15 if you book in advance and travel with only a carry-on.</p>
            <h2>3. Take the Night Train</h2>
            <p>Save on a night's accommodation by taking a sleeper train between major cities. It's a classic European experience and helps your budget go further.</p>
            `,
      protected: false,
    },
    excerpt: {
      rendered:
        "<p>Learn practical strategies for exploring the diverse cultures of Europe while keeping your daily spend low.</p>",
      protected: false,
    },
    featured_media: 0,
    author: 1,
    categories: [4],
    tags: [],
    _embedded: {
      "wp:featuredmedia": [
        {
          source_url:
            "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=800&q=80",
          alt_text: "Prague Old Town Square",
        },
      ],
      author: [
        {
          id: 1,
          name: "Sazzad Hossain",
          description: "Budget Travel Specialist",
          avatar_urls: {
            "96": "https://secure.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=96&d=mm&r=g",
          },
        },
      ],
      "wp:term": [[{ id: 4, name: "Budget Travel", slug: "budget" }]],
    },
  },
  {
    id: 5,
    date: new Date(Date.now() - 691200000).toISOString(),
    slug: "hiking-the-swiss-alps-adventure",
    title: {
      rendered:
        "Adventure Awaits: Hiking the Most Scenic Trails in the Swiss Alps",
    },
    content: {
      rendered: `
            <p>There is nothing quite like the crisp mountain air and soaring peaks of the Swiss Alps. For hikers, this is arguably the finest destination on the planet, with trails that cater to everyone from casual walkers to seasoned peak-baggers.</p>
            <h2>1. The Lauterbrunnen Valley</h2>
            <p>Often called the "Valley of 72 Waterfalls," this area is the quintessential Swiss mountain experience. Hike from Lauterbrunnen to Mürren for incredible views of the Eiger, Mönch, and Jungfrau peaks.</p>
            <h2>2. Zermatt and the Matterhorn</h2>
            <p>No trip to the Alps is complete without seeing the iconic Matterhorn. Take the Gornergrat railway up and hike back down past Riffelsee lake for the perfect mountain reflection photo.</p>
            <h2>3. Safety First</h2>
            <p>Always check mountain weather forecasts before heading out. Alpine weather can change in minutes, even in mid-summer.</p>
            `,
      protected: false,
    },
    excerpt: {
      rendered:
        "<p>Breathtaking mountain vistas and world-class trails wait for you in our guide to hiking the Swiss Alps.</p>",
      protected: false,
    },
    featured_media: 0,
    author: 4,
    categories: [5],
    tags: [],
    _embedded: {
      "wp:featuredmedia": [
        {
          source_url:
            "https://images.unsplash.com/photo-1531219432768-9f540ce91ef3?auto=format&fit=crop&w=800&q=80",
          alt_text: "Swiss Alps Mountain Range",
        },
      ],
      author: [
        {
          id: 4,
          name: "Alex Berg",
          description: "Adventure Guide",
          avatar_urls: {
            "96": "https://secure.gravatar.com/avatar/983375c8d087799d6d3390c9b0e25866?s=96&d=mm&r=g",
          },
        },
      ],
      "wp:term": [[{ id: 5, name: "Adventure", slug: "adventure" }]],
    },
  },
];

export async function getPosts(
  page = 1,
  perPage = 10,
): Promise<{ posts: Post[]; total: number }> {
  if (USE_MOCK_DATA) {
    return { posts: MOCK_POSTS, total: MOCK_POSTS.length };
  }
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
  if (USE_MOCK_DATA) {
    return MOCK_POSTS.find((p) => p.slug === slug) || null;
  }
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
  if (USE_MOCK_DATA) {
    return MOCK_POSTS.slice(0, count);
  }
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
