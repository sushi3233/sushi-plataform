import { db as prisma } from '../lib/db';

async function fixThumbnails() {
    console.log(' Corrigindo thumbnails incorretas...\n');

    try {

        const result = await prisma.videoThumbnail.deleteMany({
            where: {
                url: {
                    endsWith: '.mp4'
                }
            }
        });

        console.log(` Removidas ${result.count} thumbnails incorretas (.mp4)`);
        console.log(' As thumbnails serão geradas automaticamente na Fase 5 (Stream)\n');

    } catch (error) {
        console.error(' Erro:', error);
    } finally {
        await prisma.$disconnect();
    }
}

fixThumbnails();
