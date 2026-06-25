import { NextRequest, NextResponse } from 'next/server';
import slugify from 'slugify';
import { db as prisma } from '@/lib/db';
import { assertAdminApiAuth } from '@/lib/admin-api-auth';
import { getPrismaErrorMessage } from '@/lib/prisma-errors';
import { processScrapedThumbnails } from '@/lib/thumbnail-processor';
import { buildRandomizedVideoSlug, buildVideoSlugBase } from '@/lib/video-slug';
import type { BulkScrapeResult, BulkScrapeResponse } from '../bulk/route';

export const maxDuration = 300;

interface ScraperJsonVideo {
    url: string;
    title: string;
    duration: number;
    thumbnail: string | null;
    models: string[];
    categories: string[];
    tags: string[];
    vazounudesUUID: string | null;
    hlsUrl: string | null;
    iframeUrl: string | null;
    vazounudesThumbnails: string[];
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

async function importSingleVideo(video: ScraperJsonVideo): Promise<BulkScrapeResult> {
    if (!video.vazounudesUUID) {
        return { url: video.url || '', success: false, error: 'Sem UUID do vazounudes' };
    }
    if (!video.title) {
        return { url: video.url || '', success: false, error: 'Sem titulo' };
    }

    try {
        const modelNames = normalizeTaxonomyNames(video.models ?? []);
        const categoryNames = normalizeTaxonomyNames(video.categories ?? []);
        const tagNames = normalizeTaxonomyNames(video.tags ?? []);

        const hlsUrl = video.hlsUrl || `https://vazounudes.net/hls/${video.vazounudesUUID}/playlist.m3u8`;
        const iframeUrl = video.iframeUrl || `https://xxx.vazounudes.net/video/video-player.php?id=${video.vazounudesUUID}`;

        const initialSlug = buildVideoSlugBase(video.title);
        const slugExists = await prisma.video.findUnique({ where: { slug: initialSlug } });
        const slug = slugExists ? buildRandomizedVideoSlug(initialSlug) : initialSlug;

        const dbVideo = await prisma.video.create({
            data: {
                slug,
                metaTitle: video.title.substring(0, 60),
                metaDescription: video.title.substring(0, 160),
                h1Title: video.title.substring(0, 100),
                duration: video.duration || 0,
                status: 'DRAFT',
                embed: {
                    create: {
                        hlsUrl,
                        iframeUrl,
                        sourcePlatform: 'vazounudes',
                        sourceId: video.vazounudesUUID,
                        sourceUrl: video.url || null,
                        originalPosterUrl: video.thumbnail || null,
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

        // Tenta thumbnail do WordPress primeiro; vazounudes como fallback
        const thumbnailUrls = [
            video.thumbnail,
            ...(video.vazounudesThumbnails ?? []),
        ].filter((u): u is string => Boolean(u));

        const thumbnailResult = await processScrapedThumbnails(thumbnailUrls, dbVideo.id);

        if (thumbnailResult) {
            await prisma.videoThumbnail.create({
                data: {
                    videoId: dbVideo.id,
                    url: thumbnailResult.url,
                    r2Key: thumbnailResult.key,
                    altText: video.title,
                },
            });
        }

        return {
            url: video.url,
            success: true,
            videoId: dbVideo.id,
            title: video.title,
            slug: dbVideo.slug,
            missingThumbnail: !thumbnailResult,
        };
    } catch (error: unknown) {
        console.error(`[ImportJSON] Erro ao importar ${video.url}:`, error);
        return {
            url: video.url || '',
            success: false,
            error: getErrorMessage(error),
        };
    }
}

export async function POST(request: NextRequest) {
    const unauthorized = assertAdminApiAuth(request);
    if (unauthorized) return unauthorized;

    try {
        const body = (await request.json()) as unknown;

        // Aceita tanto { videos: [...] } (saída completa do scraper) quanto [...] diretamente
        const rawVideos: unknown[] = Array.isArray(body)
            ? body
            : Array.isArray((body as Record<string, unknown>).videos)
            ? ((body as Record<string, unknown>).videos as unknown[])
            : [];

        if (rawVideos.length === 0) {
            return NextResponse.json({ error: 'Nenhum video encontrado no JSON' }, { status: 400 });
        }

        if (rawVideos.length > 200) {
            return NextResponse.json({ error: 'Maximo de 200 videos por importacao' }, { status: 400 });
        }

        const results: BulkScrapeResult[] = [];

        for (const item of rawVideos) {
            if (typeof item !== 'object' || !item) {
                results.push({ url: '', success: false, error: 'Item invalido no JSON' });
                continue;
            }
            results.push(await importSingleVideo(item as ScraperJsonVideo));
        }

        const successCount = results.filter((r) => r.success).length;
        const failedCount = results.filter((r) => !r.success).length;
        console.info(`[ImportJSON] Concluido. success=${successCount}, failed=${failedCount}`);

        return NextResponse.json({
            results,
            total: results.length,
            success: successCount,
            failed: failedCount,
        } satisfies BulkScrapeResponse);
    } catch (error: unknown) {
        console.error('[ImportJSON] Erro fatal:', error);
        return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
    }
}
