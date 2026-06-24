export interface UrlValidationResult {
    isValid: boolean;
    normalizedUrl?: string;
    error?: string;
}

function parseHttpsUrl(rawUrl: string): URL | null {
    try {
        const parsed = new URL(rawUrl.trim());
        if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') return null;
        return parsed;
    } catch {
        return null;
    }
}

function normalizeUrl(parsed: URL): string {
    const pathname = parsed.pathname.endsWith('/') ? parsed.pathname : `${parsed.pathname}/`;
    return `${parsed.protocol}//${parsed.hostname}${pathname}`;
}

const NON_VIDEO_PREFIXES = [
    '/actor/', '/actors/', '/category/', '/categories/',
    '/tag/', '/tags/', '/search/', '/page/', '/wp-', '/feed',
    '/login', '/register', '/account', '/profile',
];

export function validateModelPageUrl(rawUrl: string): UrlValidationResult {
    const parsed = parseHttpsUrl(rawUrl);
    if (!parsed) {
        return { isValid: false, error: 'URL inválida. Use https://...' };
    }

    return {
        isValid: true,
        normalizedUrl: normalizeUrl(parsed),
    };
}

export function validateVideoPageUrl(rawUrl: string): UrlValidationResult {
    const parsed = parseHttpsUrl(rawUrl);
    if (!parsed) {
        return { isValid: false, error: 'URL inválida. Use https://...' };
    }

    const pathname = parsed.pathname.replace(/\/+$/, '');

    const isNonVideo = NON_VIDEO_PREFIXES.some(prefix => pathname.startsWith(prefix));
    if (isNonVideo) {
        return { isValid: false, error: 'URL não parece ser uma página de vídeo válida' };
    }

    return {
        isValid: true,
        normalizedUrl: normalizeUrl(parsed),
    };
}
