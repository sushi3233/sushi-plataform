import { VideoGrid } from '@/components/video/video-grid';
import { Pagination } from '@/components/layout/pagination';
import { getTrendingVideosPaginated } from '@/lib/services/videos';
import { Flame } from 'lucide-react';
import type { Metadata } from 'next';
import type { VideoCardData } from '@/lib/types';
import { getThumbnailUrl } from '@/lib/utils';

const ITEMS_PER_PAGE = 20;

export const metadata: Metadata = {
    title: 'Bombando - Vídeos em Alta',
    description: 'Os vídeos pornô que estão bombando nas últimas 24 horas. Assista grátis em HD.',
    alternates: {
        canonical: '/bombando',
    },
};

export const revalidate = 300;

export default async function BombandoPage() {

    let videosFromDb: Awaited<ReturnType<typeof getTrendingVideosPaginated>>['videos'] = [];
    let total = 0;
    try {
        const result = await getTrendingVideosPaginated(1, ITEMS_PER_PAGE);
        videosFromDb = result.videos;
        total = result.total;
    } catch (error) {
        console.error('Erro ao buscar vídeos bombando:', error);

    }

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
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
                    <Flame className="h-8 w-8 text-orange-500" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold">Bombando </h1>
                    <p className="text-muted-foreground">
                        Os vídeos mais vistos nas últimas 24 horas
                    </p>
                </div>
            </div>

            <VideoGrid videos={videos} />

            {total > ITEMS_PER_PAGE && (
                <Pagination
                    currentPage={1}
                    totalItems={total}
                    itemsPerPage={ITEMS_PER_PAGE}
                    baseUrl="/bombando/page"
                />
            )}
        </div>
    );
}
