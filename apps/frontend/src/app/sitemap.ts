import type { MetadataRoute } from 'next'

import { emotions } from '@/lib/emotions'

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  'https://webelong.world'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {

  const now = new Date()

  const emotionRoutes: MetadataRoute.Sitemap = emotions.map((e) => ({
    url: `${BASE_URL}/i-feel-${e.emotion}`,
    lastModified: new Date(e.lastReviewed),
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  let shareRoutes: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/shares?limit=100`, {
      cache: 'no-store'
    });
    if (res.ok) {
      const shares = await res.json();
      shareRoutes = shares
        .filter((s: any) => s.visibility === 'public')
        .map((s: any) => ({
          url: `${BASE_URL}/holding-space/post/${s.id}`,
          lastModified: new Date(s.createdAt),
          changeFrequency: 'weekly',
          priority: 0.6,
        }));
    }
  } catch (error) {
    console.error('Sitemap share fetch error:', error);
  }

  return [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1,
    },
    ...emotionRoutes,
    ...shareRoutes,
    {
      url: `${BASE_URL}/emotions`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },

    {
      url: `${BASE_URL}/guidelines`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },

    {
      url: `${BASE_URL}/privacy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.4,
    },

    {
      url: `${BASE_URL}/sanctuary`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },

    {
      url: `${BASE_URL}/holding-space`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },

    {
      url: `${BASE_URL}/belong`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },

    {
      url: `${BASE_URL}/feeling-alone`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/emotion-sitemap.xml`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.5,
    },
  ]
}
