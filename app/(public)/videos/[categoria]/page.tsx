import { VideoGrid } from '@/components/video/video-grid';
import { Pagination } from '@/components/layout/pagination';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getVideosPaginated } from '@/lib/services/videos';
import { Folder } from 'lucide-react';
import type { VideoCardData } from '@/lib/types';
import { getThumbnailUrl } from '@/lib/utils';
import { db } from '@/lib/db';

const ITEMS_PER_PAGE = 20;

interface CategoryPageProps {
    params: Promise<{
        categoria: string;
    }>;
}

export async function generateMetadata({
    params,
}: CategoryPageProps): Promise<Metadata> {
    const { categoria: slug } = await params;

    const category = await db.category.findUnique({
        where: { slug }
    });

    if (!category) {
        return { title: 'Categoria não encontrada' };
    }

    return {
        title: `Vídeos ${category.name} - Pornô Grátis`,
        description: `Assista os melhores vídeos pornô de ${category.name}. Vídeos em HD para você.`,
        alternates: {
            canonical: `https://www.clubdaputaria.com/videos/${slug}`,
        },
        openGraph: {
            title: `Vídeos ${category.name} | Club da Putaria`,
            description: `Assista os melhores vídeos pornô de ${category.name}. Vídeos em HD para você.`,
            url: `https://www.clubdaputaria.com/videos/${slug}`,
            type: 'website',
            locale: 'pt_BR',
        },
    };
}

export const revalidate = 3600;

export default async function CategoryPage({ params }: CategoryPageProps) {
    const { categoria: slug } = await params;

    let category = null;
    try {
        category = await db.category.findUnique({
            where: { slug }
        });
    } catch (error) {
        console.error('Erro ao buscar categoria:', error);
    }

    if (!category) {
        notFound();
    }

    const { videos: videosFromDb, total } = await getVideosPaginated(1, ITEMS_PER_PAGE, {
        status: 'PUBLISHED',
        categorySlug: slug,
    });

    const videos: VideoCardData[] = videosFromDb.map((video: any) => ({
        slug: video.slug,
        title: video.metaTitle || 'Sem título',
        thumbnail: getThumbnailUrl(video),
        duration: video.duration,
        views: video.views,
        modelName: video.models[0]?.name,
    }));

    return (
        <div className="space-y-6">

            <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <Folder className="h-8 w-8 text-primary" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold">Vídeos {category.name}</h1>
                    <p className="text-muted-foreground">
                        Vídeos nesta categoria
                    </p>
                </div>
            </div>

            {videos.length > 0 ? (
                <VideoGrid videos={videos} />
            ) : (
                <div className="py-12 text-center text-muted-foreground">
                    Nenhum vídeo encontrado nesta categoria.
                </div>
            )}

            {total > ITEMS_PER_PAGE && (
                <Pagination
                    currentPage={1}
                    totalItems={total}
                    itemsPerPage={ITEMS_PER_PAGE}
                    baseUrl={`/videos/${slug}/page`}
                />
            )}
        </div>
    );
}
