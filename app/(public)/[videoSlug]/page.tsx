import { VideoPlayer } from '@/components/video/video-player';
import { VideoInfo } from '@/components/video/video-info';
import { RelatedVideos } from '@/components/video/related-videos';
import { ShareButton } from '@/components/video/share-button';
import { JsonLd } from '@/components/seo/json-ld';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getVideoBySlug, getRecentVideos } from '@/lib/services/videos';
import type { VideoCardData } from '@/lib/types';
import { getThumbnailUrl } from '@/lib/utils';

export const revalidate = 3600;

const SITE_URL = 'https://www.xvideosprime.com';

interface VideoPageProps {
  params: Promise<{
    videoSlug: string;
  }>;
}

export async function generateMetadata({
  params,
}: VideoPageProps): Promise<Metadata> {
  const { videoSlug } = await params;
  let video = null;
  try {
    video = await getVideoBySlug(videoSlug) as any;
  } catch (error) {
    console.error('Erro ao buscar vídeo para metadata:', error);
  }

  if (!video) {
    return {
      title: 'Vídeo não encontrado',
    };
  }

  const coverThumbnail = getThumbnailUrl(video);

  return {
    title: video.metaTitle,
    description: video.metaDescription,
    alternates: {
      canonical: `${SITE_URL}/${videoSlug}`,
    },
    openGraph: {
      title: video.metaTitle,
      description: video.metaDescription,
      type: 'video.other',
      url: `${SITE_URL}/${videoSlug}`,
      siteName: 'Xvideos Prime',
      locale: 'pt_BR',
      images: coverThumbnail
        ? [{ url: coverThumbnail, width: 1280, height: 720, alt: video.metaTitle }]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: video.metaTitle,
      description: video.metaDescription,
      images: coverThumbnail ? [coverThumbnail] : undefined,
    },
  };
}

export default async function VideoPage({ params }: VideoPageProps) {
  const { videoSlug } = await params;
  let video = null;
  try {
    video = await getVideoBySlug(videoSlug) as any;
  } catch (error) {
    console.error('Erro ao buscar vídeo:', error);
  }

  if (!video) {
    notFound();
  }

  const videoThumbnail = getThumbnailUrl(video);

  const telegramBotUrl = process.env.NEXT_PUBLIC_TELEGRAM_BOT_URL || 'https://t.me/club_daputaria_bot';

  const relatedVideosFromDb = await getRecentVideos(12);
  const relatedVideoCards: VideoCardData[] = (relatedVideosFromDb as any[])
    .filter((v) => v.id !== video.id)
    .map((v) => ({
      slug: v.slug,
      title: v.metaTitle || 'Sem título',
      thumbnail: getThumbnailUrl(v),
      duration: v.duration,
      views: v.views,
      modelName: v.models[0]?.name,
    }));

  const hours = Math.floor(video.duration / 3600);
  const minutes = Math.floor((video.duration % 3600) / 60);
  const seconds = video.duration % 60;
  let isoDuration = 'PT';
  if (hours > 0) isoDuration += `${hours}H`;
  if (minutes > 0) isoDuration += `${minutes}M`;
  if (seconds > 0 || isoDuration === 'PT') isoDuration += `${seconds}S`;

  return (
    <>

      <JsonLd
        type="VideoObject"
        data={{
          '@id': `${SITE_URL}/${videoSlug}#video`,
          name: video.metaTitle,
          description: video.metaDescription,
          thumbnailUrl: videoThumbnail ? [videoThumbnail] : [],

          contentUrl: `${SITE_URL}/${videoSlug}`,

          embedUrl: `${SITE_URL}/${videoSlug}`,
          uploadDate: video.publishedAt?.toISOString(),
          duration: isoDuration,
          interactionStatistic: {
            '@type': 'InteractionCounter',
            interactionType: 'https://schema.org/WatchAction',
            userInteractionCount: video.views,
          },
          publisher: {
            '@type': 'Organization',
            name: 'Xvideos Prime',
            url: SITE_URL,
            logo: {
              '@type': 'ImageObject',
              url: `${SITE_URL}/favicon.ico`,
            },
          },
        }}
      />

      <JsonLd
        type="BreadcrumbList"
        data={{
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Início',
              item: SITE_URL,
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: video.h1Title || video.metaTitle,
              item: `${SITE_URL}/${videoSlug}`,
            },
          ],
        }}
      />

      <div className="space-y-6">

        <h1 className="text-2xl md:text-3xl font-bold">
          {video.h1Title || video.metaTitle || 'Vídeo sem título'}
        </h1>

        <div className="max-w-4xl mx-auto lg:mx-0 space-y-4">
          <VideoPlayer
            embed={video.embed ? {
              hlsUrl: video.embed.hlsUrl,
              posterUrl: videoThumbnail || '',
              videoId: video.id
            } : null}
            title={video.h1Title || video.metaTitle || 'Vídeo'}
          />

          <div className="flex justify-center md:justify-start">
            <a
              href={telegramBotUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-blue-500/25 transition-all active:scale-95"
            >
              <div className="flex items-center justify-center w-8 h-8 bg-white/20 rounded-full group-hover:rotate-12 transition-transform">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.13-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
                </svg>
              </div>
              <span>Putaria no Telegram</span>
            </a>
          </div>
        </div>

        <VideoInfo video={video} />

        <ShareButton
          url={`${SITE_URL}/${videoSlug}`}
          title={video.metaTitle || 'Vídeo'}
        />

        {relatedVideoCards.length > 0 && (
          <RelatedVideos videos={relatedVideoCards} />
        )}
      </div>
    </>
  );
}
