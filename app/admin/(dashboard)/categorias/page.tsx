import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { db as prisma } from '@/lib/db';
import type { Prisma } from '@prisma/client';

type CategoryWithCount = Prisma.CategoryGetPayload<{
    include: {
        _count: {
            select: { videos: true };
        };
    };
}>;

export const dynamic = 'force-dynamic';

async function getCategoriesWithCount() {
    const categories = await prisma.category.findMany({
        include: {
            _count: {
                select: { videos: true },
            },
        },
        orderBy: { name: 'asc' },
    });

    return categories.map((cat: CategoryWithCount) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        videoCount: cat._count.videos,
    }));
}

export default async function AdminCategoriesPage() {
    let categories: { id: string; name: string; slug: string; videoCount: number }[] = [];
    try {
        categories = await getCategoriesWithCount();
    } catch (error) {
        console.error('Erro ao buscar categorias:', error);
    }

    return (
        <div className="space-y-6">

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Categorias</h1>
                    <p className="text-muted-foreground">Gerencie as categorias da plataforma</p>
                </div>
            </div>

            <Card>
                <CardContent className="pt-6">
                    <p className="text-muted-foreground">
                        As categorias são criadas automaticamente ao fazer upload de vídeos.
                        Em breve será possível criar e editar categorias diretamente.
                    </p>
                </CardContent>
            </Card>

            {categories.length === 0 ? (
                <Card>
                    <CardContent className="pt-6 text-center">
                        <p className="text-muted-foreground py-8">
                            Nenhuma categoria cadastrada ainda. Faça upload de vídeos com categorias!
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {categories.map((category) => (
                        <Card key={category.id}>
                            <CardContent className="pt-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-foreground">{category.name}</h3>
                                        <p className="text-sm text-muted-foreground">/{category.slug}</p>
                                        <Badge variant="secondary" className="mt-2">
                                            {category.videoCount} vídeos
                                        </Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Resumo</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-foreground">
                        Total: <span className="font-bold">{categories.length}</span> categorias
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
