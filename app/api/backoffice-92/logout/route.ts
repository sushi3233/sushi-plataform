import { NextRequest, NextResponse } from 'next/server';
import { clearSessionCookie } from '@/lib/admin-auth';
import { assertAdminApiAuth } from '@/lib/admin-api-auth';

export async function POST(request: NextRequest) {
    const unauthorized = assertAdminApiAuth(request);
    if (unauthorized) return unauthorized;

    const response = NextResponse.redirect(
        new URL('/backoffice-92/login', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000')
    );
    response.headers.set('Set-Cookie', clearSessionCookie());
    return response;
}
