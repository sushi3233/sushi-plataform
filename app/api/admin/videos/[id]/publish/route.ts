import { NextRequest, NextResponse } from 'next/server';
import { db as prisma } from '@/lib/db';
import { assertAdminApiAuth } from '@/lib/admin-api-auth';

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const unauthorized = assertAdminApiAuth(request);
    if (unauthorized) return unauthorized;

    try {
        const { id } = await params;

        const video = await prisma.video.findUnique({
            where: { id },
            include: { thumbnail: true, embed: true },
        });

        if (!video?.thumbnail) {
            return NextResponse.json(
                { error: 'Video precisa ter uma thumbnail antes de ser publicado' },
                { status: 400 }
            );
        }

        if (!video?.embed?.hlsUrl) {
            return NextResponse.json(
                { error: 'Video precisa ter um embed configurado antes de ser publicado' },
                { status: 400 }
            );
        }

        await prisma.video.update({
            where: { id },
            data: {
                status: 'PUBLISHED',
                publishedAt: new Date(),
            },
        });

        return NextResponse.json({ success: true });
    } catch (error: unknown) {
        console.error('[API Publish Video] Erro:', error);
        return NextResponse.json(
            { error: 'Erro ao publicar video' },
            { status: 500 }
        );
    }
}
