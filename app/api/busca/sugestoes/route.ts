import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export type Suggestion = {
    text: string;
    type: 'model' | 'video' | 'category';
    image: string | null;
};

export async function GET(req: NextRequest) {
    const q = req.nextUrl.searchParams.get('q')?.trim() ?? '';
    if (q.length < 2) return NextResponse.json({ suggestions: [] });

    const [models, categories, videos] = await Promise.all([
        db.model.findMany({
            where: { name: { contains: q, mode: 'insensitive' } },
            take: 3,
            select: { name: true, imageUrl: true },
        }),
        db.category.findMany({
            where: { name: { contains: q, mode: 'insensitive' } },
            take: 2,
            select: { name: true },
        }),
        db.video.findMany({
            where: { h1Title: { contains: q, mode: 'insensitive' }, status: 'PUBLISHED' },
            take: 4,
            select: { h1Title: true, thumbnail: { select: { url: true } } },
            orderBy: { views: 'desc' },
        }),
    ]);

    const suggestions: Suggestion[] = [
        ...models.map(m => ({ text: m.name,    type: 'model'    as const, image: m.imageUrl ?? null })),
        ...categories.map(c => ({ text: c.name, type: 'category' as const, image: null })),
        ...videos.map(v => ({ text: v.h1Title,  type: 'video'    as const, image: v.thumbnail?.url ?? null })),
    ]
        .filter((v, i, a) => a.findIndex(x => x.text === v.text) === i)
        .slice(0, 8);

    return NextResponse.json({ suggestions });
}
