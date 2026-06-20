import { NextRequest, NextResponse } from 'next/server';
import { incrementViews } from '@/lib/services/videos';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { videoId } = body;

        if (!videoId || typeof videoId !== 'string') {
            return NextResponse.json(
                { error: 'videoId é obrigatório' },
                { status: 400 }
            );
        }

        await incrementViews(videoId);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('[API Views] Erro:', error);
        return NextResponse.json(
            { error: 'Erro ao registrar visualização' },
            { status: 500 }
        );
    }
}
