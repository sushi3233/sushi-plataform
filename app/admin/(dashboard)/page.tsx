import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Video, Users, FolderOpen, Eye, Tag } from 'lucide-react';
import { db as prisma } from '@/lib/db';
import { getMostViewedVideos, getRecentVideos } from '@/lib/services/videos';

export const dynamic = 'force-dynamic';

async function getStats() {
    const [totalVideos, totalViews, totalModels, totalCategories, totalTags] = await Promise.all([
        prisma.video.count({ where: { status: 'PUBLISHED' } }),
        prisma.video.aggregate({
            where: { status: 'PUBLISHED' },
            _sum: { views: true },
        }),
        prisma.model.count(),
        prisma.category.count(),
        prisma.tag.count(),
    ]);

    return {
        totalVideos,
        totalViews: totalViews._sum.views || 0,
        totalModels,
        totalCategories,
        totalTags,
    };
}

function formatNumber(num: number): string {
    if (num >= 1000000) {
        return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
        return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toLocaleString('pt-BR');
}

export default async function AdminDashboardPage() {
    let stats = { totalVideos: 0, totalViews: 0, totalModels: 0, totalCategories: 0, totalTags: 0 };
    let mostViewedVideos: Awaited<ReturnType<typeof getMostViewedVideos>> = [];
    let recentVideos: Awaited<ReturnType<typeof getRecentVideos>> = [];
    try {
        [stats, mostViewedVideos, recentVideos] = await Promise.all([
            getStats(),
            getMostViewedVideos(5),
            getRecentVideos(5),
        ]);
    } catch (error) {
        console.error('Erro ao buscar dados do admin:', error);
    }

    const statsCards = [
        {
            title: 'Total de Vídeos',
            value: formatNumber(stats.totalVideos),
            icon: Video,
        },
        {
            title: 'Total de Views',
            value: formatNumber(stats.totalViews),
            icon: Eye,
        },
        {
            title: 'Modelos',
            value: formatNumber(stats.totalModels),
            icon: Users,
        },
        {
            title: 'Categorias',
            value: formatNumber(stats.totalCategories),
            icon: FolderOpen,
        },
    ];

    return (
        <div className="space-y-6">

            <div>
                <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
                <p className="text-muted-foreground">Visão geral da plataforma</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {statsCards.map((stat) => (
                    <Card key={stat.title}>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                {stat.title}
                            </CardTitle>
                            <stat.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-2">

                <Card>
                    <CardHeader>
                        <CardTitle>Views nos Últimos 7 Dias</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-64 flex items-center justify-center text-muted-foreground">

                            <div className="text-center">
                                <Eye className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                <p>Gráfico de views será implementado na Fase 5</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Vídeos Mais Vistos</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {mostViewedVideos.length === 0 ? (
                                <p className="text-muted-foreground text-center py-4">
                                    Nenhum vídeo publicado ainda
                                </p>
                            ) : (
                                mostViewedVideos.map((video, index) => {
                                    const title = video.metaTitle || 'Sem título';
                                    return (
                                        <div key={video.id} className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                                                    {index + 1}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-foreground line-clamp-1">{title}</p>
                                                    <p className="text-xs text-muted-foreground">{video.views.toLocaleString()} views</p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Vídeos Recentes</CardTitle>
                </CardHeader>
                <CardContent>
                    {recentVideos.length === 0 ? (
                        <p className="text-muted-foreground text-center py-8">
                            Nenhum vídeo publicado ainda. Faça upload pelo menu Vídeos!
                        </p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-border">
                                        <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Título</th>
                                        <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Views</th>
                                        <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentVideos.map((video) => {
                                        const title = video.metaTitle || 'Sem título';
                                        return (
                                            <tr key={video.id} className="border-b border-border last:border-0">
                                                <td className="py-3 text-sm text-foreground">{title}</td>
                                                <td className="py-3 text-sm text-foreground">{video.views.toLocaleString()}</td>
                                                <td className="py-3">
                                                    <span className="inline-flex rounded-full px-2 py-1 text-xs font-semibold bg-accent/10 text-accent">
                                                        Publicado
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
