import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

const BASE_URL = 'https://www.xvideosprime.com';

export async function GET() {
    try {
        const models = await db.model.findMany({
            where: {
                videos: {
                    some: {
                        status: 'PUBLISHED',
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
            select: {
                slug: true,
                createdAt: true,
            },
        });

        const urls = models
            .map(
                (model) => `
  <url>
    <loc>${BASE_URL}/modelo/${model.slug}</loc>
    <lastmod>${model.createdAt.toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
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
                'Cache-Control': 'public, max-age=3600, s-maxage=3600',
                'X-Models-Count': models.length.toString(),
            },
        });
    } catch (error) {
        console.error('[Sitemap Modelos] Erro:', error);
        return new NextResponse(
            `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>`,
            {
                headers: {
                    'Content-Type': 'application/xml; charset=utf-8',
                    'Cache-Control': 'public, max-age=300',
                },
            }
        );
    }
}
