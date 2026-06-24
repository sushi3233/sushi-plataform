import { NextRequest, NextResponse } from 'next/server';
import { assertAdminApiAuth } from '@/lib/admin-api-auth';
import { scrapeModelPage } from '@/lib/scraper/xvideosbuceta-model-scraper';
import { validateModelPageUrl } from '@/lib/scraper/xvideosbuceta-url';

function getErrorMessage(error: unknown): string {
    return error instanceof Error ? error.message : 'Erro ao fazer discovery da pagina';
}

export async function POST(request: NextRequest) {
    const unauthorized = assertAdminApiAuth(request);
    if (unauthorized) return unauthorized;

    try {
        const body = (await request.json()) as { url?: unknown };
        const rawUrl = typeof body.url === 'string' ? body.url : '';

        if (!rawUrl) {
            return NextResponse.json({ error: 'URL e obrigatoria' }, { status: 400 });
        }

        const validation = validateModelPageUrl(rawUrl);
        if (!validation.isValid || !validation.normalizedUrl) {
            return NextResponse.json(
                { error: validation.error || 'URL invalida' },
                { status: 400 }
            );
        }

        const result = await scrapeModelPage(validation.normalizedUrl);

        if (result.totalFound === 0) {
            return NextResponse.json(
                { error: 'Nenhum video encontrado no grid principal da pagina informada.' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            videoUrls: result.videoUrls,
            totalFound: result.totalFound,
        });
    } catch (error: unknown) {
        return NextResponse.json(
            { error: getErrorMessage(error) },
            { status: 500 }
        );
    }
}
