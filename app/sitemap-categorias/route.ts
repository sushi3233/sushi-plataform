import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

const BASE_URL = 'https://www.xvideosprime.com';

export async function GET() {
    try {
        const categories = await db.category.findMany({
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

        const urls = categories
            .map(
                (category) => `
  <url>
    <loc>${BASE_URL}/videos/${category.slug}</loc>
    <lastmod>${category.createdAt.toISOString()}</lastmod>
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
                'X-Categories-Count': categories.length.toString(),
            },
        });
    } catch (error) {
        console.error('[Sitemap Categorias] Erro:', error);
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
