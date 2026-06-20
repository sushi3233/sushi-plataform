import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
    try {
        const { videoId } = await request.json();

        if (!videoId || typeof videoId !== 'string') {
            return NextResponse.json({ error: 'Invalid videoId' }, { status: 400 });
        }

        await db.video.update({
            where: { id: videoId },
            data: { views: { increment: 1 } },
        });

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        await db.dailyView.upsert({
            where: {
                videoId_date: {
                    videoId,
                    date: today,
                },
            },
            update: {
                count: { increment: 1 },
            },
            create: {
                videoId,
                date: today,
                count: 1,
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error tracking view:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
