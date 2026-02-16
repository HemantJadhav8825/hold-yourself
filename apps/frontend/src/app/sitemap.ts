import type { MetadataRoute } from 'next'

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  'https://webelong.world'

export default function sitemap(): MetadataRoute.Sitemap {

  const now = new Date()

  return [

    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1,
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

  ]
}
