import { VideoGrid } from '@/components/video/video-grid';
import { Pagination } from '@/components/layout/pagination';
import { getTrendingVideosPaginated } from '@/lib/services/videos';
import { notFound } from 'next/navigation';
import { Flame } from 'lucide-react';
import type { Metadata } from 'next';
import type { VideoCardData } from '@/lib/types';
import { getThumbnailUrl } from '@/lib/utils';

const ITEMS_PER_PAGE = 20;

interface PageProps {
  params: Promise<{
    n: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { n } = await params;
  const pageNumber = parseInt(n, 10);

  if (isNaN(pageNumber) || pageNumber < 2) {
    return {
      title: 'Bombando',
      robots: { index: false, follow: false },
    };
  }

  return {
    title: `Bombando - Pagina ${pageNumber}`,
    description: `Pagina ${pageNumber} de videos que mais bombam nas ultimas 24 horas.`,
    alternates: {
      canonical: `/bombando/page/${pageNumber}`,
    },
  };
}

export const revalidate = 300;

export default async function BombandoPaginatedPage({ params }: PageProps) {
  const { n } = await params;
  const pageNumber = parseInt(n, 10);

  if (isNaN(pageNumber) || pageNumber < 2) {
    notFound();
  }

  let videosFromDb: Awaited<ReturnType<typeof getTrendingVideosPaginated>>['videos'] = [];
  let total = 0;
  try {
    const result = await getTrendingVideosPaginated(pageNumber, ITEMS_PER_PAGE);
    videosFromDb = result.videos;
    total = result.total;
  } catch (error) {
    console.error('Erro ao buscar videos bombando paginados:', error);
  }

  const videos: VideoCardData[] = videosFromDb.map((video: any) => ({
    slug: video.slug,
    title: video.metaTitle,
    thumbnail: getThumbnailUrl(video),
    duration: video.duration,
    views: video.views,
    modelName: video.models[0]?.name,
  }));

  if (videos.length === 0) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
          <Flame className="h-8 w-8 text-orange-500" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Bombando</h1>
          <p className="text-muted-foreground">Pagina {pageNumber} - Videos em alta nas ultimas 24h</p>
        </div>
      </div>

      <VideoGrid videos={videos} />

      {total > ITEMS_PER_PAGE && (
        <Pagination
          currentPage={pageNumber}
          totalItems={total}
          itemsPerPage={ITEMS_PER_PAGE}
          baseUrl="/bombando/page"
        />
      )}
    </div>
  );
}
