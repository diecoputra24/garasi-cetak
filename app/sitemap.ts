import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://garasicetak.com';

  const staticPages = [
    '',
    '/invitation/soft-floral-pink',
    '/invitation/blue-modern-floral',
    '/invitation/modern-floral-red',
    '/invitation/biru-muda-floral',
  ];

  return staticPages.map((page) => ({
    url: `${baseUrl}${page}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: page === '' ? 1 : 0.8,
  }));
}
