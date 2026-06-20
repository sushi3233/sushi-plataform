import { NextRequest, NextResponse } from 'next/server';
import { authenticateAdmin, createSessionCookie } from '@/lib/admin-auth';

const rateLimit = new Map<string, { attempts: number; blockUntil: number }>();

const MAX_ATTEMPTS = 5;
const BLOCK_DURATION = 15 * 60 * 1000;

export async function POST(request: NextRequest) {
    try {

        const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';

        const record = rateLimit.get(ip);
        if (record && Date.now() < record.blockUntil) {
            return NextResponse.json(
                { error: 'Muitas tentativas falhas. Tente novamente em 15 minutos.' },
                { status: 429 }
            );
        }

        const body = await request.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email e senha são obrigatórios' },
                { status: 400 }
            );
        }

        const admin = authenticateAdmin(email, password);

        if (!admin) {

            const currentAttempts = (record?.attempts || 0) + 1;

            if (currentAttempts >= MAX_ATTEMPTS) {
                rateLimit.set(ip, {
                    attempts: currentAttempts,
                    blockUntil: Date.now() + BLOCK_DURATION
                });
            } else {
                rateLimit.set(ip, {
                    attempts: currentAttempts,
                    blockUntil: 0
                });
            }

            await new Promise(resolve => setTimeout(resolve, 2000));

            return NextResponse.json(
                { error: 'Credenciais inválidas' },
                { status: 401 }
            );
        }

        rateLimit.delete(ip);

        const response = NextResponse.json({ success: true, admin });
        response.headers.set('Set-Cookie', createSessionCookie());

        return response;
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        );
    }
}
