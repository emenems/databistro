import { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/posts';
import { SITE_URL } from '@/lib/constants';

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const lastUpdate = posts
    .map((post) => post.updated ?? post.date)
    .sort()
    .at(-1);

  return [
    {
      url: SITE_URL,
      lastModified: lastUpdate ? new Date(lastUpdate) : new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    ...posts.map((post) => ({
      url: `${SITE_URL}/posts/${post.slug}`,
      lastModified: new Date(post.updated ?? post.date),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ];
}
