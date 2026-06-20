import { VideoGrid } from '@/components/video/video-grid';
import { Pagination } from '@/components/layout/pagination';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getVideosPaginated } from '@/lib/services/videos';
import { Folder } from 'lucide-react';
import type { VideoCardData } from '@/lib/types';
import { getThumbnailUrl } from '@/lib/utils';
import { db } from '@/lib/db';

const ITEMS_PER_PAGE = 20;

interface CategoryPaginatedPageProps {
  params: Promise<{
    categoria: string;
    n: string;
  }>;
}

export async function generateMetadata({
  params,
}: CategoryPaginatedPageProps): Promise<Metadata> {
  const { categoria: slug, n } = await params;
  const pageNumber = parseInt(n, 10);

  if (isNaN(pageNumber) || pageNumber < 2) {
    return {
      title: 'Categoria',
      robots: { index: false, follow: false },
    };
  }

  const category = await db.category.findUnique({
    where: { slug },
  });

  if (!category) {
    return { title: 'Categoria nao encontrada' };
  }

  return {
    title: `Videos ${category.name} - Pagina ${pageNumber}`,
    description: `Pagina ${pageNumber} de videos porno ${category.name}. Assista em HD.`,
    alternates: {
      canonical: `/videos/${slug}/page/${pageNumber}`,
    },
  };
}

export const revalidate = 3600;

export default async function CategoryPaginatedPage({ params }: CategoryPaginatedPageProps) {
  const { categoria: slug, n } = await params;
  const pageNumber = parseInt(n, 10);

  if (isNaN(pageNumber) || pageNumber < 2) {
    notFound();
  }

  const category = await db.category.findUnique({
    where: { slug },
  });

  if (!category) {
    notFound();
  }

  const { videos: videosFromDb, total } = await getVideosPaginated(pageNumber, ITEMS_PER_PAGE, {
    status: 'PUBLISHED',
    categorySlug: slug,
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
          <Folder className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Videos {category.name}</h1>
          <p className="text-muted-foreground">Pagina {pageNumber} - Videos nesta categoria</p>
        </div>
      </div>

      <VideoGrid videos={videos} />

      {total > ITEMS_PER_PAGE && (
        <Pagination
          currentPage={pageNumber}
          totalItems={total}
          itemsPerPage={ITEMS_PER_PAGE}
          baseUrl={`/videos/${slug}/page`}
        />
      )}
    </div>
  );
}
