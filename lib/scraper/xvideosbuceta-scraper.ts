import * as cheerio from 'cheerio';

export interface ScrapedVideo {
    title: string;
    duration: number;
    models: string[];
    categories: string[];
    tags: string[];
    vazounudesUUID: string;
    hlsUrl: string;
    iframeUrl: string;
    thumbnailUrls: string[];
}

export async function scrapeXvideosBuceta(url: string): Promise<ScrapedVideo> {
    try {

        const response = await fetch(url, {
            headers: {
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
                'Referer': 'https://www.google.com/',
            },
        });

        if (!response.ok) {
            throw new Error(`Erro ao acessar URL: ${response.statusText}`);
        }

        const html = await response.text();
        const $ = cheerio.load(html);

        const title = $('h1.title').text().trim() || $('title').text().trim();

        const durationText = $('.duration').text().trim();
        const duration = parseDuration(durationText);

        const models: string[] = [];
        $('.models a, .pornstars a').each((_, el) => {
            const modelName = $(el).text().trim();
            if (modelName) models.push(modelName);
        });

        const categories: string[] = [];
        $('.categories a, .category a').each((_, el) => {
            const categoryName = $(el).text().trim();
            if (categoryName) categories.push(categoryName);
        });

        const tags: string[] = [];
        $('.tags a, .tag a').each((_, el) => {
            const tagName = $(el).text().trim();
            if (tagName) tags.push(tagName);
        });

        let vazounudesUUID = '';

        const iframeSrc1 = $('iframe[src*="vazounudes"]').attr('src') || '';
        const uuidMatch1 = iframeSrc1.match(/[?&]id=([a-f0-9-]{36})/i)
            || iframeSrc1.match(/\/([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})\//i);
        if (uuidMatch1) {
            vazounudesUUID = uuidMatch1[1];
        }

        if (!vazounudesUUID) {
            $('script').each((_, el) => {
                const scriptContent = $(el).html() || '';
                const match = scriptContent.match(
                    /vazounudes[^'"]*\/([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})/i
                );
                if (match) {
                    vazounudesUUID = match[1];
                    return false;
                }
            });
        }

        if (!vazounudesUUID) {
            const globalMatch = html.match(
                /vazounudes[^"']*\/([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})/i
            );
            if (globalMatch) {
                vazounudesUUID = globalMatch[1];
            }
        }

        if (!vazounudesUUID) {
            throw new Error('UUID do vazounudes.net não encontrado na página. O vídeo pode não estar disponível ou o formato do site mudou.');
        }

        const hlsUrl = `https://vazounudes.net/hls/${vazounudesUUID}/playlist.m3u8`;
        const iframeUrl = `https://xxx.vazounudes.net/video/video-player.php?id=${vazounudesUUID}`;

        const thumbnailUrls: string[] = [];
        for (let i = 1; i <= 20; i++) {
            thumbnailUrls.push(`https://vazounudes.net/hls/${vazounudesUUID}/thumbnail_${i}.jpg`);
        }

        return {
            title,
            duration,
            models,
            categories,
            tags,
            vazounudesUUID,
            hlsUrl,
            iframeUrl,
            thumbnailUrls,
        };
    } catch (error) {
        console.error('[Scraper] Erro ao fazer scraping:', error);
        throw error;
    }
}

function parseDuration(durationText: string): number {
    const parts = durationText.split(':').map((p) => parseInt(p, 10));

    if (parts.length === 2) {

        return parts[0] * 60 + parts[1];
    } else if (parts.length === 3) {

        return parts[0] * 3600 + parts[1] * 60 + parts[2];
    }

    return 0;
}
