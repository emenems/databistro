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
    {
      url: 'https://www.databistro.eu/posts/olympics',
      lastModified: new Date('2024-08-08'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://www.databistro.eu/posts/trashboard',
      lastModified: new Date('2024-10-20'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://www.databistro.eu/posts/parliament2024',
      lastModified: new Date('2024-12-30'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://www.databistro.eu/posts/ginicalc',
      lastModified: new Date('2025-01-06'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://www.databistro.eu/posts/elektromobilita',
      lastModified: new Date('2025-02-16'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://www.databistro.eu/posts/krimianalytika',
      lastModified: new Date('2025-02-22'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://www.databistro.eu/posts/alcotax',
      lastModified: new Date('2025-06-06'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];
}