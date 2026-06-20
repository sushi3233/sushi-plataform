import { VideoGrid } from '@/components/video/video-grid';
import { Pagination } from '@/components/layout/pagination';
import { JsonLd } from '@/components/seo/json-ld';
import { getMostViewedVideosPaginated } from '@/lib/services/videos';
import type { VideoCardData } from '@/lib/types';
import { getThumbnailUrl } from '@/lib/utils';

export const revalidate = 600;

const SITE_URL = 'https://www.clubdaputaria.com';
const ITEMS_PER_PAGE = 20;

export default async function HomePage() {

  let videosFromDb: Awaited<ReturnType<typeof getMostViewedVideosPaginated>>['videos'] = [];
  let total = 0;
  try {
    const result = await getMostViewedVideosPaginated(1, ITEMS_PER_PAGE);
    videosFromDb = result.videos;
    total = result.total;
  } catch (error) {
    console.error('Erro ao buscar vídeos mais vistos:', error);

  }

  const videos: VideoCardData[] = videosFromDb.map((video: any) => {
    return {
      slug: video.slug,
      title: video.metaTitle || 'Sem título',
      thumbnail: getThumbnailUrl(video),
      duration: video.duration,
      views: video.views,
      modelName: video.models[0]?.name,
    };
  });

  return (
    <>

      <JsonLd
        type="WebSite"
        data={{
          '@id': `${SITE_URL}/#website`,
          name: 'Club da Putaria',
          url: SITE_URL,
          description: 'Os melhores vídeos pornô grátis em HD. Assista milhares de vídeos adultos brasileiros.',
          inLanguage: 'pt-BR',
          potentialAction: {
            '@type': 'SearchAction',
            target: {
              '@type': 'EntryPoint',
              urlTemplate: `${SITE_URL}/busca?q={search_term_string}`,
            },
            'query-input': 'required name=search_term_string',
          },
          publisher: {
            '@type': 'Organization',
            name: 'Club da Putaria',
            url: SITE_URL,
          },
        }}
      />

      {videos.length > 0 && (
        <JsonLd
          type="ItemList"
          data={{
            itemListElement: videos.map((video, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              url: `${SITE_URL}/${video.slug}`,
              name: video.title,
            })),
          }}
        />
      )}

      <div className="space-y-4 md:space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2">Vídeos Mais Vistos</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Assista os vídeos pornô mais vistos no site
          </p>
        </div>

        <VideoGrid videos={videos} />

        {videos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Nenhum vídeo publicado ainda. Faça upload pelo painel admin!
            </p>
          </div>
        )}

        <Pagination
          currentPage={1}
          totalItems={total}
          itemsPerPage={ITEMS_PER_PAGE}
          baseUrl="/page"
        />
      </div>
    </>
  );
}
