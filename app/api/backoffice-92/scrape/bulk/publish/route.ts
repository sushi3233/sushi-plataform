import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import slugify from 'slugify';
import { db as prisma } from '@/lib/db';
import { assertAdminApiAuth } from '@/lib/admin-api-auth';
import { getPrismaErrorMessage } from '@/lib/prisma-errors';
import { buildRandomizedVideoSlug, buildVideoSlugBase } from '@/lib/video-slug';

interface VideoToPublish {
    id: string;
    slug?: string;
    metaTitle: string;
    metaDescription: string;
    h1Title: string;
    duration?: number;
    models: string[];
    categories: string[];
    tags: string[];
    thumbnailUrl?: string;
    thumbnailKey?: string;
}

interface PublishResponse {
    success: true;
    published: number;
    failed: number;
    publishedIds: string[];
    errors: string[];
}

function normalizeNameList(input: unknown): string[] {
    const rawItems = Array.isArray(input)
        ? input.filter((item): item is string => typeof item === 'string')
        : typeof input === 'string'
            ? [input]
            : [];

    const uniqueBySlug = new Map<string, string>();

    for (const rawItem of rawItems) {
        for (const rawPart of rawItem.split(/[\n,;]+/)) {
            const normalized = rawPart.replace(/\s+/g, ' ').trim();
            if (!normalized) continue;

            const slug = slugify(normalized, { lower: true, strict: true });
            if (!slug || uniqueBySlug.has(slug)) continue;
            uniqueBySlug.set(slug, normalized);
        }
    }

    return Array.from(uniqueBySlug.values());
}

function normalizeOptionalString(input: unknown): string | null {
    if (typeof input !== 'string') return null;
    const trimmed = input.trim();
    return trimmed.length > 0 ? trimmed : null;
}

function getErrorMessage(error: unknown): string {
    return getPrismaErrorMessage(error, 'Erro interno ao publicar videos');
}

function connectOrCreateByNames(names: string[]) {
    return names.map((name) => ({
        where: { slug: slugify(name, { lower: true, strict: true }) },
        create: { name, slug: slugify(name, { lower: true, strict: true }) },
    }));
}

async function ensureUniqueVideoSlug(baseSlug: string, currentVideoId: string): Promise<string> {
    const normalizedBase = buildVideoSlugBase(baseSlug || 'video');
    let candidate = normalizedBase;

    for (let attempt = 0; attempt < 10; attempt++) {
        const existing = await prisma.video.findUnique({
            where: { slug: candidate },
            select: { id: true },
        });

        if (!existing || existing.id === currentVideoId) {
            return candidate;
        }

        candidate = buildRandomizedVideoSlug(normalizedBase);
    }

    throw new Error('Nao foi possivel gerar slug unico para o video');
}

export async function POST(request: NextRequest) {
    const unauthorized = assertAdminApiAuth(request);
    if (unauthorized) return unauthorized;

    try {
        const body = (await request.json()) as { videos?: unknown };
        const videos = Array.isArray(body.videos) ? body.videos : [];

        console.info(`[Bulk Publish] Request received with ${videos.length} video(s)`);

        if (videos.length === 0) {
            return NextResponse.json(
                { error: 'Lista de videos e obrigatoria' },
                { status: 400 }
            );
        }

        let published = 0;
        let failed = 0;
        const errors: string[] = [];
        const publishedIds: string[] = [];

        for (const rawVideo of videos) {
            try {
                if (!rawVideo || typeof rawVideo !== 'object') {
                    throw new Error('Payload de video invalido');
                }
                const videoData = rawVideo as Partial<VideoToPublish>;
                const videoId = typeof videoData.id === 'string' ? videoData.id : '';
                const models = normalizeNameList(videoData.models);
                const categories = normalizeNameList(videoData.categories);
                const tags = normalizeNameList(videoData.tags);
                const metaTitle = typeof videoData.metaTitle === 'string' ? videoData.metaTitle : '';
                const metaDescription = typeof videoData.metaDescription === 'string' ? videoData.metaDescription : '';
                const h1Title = typeof videoData.h1Title === 'string' ? videoData.h1Title : '';
                const incomingSlug = typeof videoData.slug === 'string' ? videoData.slug : '';
                const duration = typeof videoData.duration === 'number' && videoData.duration > 0
                    ? videoData.duration
                    : undefined;
                const thumbnailUrl = normalizeOptionalString(videoData.thumbnailUrl);
                const thumbnailKey = normalizeOptionalString(videoData.thumbnailKey);

                if (!videoId) {
                    throw new Error('ID de video invalido');
                }

                console.info(
                    `[Bulk Publish] Processing video ${videoId} (models=${models.length}, categories=${categories.length}, tags=${tags.length}, incomingThumbnail=${Boolean(thumbnailUrl)})`
                );

                const existing = await prisma.video.findUnique({
                    where: { id: videoId },
                    select: {
                        id: true,
                        slug: true,
                        status: true,
                        thumbnail: { select: { id: true, r2Key: true, url: true } },
                        embed: { select: { hlsUrl: true } },
                    },
                });

                if (!existing) {
                    throw new Error('Video nao encontrado');
                }

                const hasIncomingThumbnail = Boolean(thumbnailUrl);
                if (!existing.thumbnail && !hasIncomingThumbnail) {
                    throw new Error('Video sem thumbnail. Corrija antes de publicar.');
                }

                if (!existing.embed?.hlsUrl) {
                    throw new Error('Video sem HLS/iframe valido. Corrija antes de publicar.');
                }

                const desiredSlugSeed = incomingSlug || h1Title || metaTitle || existing.slug;
                const targetSlug = existing.status === 'PUBLISHED'
                    ? existing.slug
                    : await ensureUniqueVideoSlug(desiredSlugSeed, videoId);

                await prisma.$transaction(async (tx) => {
                    await tx.video.update({
                        where: { id: videoId },
                        data: {
                            models: { set: [] },
                            categories: { set: [] },
                            tags: { set: [] },
                        },
                    });

                    if (thumbnailUrl) {
                        const resolvedKey = thumbnailKey || existing.thumbnail?.r2Key || 'bulk-import-manual';
                        const altText = (h1Title || metaTitle).substring(0, 100);

                        if (existing.thumbnail) {
                            await tx.videoThumbnail.update({
                                where: { id: existing.thumbnail.id },
                                data: {
                                    url: thumbnailUrl,
                                    r2Key: resolvedKey,
                                    altText,
                                },
                            });
                        } else {
                            await tx.videoThumbnail.create({
                                data: {
                                    videoId,
                                    url: thumbnailUrl,
                                    r2Key: resolvedKey,
                                    altText,
                                },
                            });
                        }

                        console.info(`[Bulk Publish] Thumbnail persisted for video ${videoId} with key ${resolvedKey}`);
                    }

                    await tx.video.update({
                        where: { id: videoId },
                        data: {
                            slug: targetSlug,
                            metaTitle: metaTitle.substring(0, 60),
                            metaDescription: metaDescription.substring(0, 160),
                            h1Title: (h1Title || metaTitle).substring(0, 100),
                            ...(duration !== undefined && { duration }),
                            status: 'PUBLISHED',
                            publishedAt: new Date(),
                            models: { connectOrCreate: connectOrCreateByNames(models) },
                            categories: { connectOrCreate: connectOrCreateByNames(categories) },
                            tags: { connectOrCreate: connectOrCreateByNames(tags) },
                        },
                    });
                });

                published += 1;
                publishedIds.push(videoId);
                console.info(`[Bulk Publish] Video ${videoId} published successfully`);

                if (existing.slug) {
                    revalidatePath(`/${existing.slug}`);
                }
                if (targetSlug !== existing.slug) {
                    revalidatePath(`/${targetSlug}`);
                }
            } catch (error: unknown) {
                failed += 1;
                const videoId = (rawVideo as { id?: string })?.id || 'unknown';
                errors.push(`${videoId}: ${getErrorMessage(error)}`);
                console.error(`[Bulk Publish] Failed to publish video ${videoId}:`, error);
            }
        }

        revalidatePath('/backoffice-92/videos');
        revalidatePath('/');

        console.info(`[Bulk Publish] Completed. published=${published}, failed=${failed}`);

        return NextResponse.json({
            success: true,
            published,
            failed,
            publishedIds,
            errors,
        } satisfies PublishResponse);
    } catch (error: unknown) {
        console.error('[Bulk Publish] Fatal error:', error);
        return NextResponse.json(
            { error: getErrorMessage(error) },
            { status: 500 }
        );
    }
}
