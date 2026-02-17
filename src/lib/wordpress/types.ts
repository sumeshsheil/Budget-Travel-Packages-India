export interface Post {
  id: number;
  date: string;
  slug: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
    protected: boolean;
  };
  excerpt: {
    rendered: string;
    protected: boolean;
  };
  featured_media: number;
  author: number;
  categories: number[];
  tags: number[];
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      // WordPress may return source_url as a string OR as an array [url, w, h, crop]
      // depending on how featured images were set up (especially with external images)
      source_url: string | any[];
      alt_text: string;
    }>;
    author?: Array<{
      id: number;
      name: string;
      description: string;
      avatar_urls: {
        [key: string]: string;
      };
    }>;
    "wp:term"?: Array<
      Array<{
        id: number;
        name: string;
        slug: string;
      }>
    >;
  };
}

export interface Category {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: "category";
  parent: number;
}
