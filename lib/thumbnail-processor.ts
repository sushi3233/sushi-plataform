import sharp from 'sharp';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const r2Client = new S3Client({
    region: 'auto',
    endpoint: process.env.CLOUDFLARE_R2_ENDPOINT || process.env.R2_ENDPOINT,
    forcePathStyle: true,
    credentials: {
        accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || process.env.R2_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || process.env.R2_SECRET_ACCESS_KEY || '',
    },
});

const R2_BUCKET = process.env.R2_BUCKET_NAME || '';
const R2_PUBLIC_URL = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || '';
const THUMBNAIL_FETCH_TIMEOUT_MS = 15000;
const THUMBNAIL_FETCH_HEADERS: HeadersInit = {

    'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
    Referer: 'https://www.xvideosbuceta.com/',
    Accept: 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
};

interface ThumbnailResult {
    url: string;
    key: string;
}

function assertR2Config(): void {
    if (!R2_BUCKET) {
        throw new Error('R2_BUCKET_NAME nao configurado');
    }

    if (!R2_PUBLIC_URL) {
        throw new Error('NEXT_PUBLIC_R2_PUBLIC_URL nao configurado');
    }
}

async function fetchImageBuffer(url: string): Promise<Buffer | null> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), THUMBNAIL_FETCH_TIMEOUT_MS);

    try {
        const response = await fetch(url, {
            signal: controller.signal,
            headers: THUMBNAIL_FETCH_HEADERS,
            cache: 'no-store',
        });

        if (!response.ok) {
            console.warn(`[ThumbnailProcessor] Thumbnail nao disponivel (${response.status}): ${url}`);
            return null;
        }

        const contentType = response.headers.get('content-type') || '';
        if (!contentType.startsWith('image/')) {
            console.warn(`[ThumbnailProcessor] Resposta nao e imagem (${contentType || 'desconhecido'}): ${url}`);
            return null;
        }

        const arrayBuffer = await response.arrayBuffer();
        if (arrayBuffer.byteLength === 0) {
            console.warn(`[ThumbnailProcessor] Thumbnail vazia: ${url}`);
            return null;
        }

        return Buffer.from(arrayBuffer);
    } catch (error) {
        console.warn(`[ThumbnailProcessor] Falha ao baixar thumbnail ${url}:`, error);
        return null;
    } finally {
        clearTimeout(timeoutId);
    }
}

export async function processAndUploadThumbnail(
    imageBuffer: Buffer,
    videoId: string
): Promise<ThumbnailResult> {
    try {
        assertR2Config();

        const processedImage = await sharp(imageBuffer)
            .resize(1280, 720, {
                fit: 'cover',
                position: 'center',
            })
            .jpeg({ quality: 86, mozjpeg: true })
            .toBuffer();

        const key = `thumbnails/${videoId}/cover.jpeg`;

        await r2Client.send(
            new PutObjectCommand({
                Bucket: R2_BUCKET,
                Key: key,
                Body: processedImage,
                ContentType: 'image/jpeg',
                CacheControl: 'public, max-age=31536000',
            })
        );

        const url = `${R2_PUBLIC_URL}/${key}`;
        return { url, key };
    } catch (error) {
        console.error(`[ThumbnailProcessor] Erro ao processar thumbnail para video ${videoId}:`, error);
        throw error;
    }
}

export async function processScrapedThumbnails(
    thumbnailUrls: string[],
    videoId: string
): Promise<ThumbnailResult | null> {
    if (thumbnailUrls.length === 0) return null;

    const maxAttempts = 5;
    const urlsToTry = thumbnailUrls.slice(0, maxAttempts);

    for (const coverUrl of urlsToTry) {
        try {
            const buffer = await fetchImageBuffer(coverUrl);
            if (!buffer) continue;

            const result = await processAndUploadThumbnail(buffer, videoId);
            console.log(`[ThumbnailProcessor] Thumbnail processada com sucesso: ${coverUrl}`);
            return result;
        } catch (error) {
            console.warn(`[ThumbnailProcessor] Falha ao tentar thumbnail ${coverUrl}:`, error);
        }
    }

    console.error(`[ThumbnailProcessor] Todas as ${urlsToTry.length} tentativas falharam para video ${videoId}`);
    return null;
}
