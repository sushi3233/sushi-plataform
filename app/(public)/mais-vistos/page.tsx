import { VideoGrid } from '@/components/video/video-grid';
import { Pagination } from '@/components/layout/pagination';
import { getMostViewedVideosPaginated } from '@/lib/services/videos';
import { Eye } from 'lucide-react';
import type { Metadata } from 'next';
import type { VideoCardData } from '@/lib/types';
import { getThumbnailUrl } from '@/lib/utils';

const ITEMS_PER_PAGE = 20;

export const metadata: Metadata = {
  title: 'Mais Vistos - Videos Porno Populares',
  description: 'Os videos porno mais vistos de todos os tempos. Assista gratis em HD os videos mais populares.',
  alternates: {
    canonical: '/mais-vistos',
  },
};

export const revalidate = 600;

export default async function MaisVistosPage() {
  let videosFromDb: Awaited<ReturnType<typeof getMostViewedVideosPaginated>>['videos'] = [];
  let total = 0;
  try {
    const result = await getMostViewedVideosPaginated(1, ITEMS_PER_PAGE);
    videosFromDb = result.videos;
    total = result.total;
  } catch (error) {
    console.error('Erro ao buscar videos mais vistos:', error);
  }

  const videos: VideoCardData[] = videosFromDb.map((video: any) => ({
    slug: video.slug,
    title: video.metaTitle || 'Sem titulo',
    thumbnail: getThumbnailUrl(video),
    duration: video.duration,
    views: video.views,
    modelName: video.models[0]?.name,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Eye className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Mais Vistos</h1>
          <p className="text-muted-foreground">Os videos mais populares de todos os tempos</p>
        </div>
      </div>

      <VideoGrid videos={videos} />

      {total > ITEMS_PER_PAGE && (
        <Pagination
          currentPage={1}
          totalItems={total}
          itemsPerPage={ITEMS_PER_PAGE}
          baseUrl="/mais-vistos/page"
        />
      )}
    </div>
  );
}
