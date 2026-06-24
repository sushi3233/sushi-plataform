import { NextRequest, NextResponse } from 'next/server';
import { db as prisma } from '@/lib/db';
import { deleteObject } from '@/lib/services/r2';
import { assertAdminApiAuth } from '@/lib/admin-api-auth';

function getErrorMessage(error: unknown): string {
    return error instanceof Error ? error.message : 'Erro interno';
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const unauthorized = assertAdminApiAuth(request);
    if (unauthorized) return unauthorized;

    try {
        const { id } = await params;

        const video = await prisma.video.findUnique({
            where: { id },
            include: {
                thumbnail: true,
                models: true,
                categories: true,
                tags: true,
                embed: true,
            },
        });

        if (!video) {
            return NextResponse.json(
                { error: 'Video nao encontrado' },
                { status: 404 }
            );
        }

        return NextResponse.json(video);
    } catch (error: unknown) {
        return NextResponse.json(
            { error: `Erro ao buscar video: ${getErrorMessage(error)}` },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const unauthorized = assertAdminApiAuth(request);
    if (unauthorized) return unauthorized;

    try {
        const { id } = await params;

        const video = await prisma.video.findUnique({
            where: { id },
            include: { thumbnail: true },
        });

        if (!video) {
            return NextResponse.json(
                { error: 'Video nao encontrado' },
                { status: 404 }
            );
        }

        if (video.thumbnail?.r2Key && video.thumbnail.r2Key !== 'manual-entry') {
            try {
                await deleteObject(video.thumbnail.r2Key);
            } catch (r2Error: unknown) {
                console.warn('[API DELETE Video] Erro ao deletar thumbnail do R2:', r2Error);
            }
        }

        await prisma.video.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error: unknown) {
        return NextResponse.json(
            { error: `Erro ao deletar video: ${getErrorMessage(error)}` },
            { status: 500 }
        );
    }
}
