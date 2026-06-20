import { NextRequest, NextResponse } from 'next/server';
import { getVideoBySlug } from '@/lib/services/videos';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ videoSlug: string; n: string }> }
) {
    try {
        const { videoSlug, n } = await params;
        const thumbnailIndex = parseInt(n, 10);

        if (isNaN(thumbnailIndex) || thumbnailIndex < 1 || thumbnailIndex > 20) {
            return NextResponse.json(
                { error: 'Invalid thumbnail index' },
                { status: 400 }
            );
        }

        const video = await getVideoBySlug(videoSlug);
        if (!video) {
            return NextResponse.json(
                { error: 'Video not found' },
                { status: 404 }
            );
        }

        if (video.thumbnail?.url && !video.thumbnail.url.includes('placehold.co')) {
            return NextResponse.redirect(video.thumbnail.url, 302);
        }

        if (video.embed?.sourcePlatform === 'vazounudes' && video.embed?.sourceId) {
            const externalUrl = `https://vazounudes.net/hls/${video.embed.sourceId}/thumbnail_${thumbnailIndex}.jpg`;

            const response = await fetch(externalUrl, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'Referer': 'https://xxx.vazounudes.net/',
                },
            });

            if (!response.ok) {
                return NextResponse.json(
                    { error: 'Thumbnail not found' },
                    { status: 404 }
                );
            }

            const imageBuffer = await response.arrayBuffer();

            return new NextResponse(imageBuffer, {
                status: 200,
                headers: {
                    'Content-Type': 'image/jpeg',
                    'Cache-Control': 'public, max-age=31536000, immutable',
                },
            });
        }

        return NextResponse.json(
            { error: 'No thumbnail available' },
            { status: 404 }
        );
    } catch (error) {
        console.error('[Thumb API] Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
