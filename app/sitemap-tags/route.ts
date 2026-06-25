import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

const BASE_URL = 'https://www.xvideosprime.com';

const MAX_TAGS = 5000;

export async function GET() {
    try {
        const tags = await db.tag.findMany({
            where: {
                videos: {
                    some: {
                        status: 'PUBLISHED',
                    },
                },
            },
            take: MAX_TAGS,
            orderBy: {
                videos: {
                    _count: 'desc',
                },
            },
            select: {
                slug: true,
                createdAt: true,
                _count: {
                    select: { videos: true },
                },
            },
        });

        const urls = tags
            .map((tag) => {

                const videosCount = tag._count.videos;
                const priority =
                    videosCount >= 50
                        ? '0.8'
                        : videosCount >= 20
                            ? '0.7'
                            : videosCount >= 5
                                ? '0.6'
                                : '0.5';

                return `
  <url>
    <loc>${BASE_URL}/xxx/${tag.slug}</loc>
    <lastmod>${tag.createdAt.toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`;
            })
            .join('');

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

        return new NextResponse(xml, {
            headers: {
                'Content-Type': 'application/xml; charset=utf-8',
                'Cache-Control': 'public, max-age=3600, s-maxage=3600',
                'X-Tags-Count': tags.length.toString(),
            },
        });
    } catch (error) {
        console.error('[Sitemap Tags] Erro:', error);
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
