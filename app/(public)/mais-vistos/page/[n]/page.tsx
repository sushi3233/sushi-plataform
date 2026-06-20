import { VideoGrid } from '@/components/video/video-grid';
import { Pagination } from '@/components/layout/pagination';
import { getMostViewedVideosPaginated } from '@/lib/services/videos';
import { notFound } from 'next/navigation';
import { Eye } from 'lucide-react';
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
      title: 'Mais Vistos',
      robots: { index: false, follow: false },
    };
  }

  return {
    title: `Mais Vistos - Pagina ${pageNumber}`,
    description: `Pagina ${pageNumber} de videos porno mais vistos em HD.`,
    alternates: {
      canonical: `/mais-vistos/page/${pageNumber}`,
    },
  };
}

export const revalidate = 600;

export default async function MaisVistosPaginatedPage({ params }: PageProps) {
  const { n } = await params;
  const pageNumber = parseInt(n, 10);

  if (isNaN(pageNumber) || pageNumber < 2) {
    notFound();
  }

  let videosFromDb: Awaited<ReturnType<typeof getMostViewedVideosPaginated>>['videos'] = [];
  let total = 0;
  try {
    const result = await getMostViewedVideosPaginated(pageNumber, ITEMS_PER_PAGE);
    videosFromDb = result.videos;
    total = result.total;
  } catch (error) {
    console.error('Erro ao buscar videos mais vistos paginados:', error);
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
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Eye className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Mais Vistos</h1>
          <p className="text-muted-foreground">Pagina {pageNumber} - Os videos mais populares</p>
        </div>
      </div>

      <VideoGrid videos={videos} />

      {total > ITEMS_PER_PAGE && (
        <Pagination
          currentPage={pageNumber}
          totalItems={total}
          itemsPerPage={ITEMS_PER_PAGE}
          baseUrl="/mais-vistos/page"
        />
      )}
    </div>
  );
}
