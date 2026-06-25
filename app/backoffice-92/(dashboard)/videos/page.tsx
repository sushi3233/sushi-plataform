import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { getVideosPaginated } from '@/lib/services/videos';
import { formatDuration } from '@/lib/utils';
import { DeleteVideoButton } from '@/components/admin/delete-video-button';

export const dynamic = 'force-dynamic';

interface AdminVideosPageProps {
    searchParams: Promise<{
        page?: string;
        perPage?: string;
        model?: string;
    }>;
}

const ALLOWED_PER_PAGE = new Set([20, 50, 100]);

function parsePositiveInt(value: string | undefined, fallback: number): number {
    const parsed = Number.parseInt(value || '', 10);
    return Number.isNaN(parsed) || parsed <= 0 ? fallback : parsed;
}

function buildAdminVideosHref(page: number, perPage: number, modelSlug?: string): string {
    const params = new URLSearchParams();
    if (page > 1) params.set('page', String(page));
    if (perPage !== 20) params.set('perPage', String(perPage));
    if (modelSlug) params.set('model', modelSlug);
    const query = params.toString();
    return query ? `/backoffice-92/videos?${query}` : '/backoffice-92/videos';
}

export default async function AdminVideosPage({ searchParams }: AdminVideosPageProps) {
    const params = await searchParams;
    const requestedPage = parsePositiveInt(params.page, 1);
    const requestedPerPage = parsePositiveInt(params.perPage, 20);
    const perPage = ALLOWED_PER_PAGE.has(requestedPerPage) ? requestedPerPage : 20;
    const modelSlug = typeof params.model === 'string' ? params.model.trim() : '';

    let currentPage = requestedPage;
    let totalPages = 0;
    let total = 0;
    let videos: Awaited<ReturnType<typeof getVideosPaginated>>['videos'] = [];

    try {
        let result = await getVideosPaginated(currentPage, perPage, {
            modelSlug: modelSlug || undefined,
        });

        if (result.totalPages > 0 && currentPage > result.totalPages) {
            currentPage = result.totalPages;
            result = await getVideosPaginated(currentPage, perPage, {
                modelSlug: modelSlug || undefined,
            });
        }

        videos = result.videos;
        total = result.total;
        totalPages = result.totalPages;

        if (totalPages === 0) {
            currentPage = 1;
        }
    } catch (error) {
        console.error('Erro ao buscar vídeos:', error);
    }

    const startItem = total === 0 ? 0 : (currentPage - 1) * perPage + 1;
    const endItem = Math.min(currentPage * perPage, total);
    const hasPrev = currentPage > 1;
    const hasNext = totalPages > 0 && currentPage < totalPages;

    return (
        <div className="space-y-6">

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Vídeos</h1>
                    <p className="text-muted-foreground">Gerencie todos os vídeos da plataforma</p>
                </div>
                <Link href="/backoffice-92/videos/novo-hls">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Novo Vídeo
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader className="space-y-3">
                    <CardTitle>
                        {modelSlug ? `Vídeos da modelo "${modelSlug}" (${total})` : `Todos os Vídeos (${total})`}
                    </CardTitle>
                    {modelSlug && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>Filtro ativo por modelo: {modelSlug}</span>
                            <Button size="sm" variant="outline" asChild>
                                <Link href={buildAdminVideosHref(1, perPage)}>Limpar filtro</Link>
                            </Button>
                        </div>
                    )}
                    <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                        <span>Itens por página:</span>
                        {[20, 50, 100].map((size) => {
                            const active = size === perPage;
                            return (
                                <Button
                                    key={size}
                                    size="sm"
                                    variant={active ? 'default' : 'outline'}
                                    asChild={!active}
                                    disabled={active}
                                >
                                    {active ? (
                                        <span>{size}</span>
                                    ) : (
                                        <Link href={buildAdminVideosHref(1, size, modelSlug || undefined)}>{size}</Link>
                                    )}
                                </Button>
                            );
                        })}
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border">
                                    <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Título</th>
                                    <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Duração</th>
                                    <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Views</th>
                                    <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                                    <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Modelos</th>
                                    <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Categorias</th>
                                    <th className="pb-3 text-right text-sm font-medium text-muted-foreground">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {videos.map((video) => {
                                    const title = video.metaTitle || 'Sem título';

                                    return (
                                        <tr key={video.id} className="border-b border-border last:border-0">
                                            <td className="py-4 text-sm font-medium text-foreground">
                                                <div className="flex flex-col">
                                                    <span>{title}</span>
                                                    <span className="text-xs text-muted-foreground">/{video.slug}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 text-sm text-muted-foreground">
                                                {formatDuration(video.duration)}
                                            </td>
                                            <td className="py-4 text-sm text-foreground">
                                                <div className="flex items-center">
                                                    <Eye className="mr-1 h-3 w-3 text-muted-foreground" />
                                                    {video.views.toLocaleString()}
                                                </div>
                                            </td>
                                            <td className="py-4">
                                                <Badge
                                                    variant={video.status === 'PUBLISHED' ? 'default' : 'secondary'}
                                                >
                                                    {video.status === 'PUBLISHED'
                                                        ? 'Publicado'
                                                        : video.status === 'DRAFT'
                                                            ? 'Rascunho'
                                                            : 'DMCA'}
                                                </Badge>
                                            </td>
                                            <td className="py-4 text-sm text-muted-foreground">
                                                {video.models.map((m) => m.name).join(', ') || '-'}
                                            </td>
                                            <td className="py-4">
                                                <div className="flex flex-wrap gap-1">
                                                    {video.categories.slice(0, 2).map((cat) => (
                                                        <Badge key={cat.id} variant="outline" className="text-xs">
                                                            {cat.name}
                                                        </Badge>
                                                    ))}
                                                    {video.categories.length > 2 && (
                                                        <Badge variant="outline" className="text-xs">
                                                            +{video.categories.length - 2}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-4">
                                                <div className="flex justify-end space-x-2">
                                                    <Link href={`/backoffice-92/videos/${video.id}/edit`}>
                                                        <Button variant="ghost" size="sm">
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <DeleteVideoButton videoId={video.id} videoTitle={title} />
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}

                                {videos.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="py-10 text-center text-sm text-muted-foreground">
                                            Nenhum vídeo encontrado nesta página.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm text-muted-foreground">
                            Exibindo {startItem}-{endItem} de {total} vídeos
                        </p>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" disabled={!hasPrev} asChild={hasPrev}>
                                {hasPrev ? (
                                    <Link href={buildAdminVideosHref(currentPage - 1, perPage, modelSlug || undefined)}>
                                        <ChevronLeft className="mr-1 h-4 w-4" />
                                        Anterior
                                    </Link>
                                ) : (
                                    <span>
                                        <ChevronLeft className="mr-1 h-4 w-4" />
                                        Anterior
                                    </span>
                                )}
                            </Button>
                            <span className="text-sm text-muted-foreground">
                                Página {Math.max(1, currentPage)} de {Math.max(1, totalPages)}
                            </span>
                            <Button variant="outline" size="sm" disabled={!hasNext} asChild={hasNext}>
                                {hasNext ? (
                                    <Link href={buildAdminVideosHref(currentPage + 1, perPage, modelSlug || undefined)}>
                                        Próxima
                                        <ChevronRight className="ml-1 h-4 w-4" />
                                    </Link>
                                ) : (
                                    <span>
                                        Próxima
                                        <ChevronRight className="ml-1 h-4 w-4" />
                                    </span>
                                )}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
