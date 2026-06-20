import { VideoGrid } from '@/components/video/video-grid';
import type { Metadata } from 'next';
import { getVideosPaginated } from '@/lib/services/videos';
import type { VideoCardData } from '@/lib/types';
import { getThumbnailUrl } from '@/lib/utils';

interface BuscaPageProps {
  searchParams: Promise<{
    q?: string;
  }>;
}

export async function generateMetadata({
  searchParams,
}: BuscaPageProps): Promise<Metadata> {
  const { q } = await searchParams;

  if (!q) {
    return {
      title: 'Buscar Vídeos',
      description: 'Busque por vídeos pornô no site.',
      alternates: {
        canonical: '/busca',
      },

      robots: {
        index: false,
        follow: true,
      },
    };
  }

  return {
    title: `Busca: ${q}`,
    description: `Resultados da busca por "${q}". Encontre vídeos pornô relacionados.`,

    robots: {
      index: false,
      follow: true,
    },
  };
}

export default async function BuscaPage({ searchParams }: BuscaPageProps) {
  const { q } = await searchParams;

  if (!q || q.trim().length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Buscar Vídeos</h1>
          <p className="text-muted-foreground">
            Digite algo no campo de busca acima para encontrar vídeos
          </p>
        </div>
      </div>
    );
  }

  const searchQuery = q.trim();

  const { videos: videosFromDb, total } = await getVideosPaginated(1, 50, {
    status: 'PUBLISHED',
    searchQuery,
  });

  const videoCardData: VideoCardData[] = videosFromDb.map((video: any) => ({
    slug: video.slug,
    title: video.metaTitle,
    thumbnail: getThumbnailUrl(video),
    duration: video.duration,
    views: video.views,
    modelName: video.models[0]?.name,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Busca: {searchQuery}</h1>
        <p className="text-muted-foreground">
          {videoCardData.length === 0
            ? 'Nenhum resultado encontrado'
            : `${videoCardData.length} ${videoCardData.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}`}
        </p>
      </div>

      <VideoGrid videos={videoCardData} />
    </div>
  );
}
