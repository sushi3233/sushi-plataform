import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/admin-auth';

export function assertAdminApiAuth(request: NextRequest): NextResponse | null {
    if (isAuthenticated(request)) {
        return null;
    }

    return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
    );
}
