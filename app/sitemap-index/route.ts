import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

const BASE_URL = 'https://www.xvideosprime.com';
const VIDEOS_PER_SITEMAP = 1000;

export async function GET() {
    try {
        const totalVideos = await db.video.count({
            where: { status: 'PUBLISHED' },
        });

        const totalVideoPages = Math.max(1, Math.ceil(totalVideos / VIDEOS_PER_SITEMAP));
        const now = new Date().toISOString();

        const fixedSitemaps = [
            { url: `${BASE_URL}/sitemap-pages.xml` },
            { url: `${BASE_URL}/sitemap-modelos.xml` },
            { url: `${BASE_URL}/sitemap-categorias.xml` },
            { url: `${BASE_URL}/sitemap-tags.xml` },
        ];

        const videoSitemaps = Array.from({ length: totalVideoPages }, (_, i) => ({
            url: `${BASE_URL}/sitemap-videos/${i}`,
        }));

        const allSitemaps = [...fixedSitemaps, ...videoSitemaps];

        const sitemapEntries = allSitemaps
            .map(
                (s) => `
  <sitemap>
    <loc>${s.url}</loc>
    <lastmod>${now}</lastmod>
  </sitemap>`
            )
            .join('');

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries}
</sitemapindex>`;

        return new NextResponse(xml, {
            headers: {
                'Content-Type': 'application/xml; charset=utf-8',
                'Cache-Control': 'public, max-age=300, s-maxage=300, must-revalidate',
                'X-Total-Sitemaps': allSitemaps.length.toString(),
                'X-Total-Videos': totalVideos.toString(),
            },
        });
    } catch (error) {
        console.error('[Sitemap Index] Erro:', error);

        const fallbackXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${BASE_URL}/sitemap-pages.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>
</sitemapindex>`;

        return new NextResponse(fallbackXml, {
            headers: {
                'Content-Type': 'application/xml; charset=utf-8',
                'Cache-Control': 'public, max-age=300',
            },
        });
    }
}
