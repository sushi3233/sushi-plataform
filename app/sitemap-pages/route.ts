import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

const BASE_URL = 'https://www.clubdaputaria.com';
const ITEMS_PER_PAGE = 20;

const staticPages = [
  { url: BASE_URL, changefreq: 'daily', priority: '1.0' },
  { url: `${BASE_URL}/recentes`, changefreq: 'daily', priority: '0.9' },
  { url: `${BASE_URL}/mais-vistos`, changefreq: 'daily', priority: '0.9' },
  { url: `${BASE_URL}/bombando`, changefreq: 'daily', priority: '0.9' },
];

export async function GET() {
  try {
    const totalVideos = await db.video.count({
      where: { status: 'PUBLISHED' },
    });

    const totalPages = Math.max(1, Math.ceil(totalVideos / ITEMS_PER_PAGE));
    const now = new Date().toISOString();

    const paginatedPages = Array.from({ length: Math.max(0, totalPages - 1) }, (_, index) => {
      const page = index + 2;
      return [
        { url: `${BASE_URL}/page/${page}`, changefreq: 'daily', priority: '0.8' },
        { url: `${BASE_URL}/recentes/page/${page}`, changefreq: 'daily', priority: '0.8' },
        { url: `${BASE_URL}/mais-vistos/page/${page}`, changefreq: 'daily', priority: '0.8' },
      ];
    }).flat();

    const allPages = [...staticPages, ...paginatedPages];

    const urls = allPages
      .map(
        (page) => `
  <url>
    <loc>${page.url}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
      )
      .join('');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=300, s-maxage=300, must-revalidate',
        'X-Total-Pages': allPages.length.toString(),
      },
    });
  } catch (error) {
    console.error('[Sitemap Pages] Erro:', error);

    const now = new Date().toISOString();
    const urls = staticPages
      .map(
        (page) => `
  <url>
    <loc>${page.url}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
      )
      .join('');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=300, s-maxage=300',
      },
    });
  }
}
