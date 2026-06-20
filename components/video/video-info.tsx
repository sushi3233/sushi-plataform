import { Clock, Eye, Calendar } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { VerifiedBadge } from '@/components/ui/verified-badge';
import type { VideoWithRelations } from '@/lib/types';
import { formatDuration, formatViews, formatRelativeDate } from '@/lib/utils';

interface VideoInfoProps {
  video: VideoWithRelations;
}

export function VideoInfo({ video }: VideoInfoProps) {
  return (
    <div className="space-y-4">

      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <Eye className="h-4 w-4" />
          <span>{formatViews(video.views)} visualizações</span>
        </div>

        <div className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          <span>{formatDuration(video.duration)}</span>
        </div>

        {video.publishedAt && (
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{formatRelativeDate(video.publishedAt)}</span>
          </div>
        )}
      </div>

      <Separator />

      {video.models.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase">
            Modelos
          </h3>
          <div className="flex flex-wrap gap-2">
            {video.models.map((model) => (
              <Badge key={model.id} variant="secondary" asChild>
                <Link href={`/modelo/${model.slug}`} className="inline-flex items-center gap-1">
                  {model.name}
                  <VerifiedBadge size="sm" />
                </Link>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {video.categories.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase">
            Categorias
          </h3>
          <div className="flex flex-wrap gap-2">
            {video.categories.map((category) => (
              <Badge key={category.id} variant="outline" asChild>
                <Link href={`/videos/${category.slug}`}>{category.name}</Link>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {video.tags.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase">
            Tags
          </h3>
          <div className="flex flex-wrap gap-2">
            {video.tags.map((tag) => (
              <Badge key={tag.id} variant="outline" asChild>
                <Link href={`/xxx/${tag.slug}`}>{tag.name}</Link>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {video.metaDescription && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase">
            Descrição
          </h3>
          <p className="text-sm leading-relaxed">{video.metaDescription}</p>
        </div>
      )}
    </div>
  );
}
