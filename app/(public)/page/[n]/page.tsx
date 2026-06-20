import { VideoGrid } from '@/components/video/video-grid';
import { Pagination } from '@/components/layout/pagination';
import { getMostViewedVideosPaginated } from '@/lib/services/videos';
import { notFound } from 'next/navigation';
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
    description: `Pagina ${pageNumber} dos videos porno mais vistos em HD.`,
    alternates: {
      canonical: `/page/${pageNumber}`,
    },
  };
}

export const revalidate = 600;

export default async function PaginatedHomePage({ params }: PageProps) {
  const { n } = await params;
  const pageNumber = parseInt(n, 10);

  if (isNaN(pageNumber) || pageNumber < 2) {
    notFound();
  }

  let videosFromDb: any[] = [];
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
      <div>
        <h1 className="text-3xl font-bold mb-2">Videos Mais Vistos - Pagina {pageNumber}</h1>
        <p className="text-muted-foreground">Assista os videos porno mais vistos no site</p>
      </div>

      <VideoGrid videos={videos} />

      <Pagination
        currentPage={pageNumber}
        totalItems={total}
        itemsPerPage={ITEMS_PER_PAGE}
        baseUrl="/page"
      />
    </div>
  );
}
