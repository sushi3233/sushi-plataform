import type { VideoCardData } from '@/lib/types';
import { VideoGrid } from './video-grid';

interface RelatedVideosProps {
  videos: VideoCardData[];
  title?: string;
}

export function RelatedVideos({
  videos,
  title = 'Vídeos Relacionados',
}: RelatedVideosProps) {
  if (videos.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4">
      <h2 className="text-xl md:text-2xl font-bold">{title}</h2>
      <VideoGrid videos={videos} columns="compact" />
    </section>
  );
}
