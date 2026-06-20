import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tag } from 'lucide-react';
import { db as prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

async function getTagsWithCount() {
    const tags = await prisma.tag.findMany({
        include: {
            _count: {
                select: { videos: true },
            },
        },
        orderBy: { name: 'asc' },
    });

    return tags.map(tag => ({
        id: tag.id,
        name: tag.name,
        slug: tag.slug,
        videoCount: tag._count.videos,
    }));
}

export default async function AdminTagsPage() {
    let tags: { id: string; name: string; slug: string; videoCount: number }[] = [];
    try {
        tags = await getTagsWithCount();
    } catch (error) {
        console.error('Erro ao buscar tags:', error);
    }

    return (
        <div className="space-y-6">

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Tags</h1>
                    <p className="text-muted-foreground">Gerencie as tags da plataforma</p>
                </div>
            </div>

            <Card>
                <CardContent className="pt-6">
                    <p className="text-muted-foreground">
                        As tags são criadas automaticamente ao fazer upload de vídeos.
                        Em breve será possível criar e editar tags diretamente.
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Todas as Tags ({tags.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    {tags.length === 0 ? (
                        <p className="text-muted-foreground text-center py-8">
                            Nenhuma tag cadastrada ainda. Faça upload de vídeos com tags!
                        </p>
                    ) : (
                        <div className="flex flex-wrap gap-3">
                            {tags.map((tag) => (
                                <div
                                    key={tag.id}
                                    className="group relative inline-flex items-center gap-2 rounded-full border bg-secondary px-4 py-2"
                                >
                                    <Tag className="h-3 w-3 text-primary" />
                                    <span className="font-medium text-foreground">{tag.name}</span>
                                    <Badge variant="outline" className="text-xs">
                                        {tag.videoCount}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Detalhes das Tags</CardTitle>
                </CardHeader>
                <CardContent>
                    {tags.length === 0 ? (
                        <p className="text-muted-foreground text-center py-4">
                            Nenhuma tag para exibir
                        </p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-border">
                                        <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Nome</th>
                                        <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Slug</th>
                                        <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Vídeos</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tags.map((tag) => (
                                        <tr key={tag.id} className="border-b border-border last:border-0">
                                            <td className="py-4 text-sm font-medium text-foreground">{tag.name}</td>
                                            <td className="py-4 text-sm text-muted-foreground">{tag.slug}</td>
                                            <td className="py-4">
                                                <Badge variant="secondary">{tag.videoCount} vídeos</Badge>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
