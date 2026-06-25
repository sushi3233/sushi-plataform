import { VideoGrid } from '@/components/video/video-grid';
import { Pagination } from '@/components/layout/pagination';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getVideosPaginated } from '@/lib/services/videos';
import { User } from 'lucide-react';
import { VerifiedBadge } from '@/components/ui/verified-badge';
import type { VideoCardData } from '@/lib/types';
import { getThumbnailUrl } from '@/lib/utils';
import { db } from '@/lib/db';

const ITEMS_PER_PAGE = 20;

export const revalidate = 3600;

interface ModelPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateMetadata({
    params,
}: ModelPageProps): Promise<Metadata> {
    const { slug } = await params;

    const model = await db.model.findUnique({
        where: { slug }
    });

    if (!model) {
        return { title: 'Modelo não encontrada' };
    }

    return {
        title: `${model.name} - Vídeos Pornô`,
        description: `Assista todos os vídeos de ${model.name}. Vídeos disponíveis em HD.`,
        alternates: {
            canonical: `https://www.xvideosprime.com/modelo/${slug}`,
        },
        openGraph: {
            title: `${model.name} — Todos os Vídeos | Xvideos Prime`,
            description: `Assista todos os vídeos de ${model.name}. Vídeos disponíveis em HD.`,
            url: `https://www.xvideosprime.com/modelo/${slug}`,
            type: 'website',
            locale: 'pt_BR',
        },
    };
}

export default async function ModelPage({ params }: ModelPageProps) {
    const { slug } = await params;

    const model = await db.model.findUnique({
        where: { slug }
    });

    if (!model) {
        notFound();
    }

    const { videos: videosFromDb, total } = await getVideosPaginated(1, ITEMS_PER_PAGE, {
        status: 'PUBLISHED',
        modelSlug: slug,
    });

    const videos: VideoCardData[] = videosFromDb.map((video: any) => ({
        slug: video.slug,
        title: video.metaTitle || 'Sem título',
        thumbnail: getThumbnailUrl(video),
        duration: video.duration,
        views: video.views,
        modelName: video.models[0]?.name,
    }));

    return (
        <div className="space-y-6">

            <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <User className="h-8 w-8 text-primary" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold inline-flex items-center gap-2">
                        {model.name}
                        <VerifiedBadge size="lg" />
                    </h1>
                    <p className="text-muted-foreground">
                        Vídeos disponíveis
                    </p>
                </div>
            </div>

            {videos.length > 0 ? (
                <VideoGrid videos={videos} />
            ) : (
                <div className="py-12 text-center text-muted-foreground">
                    Nenhum vídeo encontrado para esta modelo.
                </div>
            )}

            {total > ITEMS_PER_PAGE && (
                <Pagination
                    currentPage={1}
                    totalItems={total}
                    itemsPerPage={ITEMS_PER_PAGE}
                    baseUrl={`/modelo/${slug}/page`}
                />
            )}
        </div>
    );
}
