import type { VideoCardData } from '@/lib/types';
import { VideoCard } from './video-card';

interface VideoGridProps {
  videos: VideoCardData[];
  columns?: 'default' | 'compact';
}

export function VideoGrid({ videos, columns = 'default' }: VideoGridProps) {
  const gridClass =
    columns === 'compact'
      ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3'
      : 'grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 md:gap-4';

  if (videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground text-lg">
          Nenhum vídeo encontrado
        </p>
      </div>
    );
  }

  return (
    <div className={gridClass}>
      {videos.map((video) => (
        <VideoCard key={video.slug} video={video} />
      ))}
    </div>
  );
}
