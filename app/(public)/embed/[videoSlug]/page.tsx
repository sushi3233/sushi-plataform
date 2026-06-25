import { VideoPlayer } from '@/components/video/video-player';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getVideoBySlug } from '@/lib/services/videos';
import { getThumbnailUrl } from '@/lib/utils';

export const revalidate = 3600;

const SITE_URL = 'https://www.xvideosprime.com';

interface EmbedPageProps {
  params: Promise<{
    videoSlug: string;
  }>;
}

export async function generateMetadata({
  params,
}: EmbedPageProps): Promise<Metadata> {
  const { videoSlug } = await params;
  let video = null;
  try {
    video = await getVideoBySlug(videoSlug);
  } catch (error) {
    console.error('Erro ao buscar vídeo para metadata:', error);
  }

  if (!video) {
    return {
      title: 'Vídeo não encontrado',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const coverThumbnail = getThumbnailUrl(video);

  return {
    title: video.metaTitle,
    description: video.metaDescription,
    robots: {
      index: false,
      follow: true,
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
  };
}

export default async function EmbedPage({ params }: EmbedPageProps) {
  const { videoSlug } = await params;
  let video = null;
  try {
    video = await getVideoBySlug(videoSlug);
  } catch (error) {
    console.error('Erro ao buscar vídeo:', error);
  }

  if (!video) {
    notFound();
  }

  const videoThumbnail = getThumbnailUrl(video);

  return (
    <div className="w-full h-screen bg-black flex flex-col">

      <div className="flex-1">
        <VideoPlayer
          embed={video.embed ? {
            hlsUrl: video.embed.hlsUrl,
            posterUrl: videoThumbnail || '',
            videoId: video.id
          } : null}
          title={video.h1Title || video.metaTitle || 'Vídeo'}
        />
      </div>

      <div className="bg-black/90 px-4 py-2 flex items-center justify-between text-white text-sm border-t border-white/10">
        <div className="flex items-center gap-2">
          <span className="font-semibold">{video.metaTitle}</span>
        </div>
        <a
          href={`${SITE_URL}/${videoSlug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300 transition-colors"
        >
          Ver no Xvideos Prime →
        </a>
      </div>
    </div>
  );
}
