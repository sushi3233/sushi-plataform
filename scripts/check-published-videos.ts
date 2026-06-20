import { db as prisma } from '../lib/db';

async function checkPublishedVideos() {
    console.log(' Verificando vídeos no banco...\n');

    try {

        const totalVideos = await prisma.video.count();
        console.log(` Total de vídeos no banco: ${totalVideos}`);

        const byStatus = await prisma.video.groupBy({
            by: ['status'],
            _count: true,
        });

        console.log('\n Vídeos por status:');
        byStatus.forEach((group) => {
            console.log(`   ${group.status}: ${group._count}`);
        });

        const publishedVideos = await prisma.video.findMany({
            where: {
                status: 'PUBLISHED',
            },
            select: {
                id: true,
                slug: true,
                metaTitle: true,
                status: true,
                publishedAt: true,
                createdAt: true,
            },
            orderBy: {
                publishedAt: 'desc',
            },
        });

        console.log(`\n Vídeos PUBLISHED (${publishedVideos.length}):`);
        publishedVideos.forEach((video, index) => {
            console.log(`   ${index + 1}. ${video.slug}`);
            console.log(`      Título: ${video.metaTitle}`);
            console.log(`      Publicado em: ${video.publishedAt?.toISOString() || 'N/A'}`);
            console.log(`      Criado em: ${video.createdAt.toISOString()}`);
            console.log('');
        });

        const draftVideos = await prisma.video.findMany({
            where: {
                status: 'DRAFT',
            },
            select: {
                slug: true,
                metaTitle: true,
            },
        });

        if (draftVideos.length > 0) {
            console.log(`\n  Vídeos em DRAFT (${draftVideos.length}) - NÃO aparecem no sitemap:`);
            draftVideos.forEach((video, index) => {
                console.log(`   ${index + 1}. ${video.slug} - ${video.metaTitle}`);
            });
        }

        console.log('\n Verificação concluída!');
        console.log('\n Dica: Se vídeos não aparecem no sitemap, verifique:');
        console.log('   1. Status está PUBLISHED?');
        console.log('   2. publishedAt está preenchido?');
        console.log('   3. Cache do Cloudflare (purge cache)');
        console.log('   4. Cache do navegador (Ctrl+Shift+R)');

    } catch (error) {
        console.error(' Erro ao verificar vídeos:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkPublishedVideos();
