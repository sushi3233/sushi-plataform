import { db as prisma } from '@/lib/db';
import type { VideoWithRelations } from '@/lib/types';
import type { VideoStatus } from '@prisma/client';

export async function getVideoBySlug(slug: string): Promise<VideoWithRelations | null> {
    return prisma.video.findUnique({
        where: { slug },
        include: {
            thumbnail: true,
            models: true,
            categories: true,
            tags: true,
            embed: true,
        },
    });
}

export async function getVideosPaginated(
    page: number = 1,
    perPage: number = 20,
    filters?: {
        status?: VideoStatus;
        modelSlug?: string;
        categorySlug?: string;
        tagSlug?: string;
        searchQuery?: string;
    }
) {
    const skip = (page - 1) * perPage;

    const where: any = {};

    if (filters?.status) {
        where.status = filters.status;
    }

    if (filters?.modelSlug) {
        where.models = {
            some: {
                slug: filters.modelSlug,
            },
        };
    }

    if (filters?.categorySlug) {
        where.categories = {
            some: {
                slug: filters.categorySlug,
            },
        };
    }

    if (filters?.tagSlug) {
        where.tags = {
            some: {
                slug: filters.tagSlug,
            },
        };
    }

    if (filters?.searchQuery) {
        where.OR = [
            { metaTitle: { contains: filters.searchQuery, mode: 'insensitive' } },
            { metaDescription: { contains: filters.searchQuery, mode: 'insensitive' } },
            { h1Title: { contains: filters.searchQuery, mode: 'insensitive' } },
        ];
    }

    const [videos, total] = await Promise.all([
        prisma.video.findMany({
            where,
            skip,
            take: perPage,
            orderBy: [
                { publishedAt: { sort: 'desc', nulls: 'last' } },
                { createdAt: 'desc' },
            ],
            include: {
                thumbnail: true,
                models: true,
                categories: true,
                tags: true,
                embed: true,
            },
        }),
        prisma.video.count({ where }),
    ]);

    return {
        videos,
        total,
        page,
        perPage,
        totalPages: Math.ceil(total / perPage),
    };
}

export async function getRecentVideos(limit: number = 20) {
    return prisma.video.findMany({
        where: { status: 'PUBLISHED' },
        orderBy: { publishedAt: 'desc' },
        take: limit,
        include: {
            thumbnail: true,
            models: true,
            embed: true,
        },
    });
}

export async function getMostViewedVideos(limit: number = 20) {
    return prisma.video.findMany({
        where: { status: 'PUBLISHED' },
        orderBy: { views: 'desc' },
        take: limit,
        include: {
            thumbnail: true,
            models: true,
            embed: true,
        },
    });
}

export async function getMostViewedVideosPaginated(
    page: number = 1,
    perPage: number = 20
) {
    const skip = (page - 1) * perPage;
    const where = { status: 'PUBLISHED' as VideoStatus };

    const [videos, total] = await Promise.all([
        prisma.video.findMany({
            where,
            skip,
            take: perPage,
            orderBy: { views: 'desc' },
            include: {
                thumbnail: true,
                models: true,
                embed: true,
            },
        }),
        prisma.video.count({ where }),
    ]);

    return {
        videos,
        total,
        page,
        perPage,
        totalPages: Math.ceil(total / perPage),
    };
}

function getTrendingWindowStart(hours: number = 24): Date {
    const days = Math.max(1, Math.ceil(hours / 24));
    const start = new Date();
    start.setDate(start.getDate() - days);
    start.setHours(0, 0, 0, 0);
    return start;
}

export async function getTrendingVideosPaginated(
    page: number = 1,
    perPage: number = 20,
    hours: number = 24
) {
    const skip = (page - 1) * perPage;
    const startDate = getTrendingWindowStart(hours);

    const where = {
        date: { gte: startDate },
        video: { status: 'PUBLISHED' as VideoStatus },
    };

    const [rankedGroups, distinctVideoIds] = await Promise.all([
        prisma.dailyView.groupBy({
            by: ['videoId'],
            where,
            _sum: { count: true },
            orderBy: [
                { _sum: { count: 'desc' } },
                { videoId: 'asc' },
            ],
            skip,
            take: perPage,
        }),
        prisma.dailyView.findMany({
            where,
            distinct: ['videoId'],
            select: { videoId: true },
        }),
    ]);

    const total = distinctVideoIds.length;
    const orderedVideoIds = rankedGroups.map((group) => group.videoId);

    if (orderedVideoIds.length === 0) {
        return {
            videos: [],
            total,
            page,
            perPage,
            totalPages: Math.ceil(total / perPage),
        };
    }

    const videos = await prisma.video.findMany({
        where: {
            id: { in: orderedVideoIds },
            status: 'PUBLISHED',
        },
        include: {
            thumbnail: true,
            models: true,
            embed: true,
        },
    });

    const videosById = new Map(videos.map((video) => [video.id, video]));
    const orderedVideos = orderedVideoIds
        .map((id) => videosById.get(id))
        .filter((video): video is (typeof videos)[number] => Boolean(video));

    return {
        videos: orderedVideos,
        total,
        page,
        perPage,
        totalPages: Math.ceil(total / perPage),
    };
}

export async function getTrendingVideos(limit: number = 20, hours: number = 24) {
    const result = await getTrendingVideosPaginated(1, limit, hours);
    return result.videos;
}

export async function incrementViews(videoId: string): Promise<void> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await Promise.all([

        prisma.video.update({
            where: { id: videoId },
            data: { views: { increment: 1 } },
        }),

        prisma.dailyView.upsert({
            where: {
                videoId_date: {
                    videoId,
                    date: today,
                },
            },
            create: {
                videoId,
                date: today,
                count: 1,
            },
            update: {
                count: { increment: 1 },
            },
        }),
    ]);
}
