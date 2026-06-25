import { PrismaClient } from '@prisma/client';
import slugify from 'slugify';

const prisma = new PrismaClient();

async function main() {
    console.log(' Iniciando inserção dos 3 vídeos...\n');

    const duracao1 = 10 * 60 + 35;
    const duracao2 = 4 * 60 + 21;
    const duracao3 = 7 * 60 + 46;

    try {

        console.log(' Vídeo 1: Brasiloirinha transando forte...');

        const video1 = await prisma.video.create({
            data: {
                slug: slugify('brasiloirinha-transando-forte-maromba-igor-marco', { lower: true, strict: true }),
                metaTitle: 'Brasiloirinha Transando Forte com Maromba Igor de Marco',
                metaDescription: 'Assista Brasiloirinha transando forte com o maromba Igor de Marco em vídeo completo. Sexo intenso, buceta molhada e muito tesão neste vídeo amador.',
                h1Title: 'Brasiloirinha Transando Forte com o Maromba Igor de Marco',
                duration: duracao1,
                status: 'PUBLISHED',
                publishedAt: new Date(),

                embed: {
                    create: {
                        hlsUrl: 'https://vazounudes.net/hls/d1caa325-5b4d-4fa5-8216-2523833a5a47/playlist.m3u8',
                        iframeUrl: '',
                        sourcePlatform: 'vazounudes',
                        sourceId: 'd1caa325-5b4d-4fa5-8216-2523833a5a47',
                        sourceUrl: null,
                        originalPosterUrl: null,
                    }
                },

                models: {
                    connectOrCreate: [
                        {
                            where: { slug: 'brasiloirinha' },
                            create: { name: 'Brasiloirinha', slug: 'brasiloirinha' }
                        },
                        {
                            where: { slug: 'igor-de-marco' },
                            create: { name: 'Igor de Marco', slug: 'igor-de-marco' }
                        }
                    ]
                },

                categories: {
                    connectOrCreate: [
                        {
                            where: { slug: 'amador' },
                            create: { name: 'Amador', slug: 'amador' }
                        }
                    ]
                },

                tags: {
                    connectOrCreate: [
                        {
                            where: { slug: 'buceta' },
                            create: { name: 'Buceta', slug: 'buceta' }
                        },
                        {
                            where: { slug: 'video-longo' },
                            create: { name: 'Video longo', slug: 'video-longo' }
                        },
                        {
                            where: { slug: 'boquete' },
                            create: { name: 'Boquete', slug: 'boquete' }
                        }
                    ]
                }
            }
        });

        console.log(` Vídeo 1 criado: /${video1.slug}/\n`);

        console.log(' Vídeo 2: Brasiloirinha dando o cuzinho...');

        const video2 = await prisma.video.create({
            data: {
                slug: slugify('brasiloirinha-dando-cuzinho-apertado-gozada-dentro', { lower: true, strict: true }),
                metaTitle: 'Brasiloirinha Dando o Cuzinho Apertado e Levando Gozada',
                metaDescription: 'Brasiloirinha loira dando o cuzinho apertado e levando gozada dentro. Vídeo amador completo de sexo anal intenso com a gostosa gemendo muito.',
                h1Title: 'Brasiloirinha Dando o Cuzinho Apertado e Levando Gozada Dentro',
                duration: duracao2,
                status: 'PUBLISHED',
                publishedAt: new Date(),

                embed: {
                    create: {
                        hlsUrl: 'https://vazounudes.net/hls/c8274513-5550-40de-adb8-46abc5584a52/playlist.m3u8',
                        iframeUrl: '',
                        sourcePlatform: 'vazounudes',
                        sourceId: 'c8274513-5550-40de-adb8-46abc5584a52',
                        sourceUrl: null,
                        originalPosterUrl: null,
                    }
                },

                models: {
                    connectOrCreate: [
                        {
                            where: { slug: 'brasiloirinha' },
                            create: { name: 'Brasiloirinha', slug: 'brasiloirinha' }
                        }
                    ]
                },

                categories: {
                    connectOrCreate: [
                        {
                            where: { slug: 'amador' },
                            create: { name: 'Amador', slug: 'amador' }
                        }
                    ]
                },

                tags: {
                    connectOrCreate: [
                        {
                            where: { slug: 'anal' },
                            create: { name: 'Anal', slug: 'anal' }
                        },
                        {
                            where: { slug: 'gozada-dentro' },
                            create: { name: 'Gozada dentro', slug: 'gozada-dentro' }
                        },
                        {
                            where: { slug: 'loira' },
                            create: { name: 'Loira', slug: 'loira' }
                        }
                    ]
                }
            }
        });

        console.log(` Vídeo 2 criado: /${video2.slug}/\n`);

        console.log(' Vídeo 3: Brasiloirinha levando chupada...');

        const video3 = await prisma.video.create({
            data: {
                slug: slugify('brasiloirinha-levando-chupada-buceta-boquete-negao', { lower: true, strict: true }),
                metaTitle: 'Brasiloirinha Levando Chupada na Buceta e Fazendo Boquete',
                metaDescription: 'Brasiloirinha novinha loira levando chupada na buceta e fazendo boquete no negão. Vídeo amador completo de sexo oral intenso com a gostosa gemendo.',
                h1Title: 'Brasiloirinha Levando Chupada na Buceta e Fazendo Boquete no Negão',
                duration: duracao3,
                status: 'PUBLISHED',
                publishedAt: new Date(),

                embed: {
                    create: {
                        hlsUrl: 'https://vazounudes.net/hls/c97b0ed1-66e2-493b-bcfe-1eeab8e24978/playlist.m3u8',
                        iframeUrl: '',
                        sourcePlatform: 'vazounudes',
                        sourceId: 'c97b0ed1-66e2-493b-bcfe-1eeab8e24978',
                        sourceUrl: null,
                        originalPosterUrl: null,
                    }
                },

                models: {
                    connectOrCreate: [
                        {
                            where: { slug: 'brasiloirinha' },
                            create: { name: 'Brasiloirinha', slug: 'brasiloirinha' }
                        }
                    ]
                },

                categories: {
                    connectOrCreate: [
                        {
                            where: { slug: 'amador' },
                            create: { name: 'Amador', slug: 'amador' }
                        }
                    ]
                },

                tags: {
                    connectOrCreate: [
                        {
                            where: { slug: 'buceta' },
                            create: { name: 'Buceta', slug: 'buceta' }
                        },
                        {
                            where: { slug: 'loira' },
                            create: { name: 'Loira', slug: 'loira' }
                        },
                        {
                            where: { slug: 'novinha' },
                            create: { name: 'Novinha', slug: 'novinha' }
                        }
                    ]
                }
            }
        });

        console.log(` Vídeo 3 criado: /${video3.slug}/\n`);

        console.log('========================================');
        console.log(' 3 VÍDEOS INSERIDOS COM SUCESSO!');
        console.log('========================================\n');

        console.log(' URLs dos vídeos:');
        console.log(`1. https://xvideosprime.com/${video1.slug}/`);
        console.log(`2. https://xvideosprime.com/${video2.slug}/`);
        console.log(`3. https://xvideosprime.com/${video3.slug}/\n`);

        console.log('  ATENÇÃO: Thumbnails precisam ser adicionadas!');
        console.log('Acesse o admin e faça upload das thumbnails para cada vídeo.\n');

        console.log(' Estatísticas:');
        const totalVideos = await prisma.video.count();
        const totalModelos = await prisma.model.count();
        const totalCategorias = await prisma.category.count();
        const totalTags = await prisma.tag.count();

        console.log(`   Vídeos: ${totalVideos}`);
        console.log(`   Modelos: ${totalModelos}`);
        console.log(`   Categorias: ${totalCategorias}`);
        console.log(`   Tags: ${totalTags}\n`);

    } catch (error) {
        console.error(' Erro ao inserir vídeos:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    });
