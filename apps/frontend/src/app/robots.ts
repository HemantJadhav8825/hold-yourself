import type { MetadataRoute } from 'next'

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  'https://webelong.world'

export default function robots(): MetadataRoute.Robots {

  return {

    rules: [

      {
        userAgent: '*',

        allow: [
          '/',
          '/about',
          '/guidelines',
          '/privacy',
        ],

        disallow: [

          '/api/',

          '/auth',
          '/login',
          '/signup',

          '/sanctuary',
          '/holding-space',
          '/circles',

          '/chat',

          '/dashboard',
          '/profile',
          '/settings',

          '/onboarding',

        ],

      },

    ],

    sitemap: `${BASE_URL}/sitemap.xml`,

    host: BASE_URL,

  }

}
