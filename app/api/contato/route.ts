import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { nome, email, assunto, mensagem } = body;

        if (!nome || !email || !assunto || !mensagem) {
            return NextResponse.json({ error: 'Todos os campos são obrigatórios.' }, { status: 400 });
        }

        await db.contactMessage.create({
            data: { nome, email, assunto, mensagem },
        });

        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error('Erro ao salvar mensagem de contato:', err);
        return NextResponse.json({ error: 'Erro interno.' }, { status: 500 });
    }
}
