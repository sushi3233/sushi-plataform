
import { PrismaClient } from '@prisma/client';
import slugify from 'slugify';

const prisma = new PrismaClient();

async function main() {
    console.log('Iniciando inserção do vídeo HLS...');

    const videoData = {
        title: 'Mc Mirella e Dynho Alves: Vídeo Íntimo Vazado Caindo na Net',
        description: 'Vídeo vazado da Mc Mirella fazendo sexo gostoso com seu namorado Dynho Alves. Assista ao conteúdo completo exclusivo deste vazamento que parou a internet. Mirella mostrando tudo nesse vídeo caseiro amador e explícito.',
        streamUrl: 'https://vazounudes.net/hls/26a0fc7b-9ba1-47fe-b3fe-035f638e0335/playlist.m3u8',
        posterUrl: 'https://vazounudes.net/hls/26a0fc7b-9ba1-47fe-b3fe-035f638e0335/thumbnail_3.jpg',
        duration: 297,
        models: ['Mc Mirella'],
        categories: ['Amador', 'Vazados', 'Famosas'],
        tags: ['mc mirella', 'dynho alves', 'caiu na net', 'vazou', 'funk', 'celebridade']
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
                        originalId: '26a0fc7b-9ba1-47fe-b3fe-035f638e0335'
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
        }

        console.log('Vídeo inserido com SUCESSO! Slug:', slug);

    } catch (error) {
        console.error('Erro ao inserir vídeo:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
