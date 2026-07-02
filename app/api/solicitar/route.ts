import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
    try {
        const { modelName, details, videoSlug } = await req.json();

        if (!modelName?.trim()) {
            return NextResponse.json({ error: 'Nome da modelo é obrigatório.' }, { status: 400 });
        }

        await (db as any).videoRequest.create({
            data: {
                modelName: modelName.trim(),
                details: details?.trim() || null,
                videoSlug: videoSlug || null,
            },
        });

        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error('Erro ao salvar solicitação:', err);
        return NextResponse.json({ error: 'Erro interno.' }, { status: 500 });
    }
}
