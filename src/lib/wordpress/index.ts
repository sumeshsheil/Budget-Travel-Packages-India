export {
  getPosts,
  getPostBySlug,
  getFeaturedPosts,
  getPostsByCategory,
  getCategories,
  searchPosts,
} from "./api";
export type { Post, Category } from "./types";
export { extractFeaturedImage } from "./utils";
