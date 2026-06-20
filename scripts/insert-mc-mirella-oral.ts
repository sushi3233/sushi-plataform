import { PrismaClient } from '@prisma/client';
import slugify from 'slugify';

const prisma = new PrismaClient();

async function main() {
    console.log('Iniciando inserção do vídeo HLS...');

    const videoData = {
        title: 'MC Mirella Chupando e Fudendo com Namorado Dynho',
        description: 'Vídeo completo da MC Mirella fazendo sexo oral e transando com seu namorado Dynho Alves. Assista ao conteúdo íntimo e explícito da funkeira em vídeo caseiro amador vazado. Mirella mostrando suas habilidades neste vídeo quente e picante.',
        streamUrl: 'https://vazounudes.net/hls/15318327-75f6-4d7d-b672-ad95e1af6c9e/playlist.m3u8',
        posterUrl: 'https://vazounudes.net/hls/15318327-75f6-4d7d-b672-ad95e1af6c9e/thumbnail_3.jpg',
        duration: 189,
        models: ['Mc Mirella'],
        categories: ['Amador', 'Vazados', 'Famosas', 'Oral'],
        tags: ['mc mirella', 'dynho alves', 'boquete', 'oral', 'sexo', 'funk', 'celebridade', 'vazou']
    };

    const slug = slugify(videoData.title, { lower: true, strict: true });

    try {

        const existing = await prisma.videoUrl.findUnique({
            where: { slug }
        });

        if (existing) {
            console.log('Vídeo já existe com slug:', slug);
            return;
        }

        const video = await prisma.video.create({
            data: {
                duration: videoData.duration,
                status: 'PUBLISHED',
                publishedAt: new Date(),
                views: 0,
                embed: {
                    create: {
                        streamUrl: videoData.streamUrl,
                        posterUrl: videoData.posterUrl,
                        sourcePlatform: 'vazounudes',
                        originalId: '15318327-75f6-4d7d-b672-ad95e1af6c9e'
                    }
                },
                urls: {
                    create: {
                        slug,
                        isPrimary: true,
                        metaTitle: videoData.title,
                        metaDescription: videoData.description
                    }
                }
            },
        });

        console.log('Vídeo criado com ID:', video.id);

        for (const name of videoData.models) {
            const modelSlug = slugify(name, { lower: true, strict: true });
            const model = await prisma.model.upsert({
                where: { slug: modelSlug },
                create: { name, slug: modelSlug },
                update: {}
            });
            await prisma.video.update({
                where: { id: video.id },
                data: { models: { connect: { id: model.id } } }
            });
            console.log(`Modelo ${name} conectado.`);
        }

        for (const name of videoData.categories) {
            const catSlug = slugify(name, { lower: true, strict: true });
            const category = await prisma.category.upsert({
                where: { slug: catSlug },
                create: { name, slug: catSlug },
                update: {}
            });
            await prisma.video.update({
                where: { id: video.id },
                data: { categories: { connect: { id: category.id } } }
            });
            console.log(`Categoria ${name} conectada.`);
        }

        for (const name of videoData.tags) {
            const tagSlug = slugify(name, { lower: true, strict: true });
            const tag = await prisma.tag.upsert({
                where: { slug: tagSlug },
                create: { name, slug: tagSlug },
                update: {}
            });
            await prisma.video.update({
                where: { id: video.id },
                data: { tags: { connect: { id: tag.id } } }
            });
            console.log(`Tag ${name} conectada.`);
        }

        console.log(' Vídeo inserido com SUCESSO!');
        console.log(' Slug:', slug);
        console.log(' URL:', `http://localhost:3000/${slug}`);

    } catch (error) {
        console.error(' Erro ao inserir vídeo:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
