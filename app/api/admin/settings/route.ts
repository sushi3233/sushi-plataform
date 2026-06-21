import { NextRequest, NextResponse } from 'next/server';
import { assertAdminApiAuth } from '@/lib/admin-api-auth';
import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function GET(request: NextRequest) {
    const authError = assertAdminApiAuth(request);
    if (authError) return authError;

    const settings = await prisma.setting.findMany();
    const result = Object.fromEntries(settings.map((s) => [s.key, s.value]));
    return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
    const authError = assertAdminApiAuth(request);
    if (authError) return authError;

    const body = await request.json();
    const { key, value } = body;

    if (!key || value === undefined) {
        return NextResponse.json({ error: 'key e value são obrigatórios' }, { status: 400 });
    }

    const setting = await prisma.setting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
    });

    revalidatePath('/');
    return NextResponse.json(setting);
}
