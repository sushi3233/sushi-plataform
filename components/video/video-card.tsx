import Link from 'next/link';
import Image from 'next/image';
import { Clock, Eye } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { VerifiedBadge } from '@/components/ui/verified-badge';
import type { VideoCardData } from '@/lib/types';
import { formatDuration, formatViews } from '@/lib/utils';

interface VideoCardProps {
  video: VideoCardData;
}

export function VideoCard({ video }: VideoCardProps) {
  return (
    <Link href={`/${video.slug}`} className="group">
      <Card className="overflow-hidden border-0 shadow-sm transition-all hover:shadow-md hover:scale-[1.02]">

        <div className="relative aspect-video overflow-hidden bg-muted">
          {video.thumbnail ? (
            <Image
              src={video.thumbnail}
              alt={video.title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              Sem thumbnail
            </div>
          )}

          <Badge
            variant="secondary"
            className="absolute bottom-2 right-2 bg-black/80 text-white hover:bg-black/80"
          >
            <Clock className="h-3 w-3" />
            {formatDuration(video.duration)}
          </Badge>
        </div>

        <div className="p-2 md:p-3 space-y-1">

          <h3 className="font-semibold text-xs sm:text-sm line-clamp-2 md:line-clamp-2 group-hover:text-primary transition-colors leading-tight">
            {video.title}
          </h3>

          <div className="flex items-center justify-between text-[10px] sm:text-xs text-muted-foreground gap-1">
            <div className="flex items-center gap-1 shrink-0">
              <Eye className="h-3 w-3" />
              <span>{formatViews(video.views)}</span>
            </div>

            {video.modelName && (
              <span className="inline-flex items-center gap-1 truncate min-w-0 flex-1 justify-end">
                <span className="truncate">{video.modelName}</span>
                <VerifiedBadge size="sm" />
              </span>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}
