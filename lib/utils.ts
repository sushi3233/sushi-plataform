import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function formatViews(count: number): string {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`;
  return count.toString();
}

export function formatRelativeDate(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'hoje';
  if (diffDays === 1) return 'ontem';
  if (diffDays < 7) return `há ${diffDays} dias`;
  if (diffDays < 30) return `há ${Math.floor(diffDays / 7)} semanas`;
  return `há ${Math.floor(diffDays / 30)} meses`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function getThumbnailUrl(video: any): string {
  const r2Thumb = video.thumbnail?.url;
  const originalPoster = video.embed?.originalPosterUrl;
  const sourceId = video.embed?.sourceId || video.embed?.originalId;

  if (r2Thumb && !r2Thumb.includes('placehold.co')) {
    return r2Thumb;
  }

  if (video.embed?.sourcePlatform === 'vazounudes' && sourceId && video.slug) {
    return `/api/thumb/${video.slug}/1`;
  }

  if (originalPoster && !originalPoster.includes('placehold.co')) {
    return originalPoster;
  }

  return r2Thumb || originalPoster || '';
}
