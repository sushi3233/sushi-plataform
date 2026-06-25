import { db as prisma } from '../lib/db';

async function checkVideos() {
    console.log(' Verificando vídeos no banco...\n');

    try {

        const totalVideos = await prisma.video.count();
        console.log(` Total de vídeos: ${totalVideos}`);

        const published = await prisma.video.count({ where: { status: 'PUBLISHED' } });
        const draft = await prisma.video.count({ where: { status: 'DRAFT' } });
        console.log(` Publicados: ${published}`);
        console.log(` Rascunhos: ${draft}\n`);

        const videos = await prisma.video.findMany({
            include: {
                embed: true,
                thumbnail: true,
                models: true,
                categories: true,
                tags: true,
            },
        });

        if (videos.length === 0) {
            console.log(' Nenhum vídeo encontrado no banco!');
            console.log(' Faça upload de um vídeo pelo painel admin: http://localhost:3000/backoffice-92/videos/novo-hls');
        } else {
            console.log(' Vídeos encontrados:\n');
            videos.forEach((video, index) => {
                console.log(`${index + 1}. ${video.metaTitle || 'Sem título'}`);
                console.log(`   ID: ${video.id}`);
                console.log(`   Slug: ${video.slug}`);
                console.log(`   H1 Title: ${video.h1Title}`);
                console.log(`   Status: ${video.status}`);
                console.log(`   Duração: ${video.duration}s`);
                console.log(`   Views: ${video.views}`);
                console.log(`   HLS URL: ${video.embed?.hlsUrl || 'N/A'}`);
                console.log(`   Poster: ${video.embed?.originalPosterUrl || video.thumbnail?.url || 'N/A'}`);
                console.log(`   Modelos: ${video.models.map(m => m.name).join(', ') || 'Nenhum'}`);
                console.log(`   Categorias: ${video.categories.map(c => c.name).join(', ') || 'Nenhuma'}`);
                console.log(`   Tags: ${video.tags.map(t => t.name).join(', ') || 'Nenhuma'}`);
                console.log('');
            });
        }

    } catch (error) {
        console.error(' Erro ao conectar no banco:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkVideos();
