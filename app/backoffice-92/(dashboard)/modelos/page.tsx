import Link from 'next/link';
import { Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { db as prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

async function getModelsWithCount() {
    const models = await prisma.model.findMany({
        include: {
            _count: {
                select: { videos: true },
            },
        },
        orderBy: { name: 'asc' },
    });

    return models.map((model) => ({
        id: model.id,
        name: model.name,
        slug: model.slug,
        videoCount: model._count.videos,
    }));
}

function buildModelVideosHref(slug: string): string {
    return `/backoffice-92/videos?model=${encodeURIComponent(slug)}`;
}

export default async function AdminModelsPage() {
    let models: { id: string; name: string; slug: string; videoCount: number }[] = [];

    try {
        models = await getModelsWithCount();
    } catch (error) {
        console.error('Erro ao buscar modelos:', error);
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Modelos</h1>
                    <p className="text-muted-foreground">Gerencie os modelos da plataforma</p>
                </div>
            </div>

            <Card>
                <CardContent className="pt-6">
                    <p className="text-muted-foreground">
                        Os modelos sao criados automaticamente no upload/importacao. Clique em uma modelo para ver os videos
                        dela no admin.
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Todos os Modelos ({models.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    {models.length === 0 ? (
                        <p className="py-8 text-center text-muted-foreground">
                            Nenhum modelo cadastrado ainda. Faca upload/importacao de videos com modelos.
                        </p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-border">
                                        <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Nome</th>
                                        <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Slug</th>
                                        <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Videos</th>
                                        <th className="pb-3 text-right text-sm font-medium text-muted-foreground">Acoes</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {models.map((model) => {
                                        const href = buildModelVideosHref(model.slug);

                                        return (
                                            <tr key={model.id} className="border-b border-border last:border-0">
                                                <td className="py-4 text-sm font-medium text-foreground">
                                                    <Link href={href} className="hover:underline">
                                                        {model.name}
                                                    </Link>
                                                </td>
                                                <td className="py-4 text-sm text-muted-foreground">
                                                    <Link href={href} className="hover:underline">
                                                        {model.slug}
                                                    </Link>
                                                </td>
                                                <td className="py-4">
                                                    <Link href={href}>
                                                        <Badge variant="secondary" className="hover:bg-secondary/80">
                                                            {model.videoCount} videos
                                                        </Badge>
                                                    </Link>
                                                </td>
                                                <td className="py-4">
                                                    <div className="flex justify-end">
                                                        <Button variant="ghost" size="sm" asChild>
                                                            <Link href={href} aria-label={`Ver videos de ${model.name}`}>
                                                                <Eye className="h-4 w-4" />
                                                            </Link>
                                                        </Button>
                                                    </div>
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
