import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://www.databistro.eu',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: 'https://www.databistro.eu/posts/rentcalc',
      lastModified: new Date('2024-07-21'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://www.databistro.eu/posts/airqualitysk',
      lastModified: new Date('2024-04-18'),
      changeFrequency: 'yearly',
      priority: 0.8,
    },
    {
      url: 'https://www.databistro.eu/posts/demography',
      lastModified: new Date('2024-04-05'),
      changeFrequency: 'yearly',
      priority: 0.8,
    },
    {
      url: 'https://www.databistro.eu/posts/telcosk',
      lastModified: new Date('2024-04-16'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];
}