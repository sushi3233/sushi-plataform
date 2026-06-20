import { VideoGrid } from '@/components/video/video-grid';
import { Pagination } from '@/components/layout/pagination';
import { getVideosPaginated } from '@/lib/services/videos';
import { Clock } from 'lucide-react';
import type { Metadata } from 'next';
import type { VideoCardData } from '@/lib/types';
import { getThumbnailUrl } from '@/lib/utils';

const ITEMS_PER_PAGE = 20;

export const metadata: Metadata = {
  title: 'Videos Recentes - Porno Gratis',
  description: 'Os videos porno mais recentes em HD. Assista as ultimas novidades do Club da Putaria.',
  alternates: {
    canonical: '/recentes',
  },
};

export const revalidate = 300;

export default async function RecentesPage() {

  let videosFromDb: any[] = [];
  let total = 0;
  try {
    const result = await getVideosPaginated(1, ITEMS_PER_PAGE, { status: 'PUBLISHED' });
    videosFromDb = result.videos;
    total = result.total;
  } catch (error) {
    console.error('Erro ao buscar videos recentes:', error);
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
          <Clock className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Videos Recentes</h1>
          <p className="text-muted-foreground">Os videos mais recentes adicionados ao site</p>
        </div>
      </div>

      <VideoGrid videos={videos} />

      {total > ITEMS_PER_PAGE && (
        <Pagination
          currentPage={1}
          totalItems={total}
          itemsPerPage={ITEMS_PER_PAGE}
          baseUrl="/recentes/page"
        />
      )}
    </div>
  );
}
