import { NextRequest, NextResponse } from 'next/server';
import slugify from 'slugify';
import { db as prisma } from '@/lib/db';
import { assertAdminApiAuth } from '@/lib/admin-api-auth';
import { getPrismaErrorMessage } from '@/lib/prisma-errors';
import { scrapeXvideosBuceta } from '@/lib/scraper/xvideosbuceta-scraper';
import { validateVideoPageUrl } from '@/lib/scraper/xvideosbuceta-url';
import { processScrapedThumbnails } from '@/lib/thumbnail-processor';
import { buildRandomizedVideoSlug, buildVideoSlugBase } from '@/lib/video-slug';

function getErrorMessage(error: unknown): string {
    return getPrismaErrorMessage(error, 'Erro ao fazer scraping');
}

export async function POST(request: NextRequest) {
    const unauthorized = assertAdminApiAuth(request);
    if (unauthorized) return unauthorized;

    try {
        const body = (await request.json()) as { url?: unknown };
        const rawUrl = typeof body.url === 'string' ? body.url : '';

        if (!rawUrl) {
            return NextResponse.json({ error: 'URL e obrigatoria' }, { status: 400 });
        }

        const validation = validateVideoPageUrl(rawUrl);
        if (!validation.isValid || !validation.normalizedUrl) {
            return NextResponse.json(
                { error: validation.error || 'URL invalida' },
                { status: 400 }
            );
        }

        const normalizedUrl = validation.normalizedUrl;
        const scrapedData = await scrapeXvideosBuceta(normalizedUrl);

        const existingVideo = await prisma.videoEmbed.findFirst({
            where: {
                OR: [
                    { sourceId: scrapedData.vazounudesUUID },
                    { sourceUrl: normalizedUrl },
                ],
            },
        });

        if (existingVideo) {
            return NextResponse.json(
                { error: 'Video ja existe no banco de dados' },
                { status: 409 }
            );
        }

        const initialSlug = buildVideoSlugBase(scrapedData.title);
        const slugExists = await prisma.video.findUnique({ where: { slug: initialSlug } });
        const slug = slugExists ? buildRandomizedVideoSlug(initialSlug) : initialSlug;

        const video = await prisma.video.create({
            data: {
                slug,
                metaTitle: scrapedData.title.substring(0, 60),
                metaDescription: scrapedData.title.substring(0, 160),
                h1Title: scrapedData.title.substring(0, 100),
                duration: scrapedData.duration,
                status: 'DRAFT',
                embed: {
                    create: {
                        hlsUrl: scrapedData.hlsUrl,
                        iframeUrl: scrapedData.iframeUrl,
                        sourcePlatform: 'vazounudes',
                        sourceId: scrapedData.vazounudesUUID,
                        sourceUrl: normalizedUrl,
                        originalPosterUrl: scrapedData.thumbnailUrls[0] || null,
                    },
                },
                models: {
                    connectOrCreate: scrapedData.models.map((name) => ({
                        where: { slug: slugify(name, { lower: true, strict: true }) },
                        create: { name, slug: slugify(name, { lower: true, strict: true }) },
                    })),
                },
                categories: {
                    connectOrCreate: scrapedData.categories.map((name) => ({
                        where: { slug: slugify(name, { lower: true, strict: true }) },
                        create: { name, slug: slugify(name, { lower: true, strict: true }) },
                    })),
                },
                tags: {
                    connectOrCreate: scrapedData.tags.map((name) => ({
                        where: { slug: slugify(name, { lower: true, strict: true }) },
                        create: { name, slug: slugify(name, { lower: true, strict: true }) },
                    })),
                },
            },
        });

        const thumbResult = await processScrapedThumbnails(scrapedData.thumbnailUrls, video.id);

        if (thumbResult) {
            await prisma.videoThumbnail.create({
                data: {
                    videoId: video.id,
                    url: thumbResult.url,
                    r2Key: thumbResult.key,
                    altText: scrapedData.title,
                },
            });
        }

        return NextResponse.json({
            success: true,
            videoId: video.id,
            title: scrapedData.title,
            slug: video.slug,
            missingThumbnail: !thumbResult,
        });
    } catch (error: unknown) {
        return NextResponse.json(
            { error: getErrorMessage(error) },
            { status: 500 }
        );
    }
}
