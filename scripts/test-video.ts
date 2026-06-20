import { db } from '../lib/db';

async function testVideo() {
    const slug = 'mc-mirella-e-dynho-alves-video-intimo-vazado-caindo-na-net';

    console.log(`\n Buscando vídeo com slug: ${slug}\n`);

    const videoUrl = await db.videoUrl.findUnique({
        where: { slug },
        include: {
            video: {
                include: {
                    urls: true,
                    thumbnails: true,
                    models: true,
                    categories: true,
                    tags: true,
                    embed: true,
                },
            },
        },
    });

    if (!videoUrl) {
        console.error(' VideoUrl não encontrado!');
        return;
    }

    const video = videoUrl.video;

    console.log(' Vídeo encontrado!');
    console.log('\n Dados do vídeo:');
    console.log('ID:', video.id);
    console.log('Duration:', video.duration);
    console.log('Views:', video.views);
    console.log('Status:', video.status);
    console.log('PublishedAt:', video.publishedAt);

    console.log('\n URLs:', video.urls.length);
    video.urls.forEach((url, i) => {
        console.log(`  ${i + 1}. ${url.slug} (primary: ${url.isPrimary})`);
        console.log(`     Title: ${url.metaTitle}`);
    });

    console.log('\n  Thumbnails:', video.thumbnails.length);
    video.thumbnails.forEach((thumb, i) => {
        console.log(`  ${i + 1}. ${thumb.url} (cover: ${thumb.isCover})`);
    });

    console.log('\n Embed:', video.embed ? 'SIM' : 'NÃO');
    if (video.embed) {
        console.log('  streamUrl:', video.embed.streamUrl);
        console.log('  posterUrl:', video.embed.posterUrl);
        console.log('  r2ThumbnailUrl:', video.embed.r2ThumbnailUrl || 'null');
        console.log('  r2ThumbnailKey:', video.embed.r2ThumbnailKey || 'null');
    }

    console.log('\n Models:', video.models.length);
    video.models.forEach((model, i) => {
        console.log(`  ${i + 1}. ${model.name} (${model.slug})`);
    });

    console.log('\n Categories:', video.categories.length);
    video.categories.forEach((cat, i) => {
        console.log(`  ${i + 1}. ${cat.name} (${cat.slug})`);
    });

    console.log('\n  Tags:', video.tags.length);
    video.tags.forEach((tag, i) => {
        console.log(`  ${i + 1}. ${tag.name} (${tag.slug})`);
    });

    console.log('\n Teste concluído!\n');

    await db.$disconnect();
}

testVideo().catch(console.error);
