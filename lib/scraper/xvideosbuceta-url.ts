const ALLOWED_HOSTS = new Set(['xvideosbuceta.com', 'www.xvideosbuceta.com']);

export interface UrlValidationResult {
    isValid: boolean;
    normalizedUrl?: string;
    error?: string;
}

function isAllowedHost(hostname: string): boolean {
    return ALLOWED_HOSTS.has(hostname.toLowerCase());
}

function normalizeUrl(url: URL): string {
    const pathname = url.pathname.endsWith('/') ? url.pathname : `${url.pathname}/`;
    return `https://www.xvideosbuceta.com${pathname}`;
}

export function validateModelPageUrl(rawUrl: string): UrlValidationResult {
    try {
        const parsed = new URL(rawUrl.trim());
        const pathname = parsed.pathname.replace(/\/+$/, '');

        if (!isAllowedHost(parsed.hostname)) {
            return {
                isValid: false,
                error: 'URL deve ser do domínio xvideosbuceta.com',
            };
        }

        const isActorPage = /^\/actor\/[a-z0-9-]+$/i.test(pathname);
        const isActorPagination = /^\/actor\/[a-z0-9-]+\/page\/\d+$/i.test(pathname);

        if (!isActorPage && !isActorPagination) {
            return {
                isValid: false,
                error: 'URL deve seguir o padrão /actor/{slug}/ ou /actor/{slug}/page/{n}/',
            };
        }

        return {
            isValid: true,
            normalizedUrl: normalizeUrl(parsed),
        };
    } catch {
        return {
            isValid: false,
            error: 'URL inválida',
        };
    }
}

export function validateVideoPageUrl(rawUrl: string): UrlValidationResult {
    try {
        const parsed = new URL(rawUrl.trim());
        const pathname = parsed.pathname.replace(/\/+$/, '');

        if (!isAllowedHost(parsed.hostname)) {
            return {
                isValid: false,
                error: 'URL deve ser do domínio xvideosbuceta.com',
            };
        }

        const isVideoPath =
            /^\/[a-z0-9-]{5,}$/i.test(pathname) &&
            !pathname.startsWith('/actor/') &&
            !pathname.startsWith('/actors/') &&
            !pathname.startsWith('/category/') &&
            !pathname.startsWith('/categories/') &&
            !pathname.startsWith('/tag/') &&
            !pathname.startsWith('/tags/') &&
            !pathname.startsWith('/search/') &&
            !pathname.startsWith('/page/') &&
            !pathname.startsWith('/wp-') &&
            !pathname.startsWith('/feed');

        if (!isVideoPath) {
            return {
                isValid: false,
                error: 'URL não parece ser uma página de vídeo válida',
            };
        }

        return {
            isValid: true,
            normalizedUrl: normalizeUrl(parsed),
        };
    } catch {
        return {
            isValid: false,
            error: 'URL inválida',
        };
    }
}
