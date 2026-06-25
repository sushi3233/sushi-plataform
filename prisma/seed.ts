import 'dotenv/config';
import { PrismaClient, VideoStatus } from '@prisma/client';
import slugify from 'slugify';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seed do banco de dados (Schema 2.0)...');

  await prisma.dailyView.deleteMany();
  await prisma.videoThumbnail.deleteMany();
  await prisma.videoEmbed.deleteMany();
  await prisma.video.deleteMany();
  await prisma.model.deleteMany();
  await prisma.category.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.admin.deleteMany();

  const categories = await Promise.all([
    prisma.category.create({ data: { name: 'Amador', slug: 'amador' } }),
    prisma.category.create({ data: { name: 'Brasileiro', slug: 'brasileiro' } }),
    prisma.category.create({ data: { name: 'Novinha', slug: 'novinha' } }),
    prisma.category.create({ data: { name: 'Caseiro', slug: 'caseiro' } }),
    prisma.category.create({ data: { name: 'Famosas', slug: 'famosas' } }),
  ]);
  console.log(` ${categories.length} categorias criadas`);

  const tags = await Promise.all([
    prisma.tag.create({ data: { name: 'Sexo', slug: 'sexo' } }),
    prisma.tag.create({ data: { name: 'Boquete', slug: 'boquete' } }),
    prisma.tag.create({ data: { name: 'Anal', slug: 'anal' } }),
    prisma.tag.create({ data: { name: 'Gozada', slug: 'gozada' } }),
    prisma.tag.create({ data: { name: 'Bunduda', slug: 'bunduda' } }),
    prisma.tag.create({ data: { name: 'Peituda', slug: 'peituda' } }),
    prisma.tag.create({ data: { name: 'Morena', slug: 'morena' } }),
    prisma.tag.create({ data: { name: 'Loira', slug: 'loira' } }),
    prisma.tag.create({ data: { name: 'Ruiva', slug: 'ruiva' } }),
    prisma.tag.create({ data: { name: 'Vazado', slug: 'vazado' } }),
  ]);
  console.log(` ${tags.length} tags criadas`);

  const models = await Promise.all([
    prisma.model.create({
      data: {
        name: 'Juliana Silva',
        slug: 'juliana-silva',
        imageUrl: 'https://placehold.co/400x400/ff69b4/white?text=JS',
      },
    }),
    prisma.model.create({
      data: {
        name: 'Amanda Costa',
        slug: 'amanda-costa',
        imageUrl: 'https://placehold.co/400x400/ff1493/white?text=AC',
      },
    }),
    prisma.model.create({
      data: {
        name: 'Bruna Ferreira',
        slug: 'bruna-ferreira',
        imageUrl: 'https://placehold.co/400x400/dc143c/white?text=BF',
      },
    }),
  ]);
  console.log(` ${models.length} modelos criados`);

  const videosData = [
    {
      title: 'Juliana Silva em video caseiro amador',
      h1: 'Vídeo da Juliana Silva Pelada Vazado',
      description: 'Video amador da gostosa Juliana Silva mostrando suas habilidades em video caseiro vazado.',
      hlsUrl: 'https://vazounudes.net/hls/mock-uuid-1/playlist.m3u8',
      sourceId: 'mock-uuid-1',
      duration: 720,
      views: 15420,
      modelIndex: 0,
      categoryIndices: [0, 1, 3],
      tagIndices: [0, 1, 4, 6],
    },
    {
      title: 'Amanda Costa fazendo boquete sensacional',
      h1: 'Amanda Costa Mostrando como se faz um Boquete',
      description: 'A morena Amanda Costa em video intimo fazendo um boquete de tirar o folego.',
      hlsUrl: 'https://vazounudes.net/hls/mock-uuid-2/playlist.m3u8',
      sourceId: 'mock-uuid-2',
      duration: 540,
      views: 28750,
      modelIndex: 1,
      categoryIndices: [0, 1],
      tagIndices: [1, 4, 6],
    },
    {
      title: 'Bruna Ferreira transando gostoso',
      h1: 'Bruna Ferreira Pelada Transando no Mato',
      description: 'A loira Bruna Ferreira em cena de sexo intenso em video amador brasileiro.',
      hlsUrl: 'https://vazounudes.net/hls/mock-uuid-3/playlist.m3u8',
      sourceId: 'mock-uuid-3',
      duration: 900,
      views: 42100,
      modelIndex: 2,
      categoryIndices: [0, 1, 3],
      tagIndices: [0, 3, 5, 7],
    },
    {
      title: 'Novinha gostosa em video vazado',
      h1: 'Novinha Brasileira Vazada no Telegram',
      description: 'Video vazado de novinha brasileira em momento intimo com namorado.',
      hlsUrl: 'https://vazounudes.net/hls/mock-uuid-4/playlist.m3u8',
      sourceId: 'mock-uuid-4',
      duration: 480,
      views: 8930,
      modelIndex: null,
      categoryIndices: [2, 3],
      tagIndices: [0, 9, 6],
    },
  ];

  for (const videoData of videosData) {
    const slug = slugify(videoData.title, { lower: true, strict: true });

    const video = await prisma.video.create({
      data: {
        slug: `${slug}-${Math.random().toString(36).substring(2, 6)}`,
        metaTitle: videoData.title.slice(0, 60),
        metaDescription: videoData.description.slice(0, 160),
        h1Title: videoData.h1.slice(0, 100),
        duration: videoData.duration,
        views: videoData.views,
        status: VideoStatus.PUBLISHED,
        publishedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),

        embed: {
          create: {
            hlsUrl: videoData.hlsUrl,
            iframeUrl: '',
            sourcePlatform: 'vazounudes',
            sourceId: videoData.sourceId,
            originalPosterUrl: `https://placehold.co/1280x720/000000/white?text=Poster+${videoData.sourceId}`,
          }
        },

        thumbnail: {
          create: {
            url: `https://placehold.co/1280x720/ff69b4/white?text=Thumb+${videoData.sourceId}`,
            r2Key: `thumbnails/seed/${videoData.sourceId}-cover.webp`,
            altText: videoData.h1,
          }
        },

        models: videoData.modelIndex !== null
          ? { connect: { id: models[videoData.modelIndex].id } }
          : undefined,
        categories: {
          connect: videoData.categoryIndices.map((i) => ({ id: categories[i].id })),
        },
        tags: {
          connect: videoData.tagIndices.map((i) => ({ id: tags[i].id })),
        },
      },
    });

    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      await prisma.dailyView.create({
        data: {
          videoId: video.id,
          date,
          count: Math.floor(Math.random() * 500) + 50,
        },
      });
    }
  }
  console.log(` ${videosData.length} vídeos criados com embeds, thumbnails e views`);

  await prisma.admin.create({
    data: {
      email: 'admin@xvideosprime.com',
      passwordHash: '$2b$10$placeholder-hash-for-testing',
      name: 'Administrador',
    },
  });
  console.log(' 1 admin criado');

  console.log('\n Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
