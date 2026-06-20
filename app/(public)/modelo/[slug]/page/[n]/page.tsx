import { VideoGrid } from '@/components/video/video-grid';
import { Pagination } from '@/components/layout/pagination';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getVideosPaginated } from '@/lib/services/videos';
import { User } from 'lucide-react';
import type { VideoCardData } from '@/lib/types';
import { getThumbnailUrl } from '@/lib/utils';
import { db } from '@/lib/db';

const ITEMS_PER_PAGE = 20;

interface ModelPaginatedPageProps {
  params: Promise<{
    slug: string;
    n: string;
  }>;
}

export async function generateMetadata({
  params,
}: ModelPaginatedPageProps): Promise<Metadata> {
  const { slug, n } = await params;
  const pageNumber = parseInt(n, 10);

  if (isNaN(pageNumber) || pageNumber < 2) {
    return {
      title: 'Modelo',
      robots: { index: false, follow: false },
    };
  }

  const model = await db.model.findUnique({
    where: { slug },
  });

  if (!model) {
    return { title: 'Modelo nao encontrada' };
  }

  return {
    title: `${model.name} - Pagina ${pageNumber}`,
    description: `Pagina ${pageNumber} de videos de ${model.name}. Assista em HD.`,
    alternates: {
      canonical: `/modelo/${slug}/page/${pageNumber}`,
    },
  };
}

export const revalidate = 3600;

export default async function ModelPaginatedPage({ params }: ModelPaginatedPageProps) {
  const { slug, n } = await params;
  const pageNumber = parseInt(n, 10);

  if (isNaN(pageNumber) || pageNumber < 2) {
    notFound();
  }

  const model = await db.model.findUnique({
    where: { slug },
  });

  if (!model) {
    notFound();
  }

  const { videos: videosFromDb, total } = await getVideosPaginated(pageNumber, ITEMS_PER_PAGE, {
    status: 'PUBLISHED',
    modelSlug: slug,
  });

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
          <User className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">{model.name}</h1>
          <p className="text-muted-foreground">Pagina {pageNumber} - Videos disponiveis</p>
        </div>
      </div>

      <VideoGrid videos={videos} />

      {total > ITEMS_PER_PAGE && (
        <Pagination
          currentPage={pageNumber}
          totalItems={total}
          itemsPerPage={ITEMS_PER_PAGE}
          baseUrl={`/modelo/${slug}/page`}
        />
      )}
    </div>
  );
}
