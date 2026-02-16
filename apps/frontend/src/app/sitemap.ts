import type { MetadataRoute } from 'next'

import { emotions } from '@/lib/emotions'

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  'https://webelong.world'

export default function sitemap(): MetadataRoute.Sitemap {

  const now = new Date()

  const emotionRoutes: MetadataRoute.Sitemap = emotions.map((emotion) => ({
    url: `${BASE_URL}/i-feel-${emotion}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  return [

    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1,
    },
    ...emotionRoutes,
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

  ]
}
