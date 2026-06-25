import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

const BASE_URL = 'https://www.xvideosprime.com';
const PAGE_SIZE = 1000;

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ page: string }> }
) {
    try {
        const { page: pageParam } = await params;
        const page = parseInt(pageParam, 10);

        if (isNaN(page) || page < 0) {
            return new NextResponse('Página inválida', { status: 400 });
        }

        const videos = await db.video.findMany({
            where: { status: 'PUBLISHED' },
            orderBy: { publishedAt: { sort: 'desc', nulls: 'last' } },
            skip: page * PAGE_SIZE,
            take: PAGE_SIZE,
            select: {
                slug: true,
                metaTitle: true,
                metaDescription: true,
                duration: true,
                views: true,
                publishedAt: true,
                updatedAt: true,
                thumbnail: { select: { url: true } },
                embed: { select: { iframeUrl: true, sourcePlatform: true, sourceId: true } },
                tags: { select: { name: true } },
                categories: { select: { name: true } },
            },
        });

        if (videos.length === 0) {
            return new NextResponse(
                `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"></urlset>`,
                {
                    headers: {
                        'Content-Type': 'application/xml; charset=utf-8',
                        'Cache-Control': 'public, max-age=3600',
                    },
                }
            );
        }

        function escapeXml(str: string): string {
            return str
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&apos;');
        }

        function getThumbnailUrl(video: (typeof videos)[number]): string {
            if (video.thumbnail?.url && !video.thumbnail.url.includes('placehold.co')) {
                return video.thumbnail.url;
            }
            if (video.embed?.sourcePlatform === 'vazounudes' && video.embed?.sourceId) {
                return `${BASE_URL}/api/thumb/${video.slug}/1`;
            }
            return `${BASE_URL}/api/thumb/${video.slug}/1`;
        }

        const urls = videos
            .map((video) => {
                const thumbnailUrl = getThumbnailUrl(video);
                const tags = [...(video.tags || []), ...(video.categories || [])]
                    .map((t) => `      <video:tag>${escapeXml(t.name)}</video:tag>`)
                    .join('\n');

                return `  <url>
    <loc>${BASE_URL}/${video.slug}</loc>
    <lastmod>${video.updatedAt.toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
    <video:video>
      <video:thumbnail_loc>${escapeXml(thumbnailUrl)}</video:thumbnail_loc>
      <video:title>${escapeXml(video.metaTitle)}</video:title>
      <video:description>${escapeXml(video.metaDescription)}</video:description>
      <video:player_loc allow_embed="yes">${escapeXml(`${BASE_URL}/${video.slug}`)}</video:player_loc>
      <video:duration>${video.duration}</video:duration>${video.publishedAt
                        ? `\n      <video:publication_date>${video.publishedAt.toISOString()}</video:publication_date>`
                        : ''
                    }
      <video:family_friendly>no</video:family_friendly>
      <video:requires_subscription>no</video:requires_subscription>
      <video:uploader info="${BASE_URL}">Xvideos Prime</video:uploader>
      <video:live>no</video:live>
      <video:view_count>${video.views}</video:view_count>
${tags}
    </video:video>
  </url>`;
            })
            .join('\n');

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http:
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${urls}
</urlset>`;

        return new NextResponse(xml, {
            headers: {
                'Content-Type': 'application/xml; charset=utf-8',
                'Cache-Control': 'public, max-age=300, s-maxage=300, must-revalidate',
                'X-Page': page.toString(),
                'X-Videos-Count': videos.length.toString(),
            },
        });
    } catch (error) {
        console.error('[Sitemap Vídeos] Erro na página:', error);
        return new NextResponse(
            `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"></urlset>`,
            {
                headers: {
                    'Content-Type': 'application/xml; charset=utf-8',
                    'Cache-Control': 'public, max-age=300',
                },
            }
        );
    }
}
