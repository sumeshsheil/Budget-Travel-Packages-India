# WordPress Setup Guide for Blog

This guide tells you exactly what to configure in your WordPress dashboard to make the blog work with our Next.js frontend.

## 1. Create Categories

Go to **WordPress Admin → Posts → Categories** and create these 3 categories:

| Category Name | Slug            | Description                           |
| ------------- | --------------- | ------------------------------------- |
| Domestic      | `domestic`      | Blog posts about travel within India  |
| International | `international` | Blog posts about international travel |
| Q&A           | `qa`            | Travel questions & answers            |

> ⚠️ **Slug must match exactly** — `domestic`, `international`, `qa` (lowercase, no spaces).

## 2. Create Blog Posts

Go to **Posts → Add New** and for each post:

1. **Write the title and content** as usual
2. **Assign a category** — select Domestic, International, or Q&A from the right sidebar
3. **Set a Featured Image** — click "Set featured image" in the right sidebar and upload one
4. **Publish** the post

> 💡 **Tip:** Upload images directly to WordPress rather than using external URLs. This ensures `source_url` works correctly with Next.js.

## 3. Featured Post

To make a post appear as the "Featured" hero on the blog landing page:

1. Go to **Posts → All Posts**
2. Click **Quick Edit** on the post you want to feature
3. Check the **"Make this post sticky"** checkbox
4. Click **Update**

Only **1 post** should be sticky at any time.

## 4. Verify Categories Are Working

After creating categories and assigning posts, verify by visiting:

```
https://blog.budgettravelpackages.in/wp-json/wp/v2/categories
```

You should see your 3 categories listed with their IDs and slugs.

To verify posts per category:

```
https://blog.budgettravelpackages.in/wp-json/wp/v2/posts?_embed&categories={CATEGORY_ID}
```

## 5. Author Display Name

The blog shows the author name on each post. By default WordPress shows the email address. To fix:

1. Go to **Users → Your Profile**
2. Set a **Display Name** (e.g., "Sumesh Sheil" instead of "sumesh.sheil@gmail.com")
3. Click **Update Profile**

## 6. Recommended Post Counts

For the best visual layout, aim for:

- **Domestic:** At least 6 posts
- **International:** At least 6 posts
- **Q&A:** At least 3-6 posts
- **1 sticky/featured** post

## Quick Checklist

- [ ] Created "Domestic" category (slug: `domestic`)
- [ ] Created "International" category (slug: `international`)
- [ ] Created "Q&A" category (slug: `qa`)
- [ ] Assigned posts to categories
- [ ] Set featured images on all posts
- [ ] Made one post sticky for the featured hero
- [ ] Updated author display name
