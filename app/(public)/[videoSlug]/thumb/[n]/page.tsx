import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getVideoBySlug } from '@/lib/services/videos';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ThumbnailPageProps {
    params: Promise<{
        videoSlug: string;
        n: string;
    }>;
}

export async function generateMetadata({
    params,
}: ThumbnailPageProps): Promise<Metadata> {
    const { videoSlug, n } = await params;
    const thumbnailIndex = parseInt(n, 10);

    if (isNaN(thumbnailIndex) || thumbnailIndex !== 1) {
        return { title: 'Thumbnail não encontrada' };
    }

    try {
        const video = await getVideoBySlug(videoSlug);
        if (!video) return { title: 'Vídeo não encontrado' };

        const thumbnail = video.thumbnail;
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.xvideosprime.com';

        return {
            title: `${video.metaTitle} - Foto`,
            description: `Veja a foto de ${video.metaTitle}. ${video.metaDescription}`,
            alternates: {
                canonical: `${siteUrl}/${videoSlug}`,
            },
            openGraph: {
                title: `${video.metaTitle} - Foto`,
                description: video.metaDescription || '',
                type: 'article',
                images: thumbnail
                    ? [{ url: thumbnail.url, width: 1280, height: 720, alt: video.metaTitle || 'Video Thumbnail' }]
                    : undefined,
            },
            robots: {
                index: false,
                follow: true,
            },
        };
    } catch (error) {
        return { title: 'Vídeo não encontrado' };
    }
}

export default async function ThumbnailPage({ params }: ThumbnailPageProps) {
    const { videoSlug, n } = await params;
    const thumbnailIndex = parseInt(n, 10);

    if (isNaN(thumbnailIndex) || thumbnailIndex !== 1) {
        notFound();
    }

    try {
        const video = await getVideoBySlug(videoSlug);
        if (!video) notFound();

        const thumbnail = video.thumbnail;
        const thumbnailUrl = thumbnail?.url || video.embed?.originalPosterUrl;

        return (
            <div className="space-y-6">

                <div className="flex items-center justify-between">
                    <Link href={`/${videoSlug}`}>
                        <Button variant="ghost" size="sm" className="gap-1">
                            <ArrowLeft className="h-4 w-4" />
                            Voltar ao vídeo
                        </Button>
                    </Link>

                    <Badge variant="secondary">
                        Foto do vídeo
                    </Badge>
                </div>

                <div>
                    <h1 className="text-2xl font-bold">{video.metaTitle}</h1>
                    <p className="text-muted-foreground">Thumbnail do vídeo</p>
                </div>

                <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
                    {thumbnailUrl ? (
                        <Image
                            src={thumbnailUrl}
                            alt={`${video.metaTitle} - Foto`}
                            fill
                            className="object-cover"
                            priority
                            sizes="100vw"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                            Thumbnail não disponível
                        </div>
                    )}
                </div>

                <div className="rounded-lg bg-primary/10 p-4 text-center">
                    <p className="mb-2 text-sm text-muted-foreground">
                        Gostou da foto? Assista ao vídeo completo!
                    </p>
                    <Link href={`/${videoSlug}`}>
                        <Button>Assistir Vídeo</Button>
                    </Link>
                </div>
            </div>
        );
    } catch (error) {
        notFound();
    }
}
