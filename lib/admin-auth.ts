import crypto from 'crypto';

export interface AdminUser {
    email: string;
    name: string;
}

export function authenticateAdmin(email: string, password: string): AdminUser | null {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const adminName = process.env.ADMIN_NAME || 'Administrador';

    if (!adminEmail || !adminPassword) {
        console.error('ERRO CRÍTICO DE SEGURANÇA: ADMIN_EMAIL ou ADMIN_PASSWORD não configurados.');
        return null;
    }

    try {
        const inputEmailBuffer = Buffer.from(email);
        const adminEmailBuffer = Buffer.from(adminEmail);

        const inputPasswordBuffer = Buffer.from(password);
        const adminPasswordBuffer = Buffer.from(adminPassword);

        const emailMatch = inputEmailBuffer.length === adminEmailBuffer.length &&
            crypto.timingSafeEqual(inputEmailBuffer, adminEmailBuffer);

        const passwordMatch = inputPasswordBuffer.length === adminPasswordBuffer.length &&
            crypto.timingSafeEqual(inputPasswordBuffer, adminPasswordBuffer);

        if (emailMatch && passwordMatch) {
            return {
                email: adminEmail,
                name: adminName,
            };
        }
    } catch {

        return null;
    }

    return null;
}

export function isAuthenticated(request: Request): boolean {

    const cookie = request.headers.get('cookie');
    if (!cookie) return false;

    const adminSession = cookie
        .split(';')
        .find((c) => c.trim().startsWith('admin_session='));

    if (!adminSession) return false;

    const sessionValue = adminSession.split('=').slice(1).join('=');

    const expectedSession = process.env.ADMIN_SECRET;

    if (!expectedSession) {
        console.error('ERRO: ADMIN_SECRET não configurado.');
        return false;
    }

    return sessionValue === expectedSession;
}

export function createSessionCookie(): string {
    const sessionValue = process.env.ADMIN_SECRET;

    if (!sessionValue) {
        throw new Error('ADMIN_SECRET não configurado no servidor.');
    }

    const maxAge = 7 * 24 * 60 * 60;

    const isProduction = process.env.NODE_ENV === 'production';
    const secureFlag = isProduction ? 'Secure;' : '';

    return `admin_session=${sessionValue}; Path=/; ${secureFlag} HttpOnly; SameSite=Strict; Max-Age=${maxAge}`;
}

export function clearSessionCookie(): string {
    return 'admin_session=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0';
}
