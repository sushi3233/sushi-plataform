import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { assertAdminApiAuth } from '@/lib/admin-api-auth';
import { getPublicUrl } from '@/lib/services/r2';

const r2Client = new S3Client({
    region: 'auto',
    endpoint: process.env.CLOUDFLARE_R2_ENDPOINT || process.env.R2_ENDPOINT,
    forcePathStyle: true,
    credentials: {
        accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || process.env.R2_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || process.env.R2_SECRET_ACCESS_KEY || '',
    },
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME || '';

function getErrorMessage(error: unknown): string {
    return error instanceof Error ? error.message : 'Erro interno no upload';
}

function generateThumbnailKey(originalName: string): string {
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 10);
    const ext = originalName.split('.').pop()?.toLowerCase() || 'jpg';
    return `thumbnails/${timestamp}-${randomStr}.${ext}`;
}

export async function POST(request: NextRequest) {
    const unauthorized = assertAdminApiAuth(request);
    if (unauthorized) return unauthorized;

    try {
        const formData = await request.formData();
        const fileField = formData.get('thumbnail');

        if (!(fileField instanceof File)) {
            return NextResponse.json(
                { error: 'Nenhum arquivo enviado' },
                { status: 400 }
            );
        }

        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(fileField.type)) {
            return NextResponse.json(
                { error: 'Tipo de arquivo nao permitido. Use: JPEG, PNG ou WebP' },
                { status: 400 }
            );
        }

        const MAX_SIZE = 5 * 1024 * 1024;
        if (fileField.size > MAX_SIZE) {
            return NextResponse.json(
                { error: 'Arquivo muito grande. Maximo: 5MB' },
                { status: 400 }
            );
        }

        const key = generateThumbnailKey(fileField.name);
        const arrayBuffer = await fileField.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        await r2Client.send(
            new PutObjectCommand({
                Bucket: BUCKET_NAME,
                Key: key,
                Body: buffer,
                ContentType: fileField.type,
                CacheControl: 'public, max-age=31536000',
            })
        );

        return NextResponse.json({
            success: true,
            url: getPublicUrl(key),
            key,
        });
    } catch (error: unknown) {
        return NextResponse.json(
            { error: getErrorMessage(error) },
            { status: 500 }
        );
    }
}
