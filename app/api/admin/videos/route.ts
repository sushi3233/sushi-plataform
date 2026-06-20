import { NextRequest, NextResponse } from 'next/server';
import type { VideoStatus } from '@prisma/client';
import { db as prisma } from '@/lib/db';
import { assertAdminApiAuth } from '@/lib/admin-api-auth';
import { getVideosPaginated } from '@/lib/services/videos';

const VALID_STATUS = new Set<VideoStatus>(['DRAFT', 'PUBLISHED', 'DMCA_REMOVED']);

export async function GET(request: NextRequest) {
    const unauthorized = assertAdminApiAuth(request);
    if (unauthorized) return unauthorized;

    try {
        const searchParams = request.nextUrl.searchParams;
        const ids = searchParams.getAll('ids');

        if (ids.length > 0) {
            const videos = await prisma.video.findMany({
                where: { id: { in: ids } },
                include: {
                    thumbnail: true,
                    models: true,
                    categories: true,
                    tags: true,
                    embed: true,
                },
                orderBy: { createdAt: 'desc' },
            });

            return NextResponse.json({ videos, total: videos.length });
        }

        const page = Number.parseInt(searchParams.get('page') || '1', 10);
        const perPage = Number.parseInt(searchParams.get('perPage') || '20', 10);
        const statusParam = searchParams.get('status');
        const status = statusParam && VALID_STATUS.has(statusParam as VideoStatus)
            ? (statusParam as VideoStatus)
            : undefined;

        const result = await getVideosPaginated(page, perPage, { status });
        return NextResponse.json(result);
    } catch (error: unknown) {
        console.error('Erro ao listar videos:', error);
        return NextResponse.json(
            { error: 'Erro ao listar videos' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    const unauthorized = assertAdminApiAuth(request);
    if (unauthorized) return unauthorized;

    return NextResponse.json(
        { error: 'Use Server Actions for video creation' },
        { status: 405 }
    );
}
