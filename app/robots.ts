import type { MetadataRoute } from 'next';

const SITE_URL = 'https://www.clubdaputaria.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',

        allow: ['/', '/api/thumb/'],
        disallow: ['/backoffice-92/', '/api/', '/busca', '/embed/'],
      },

      { userAgent: 'GPTBot', disallow: '/' },
      { userAgent: 'ChatGPT-User', disallow: '/' },
      { userAgent: 'CCBot', disallow: '/' },
      { userAgent: 'Google-Extended', disallow: '/' },
      { userAgent: 'ClaudeBot', disallow: '/' },
      { userAgent: 'anthropic-ai', disallow: '/' },
      { userAgent: 'Bytespider', disallow: '/' },
      { userAgent: 'Amazonbot', disallow: '/' },
      { userAgent: 'Applebot-Extended', disallow: '/' },
      { userAgent: 'meta-externalagent', disallow: '/' },
    ],
    host: 'www.clubdaputaria.com',
    sitemap: `${SITE_URL}/sitemap-index.xml`,
  };
}
