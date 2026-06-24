import * as cheerio from 'cheerio';
import { validateVideoPageUrl } from '@/lib/scraper/xvideosbuceta-url';

export interface ModelPageResult {
    videoUrls: string[];
    totalFound: number;
}

const PRIMARY_GRID_SELECTORS = [
    '.videos a[href]',
    '.videos-list a[href]',
    '.video-list a[href]',
    '.video-grid a[href]',
    '.thumbs a[href]',
    '.thumb a[href]',
    '.thumb-block a[href]',
    '.video-item a[href]',
    'article a[href]',
];

const EXCLUDED_CONTAINER_KEYWORDS = [
    'related',
    'recommend',
    'sidebar',
    'menu',
    'nav',
    'breadcrumb',
    'pagination',
    'footer',
    'header',
];

function normalizeAndValidateVideoUrl(href: string): string | null {
    const raw = href.trim();
    if (!raw) return null;

    const fullUrl = raw.startsWith('/')
        ? `https://www.xvideosbuceta.com${raw}`
        : raw;

    if (!fullUrl.startsWith('http://') && !fullUrl.startsWith('https://')) {
        return null;
    }

    const validation = validateVideoPageUrl(fullUrl);
    return validation.isValid && validation.normalizedUrl
        ? validation.normalizedUrl
        : null;
}

function isFromExcludedContainer($: cheerio.CheerioAPI, el: Parameters<cheerio.CheerioAPI>[0]): boolean {
    const parents = $(el).parents().toArray();

    for (const parent of parents) {
        const parentEl = $(parent);
        const id = (parentEl.attr('id') || '').toLowerCase();
        const className = (parentEl.attr('class') || '').toLowerCase();
        const joined = `${id} ${className}`;

        if (EXCLUDED_CONTAINER_KEYWORDS.some(keyword => joined.includes(keyword))) {
            return true;
        }
    }

    return false;
}

function extractByPrimaryGridSelectors($: cheerio.CheerioAPI): string[] {
    const found = new Set<string>();

    for (const selector of PRIMARY_GRID_SELECTORS) {
        $(selector).each((_, el) => {
            if (isFromExcludedContainer($, el)) return;

            const href = $(el).attr('href');
            if (!href) return;

            const normalized = normalizeAndValidateVideoUrl(href);
            if (normalized) {
                found.add(normalized);
            }
        });
    }

    return Array.from(found);
}

const BROWSER_HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
    'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'none',
    'Sec-Fetch-User': '?1',
    'Cache-Control': 'max-age=0',
};

export async function scrapeModelPage(url: string): Promise<ModelPageResult> {
    const response = await fetch(url, {
        headers: {
            ...BROWSER_HEADERS,
            'Referer': 'https://www.google.com/',
        },
    });

    if (!response.ok) {
        throw new Error(`Erro ao acessar pagina da modelo: ${response.status} ${response.statusText}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    const videoUrls = extractByPrimaryGridSelectors($);

    return {
        videoUrls,
        totalFound: videoUrls.length,
    };
}
