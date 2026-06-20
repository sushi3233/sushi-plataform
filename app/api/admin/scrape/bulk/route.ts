import { NextRequest, NextResponse } from 'next/server';
import slugify from 'slugify';
import { db as prisma } from '@/lib/db';
import { assertAdminApiAuth } from '@/lib/admin-api-auth';
import { getPrismaErrorMessage } from '@/lib/prisma-errors';
import { scrapeXvideosBuceta } from '@/lib/scraper/xvideosbuceta-scraper';
import { validateVideoPageUrl } from '@/lib/scraper/xvideosbuceta-url';
import { processScrapedThumbnails } from '@/lib/thumbnail-processor';
import { buildRandomizedVideoSlug, buildVideoSlugBase } from '@/lib/video-slug';

export const maxDuration = 300;

export interface BulkScrapeResult {
    url: string;
    success: boolean;
    videoId?: string;
    title?: string;
    slug?: string;
    missingThumbnail?: boolean;
    error?: string;
}

export interface BulkScrapeResponse {
    results: BulkScrapeResult[];
    total: number;
    success: number;
    failed: number;
}

function getErrorMessage(error: unknown): string {
    return getPrismaErrorMessage(error, 'Erro desconhecido');
}

function normalizeTaxonomyNames(names: string[]): string[] {
    const uniqueBySlug = new Map<string, string>();

    for (const rawName of names) {
        const normalized = rawName.replace(/\s+/g, ' ').trim();
        if (!normalized) continue;

        const slug = slugify(normalized, { lower: true, strict: true });
        if (!slug || uniqueBySlug.has(slug)) continue;
        uniqueBySlug.set(slug, normalized);
    }

    return Array.from(uniqueBySlug.values());
}

export async function POST(request: NextRequest) {
    const unauthorized = assertAdminApiAuth(request);
    if (unauthorized) return unauthorized;

    try {
        const body = (await request.json()) as { urls?: unknown };
        const urls = Array.isArray(body.urls) ? body.urls : [];

        console.info(`[Bulk Scrape] Request received with ${urls.length} URL(s)`);

        if (urls.length === 0) {
            return NextResponse.json({ error: 'Lista de URLs e obrigatoria' }, { status: 400 });
        }

        if (urls.length > 100) {
            return NextResponse.json({ error: 'Maximo de 100 URLs por requisicao' }, { status: 400 });
        }

        const results: BulkScrapeResult[] = [];

        for (const rawUrl of urls) {
            if (typeof rawUrl !== 'string') {
                console.warn('[Bulk Scrape] Invalid URL item in payload:', rawUrl);
                results.push({
                    url: String(rawUrl),
                    success: false,
                    error: 'URL invalida no payload',
                });
                continue;
            }

            const result = await processSingleVideo(rawUrl);
            results.push(result);

            if (result.success) {
                console.info(
                    `[Bulk Scrape] Success for ${result.url} -> videoId=${result.videoId} slug=${result.slug} missingThumbnail=${Boolean(result.missingThumbnail)}`
                );
            } else {
                console.error(`[Bulk Scrape] Failure for ${result.url}: ${result.error}`);
            }
        }

        const successCount = results.filter((result) => result.success).length;
        const failedCount = results.filter((result) => !result.success).length;
        console.info(`[Bulk Scrape] Completed. success=${successCount}, failed=${failedCount}, total=${urls.length}`);

        return NextResponse.json({
            results,
            total: urls.length,
            success: successCount,
            failed: failedCount,
        } satisfies BulkScrapeResponse);
    } catch (error: unknown) {
        console.error('[Bulk Scrape] Fatal error:', error);
        return NextResponse.json(
            { error: getErrorMessage(error) },
            { status: 500 }
        );
    }
}

async function processSingleVideo(rawUrl: string): Promise<BulkScrapeResult> {
    const validation = validateVideoPageUrl(rawUrl);
    if (!validation.isValid || !validation.normalizedUrl) {
        return {
            url: rawUrl,
            success: false,
            error: validation.error || 'URL invalida',
        };
    }

    const url = validation.normalizedUrl;

    try {
        console.info(`[Bulk Scrape] Processing URL: ${url}`);
        const scrapedData = await scrapeXvideosBuceta(url);
        const modelNames = normalizeTaxonomyNames(scrapedData.models);
        const categoryNames = normalizeTaxonomyNames(scrapedData.categories);
        const tagNames = normalizeTaxonomyNames(scrapedData.tags);

        console.info(
            `[Bulk Scrape] Scraped metadata for ${url} (title="${scrapedData.title}", duration=${scrapedData.duration}, models=${modelNames.length}, categories=${categoryNames.length}, tags=${tagNames.length})`
        );

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
                        sourceUrl: url,
                        originalPosterUrl: scrapedData.thumbnailUrls[0] || null,
                    },
                },
                models: {
                    connectOrCreate: modelNames.map((name) => ({
                        where: { slug: slugify(name, { lower: true, strict: true }) },
                        create: { name, slug: slugify(name, { lower: true, strict: true }) },
                    })),
                },
                categories: {
                    connectOrCreate: categoryNames.map((name) => ({
                        where: { slug: slugify(name, { lower: true, strict: true }) },
                        create: { name, slug: slugify(name, { lower: true, strict: true }) },
                    })),
                },
                tags: {
                    connectOrCreate: tagNames.map((name) => ({
                        where: { slug: slugify(name, { lower: true, strict: true }) },
                        create: { name, slug: slugify(name, { lower: true, strict: true }) },
                    })),
                },
            },
        });

        const thumbnailResult = await processScrapedThumbnails(scrapedData.thumbnailUrls, video.id);

        if (thumbnailResult) {
            await prisma.videoThumbnail.create({
                data: {
                    videoId: video.id,
                    url: thumbnailResult.url,
                    r2Key: thumbnailResult.key,
                    altText: scrapedData.title,
                },
            });
            console.info(`[Bulk Scrape] Thumbnail uploaded for video ${video.id}: ${thumbnailResult.key}`);
        } else {
            const attempted = scrapedData.thumbnailUrls.slice(0, 5);
            console.warn(
                `[Bulk Scrape] Thumbnail upload failed for video ${video.id}. Tried URLs: ${attempted.join(', ')}`
            );
        }

        return {
            url,
            success: true,
            videoId: video.id,
            title: scrapedData.title,
            slug: video.slug,
            missingThumbnail: !thumbnailResult,
        };
    } catch (error: unknown) {
        console.error(`[Bulk Scrape] Error while processing ${url}:`, error);
        return {
            url,
            success: false,
            error: getErrorMessage(error),
        };
    }
}
