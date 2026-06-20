import { VideoGrid } from '@/components/video/video-grid';
import { Pagination } from '@/components/layout/pagination';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getVideosPaginated } from '@/lib/services/videos';
import { Tag } from 'lucide-react';
import type { VideoCardData } from '@/lib/types';
import { getThumbnailUrl } from '@/lib/utils';
import { db } from '@/lib/db';

const ITEMS_PER_PAGE = 20;

interface TagPaginatedPageProps {
  params: Promise<{
    tag: string;
    n: string;
  }>;
}

export async function generateMetadata({
  params,
}: TagPaginatedPageProps): Promise<Metadata> {
  const { tag: slug, n } = await params;
  const pageNumber = parseInt(n, 10);

  if (isNaN(pageNumber) || pageNumber < 2) {
    return {
      title: 'Tag',
      robots: { index: false, follow: false },
    };
  }

  const tag = await db.tag.findUnique({
    where: { slug },
  });

  if (!tag) {
    return { title: 'Tag nao encontrada' };
  }

  return {
    title: `${tag.name} - Pagina ${pageNumber}`,
    description: `Pagina ${pageNumber} de videos com tag ${tag.name}. Assista em HD.`,
    alternates: {
      canonical: `/xxx/${slug}/page/${pageNumber}`,
    },
  };
}

export const revalidate = 3600;

export default async function TagPaginatedPage({ params }: TagPaginatedPageProps) {
  const { tag: slug, n } = await params;
  const pageNumber = parseInt(n, 10);

  if (isNaN(pageNumber) || pageNumber < 2) {
    notFound();
  }

  const tag = await db.tag.findUnique({
    where: { slug },
  });

  if (!tag) {
    notFound();
  }

  const { videos: videosFromDb, total } = await getVideosPaginated(pageNumber, ITEMS_PER_PAGE, {
    status: 'PUBLISHED',
    tagSlug: slug,
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
          <Tag className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">{tag.name}</h1>
          <p className="text-muted-foreground">Pagina {pageNumber} - Videos com a tag "{tag.name}"</p>
        </div>
      </div>

      <VideoGrid videos={videos} />

      {total > ITEMS_PER_PAGE && (
        <Pagination
          currentPage={pageNumber}
          totalItems={total}
          itemsPerPage={ITEMS_PER_PAGE}
          baseUrl={`/xxx/${slug}/page`}
        />
      )}
    </div>
  );
}
