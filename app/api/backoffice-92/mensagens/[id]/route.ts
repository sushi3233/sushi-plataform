import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { assertAdminApiAuth } from '@/lib/admin-api-auth';

interface Params { params: Promise<{ id: string }> }

export async function PATCH(req: NextRequest, { params }: Params) {
    const authError = assertAdminApiAuth(req);
    if (authError) return authError;

    const { id } = await params;
    const { status } = await req.json();
    await db.contactMessage.update({ where: { id }, data: { status } });
    return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest, { params }: Params) {
    const authError = assertAdminApiAuth(req);
    if (authError) return authError;

    const { id } = await params;
    await db.contactMessage.delete({ where: { id } });
    return NextResponse.json({ ok: true });
}
