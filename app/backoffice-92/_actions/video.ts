'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import slugify from 'slugify';

interface CreateHLSVideoState {
    error?: string;
    success?: boolean;
}

export async function createHLSVideo(prevState: CreateHLSVideoState, formData: FormData): Promise<CreateHLSVideoState> {
    try {
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const h1Title = formData.get('h1Title') as string || title;
        const streamUrl = formData.get('streamUrl') as string;
        const posterUrl = formData.get('posterUrl') as string;
        const r2ThumbnailUrl = formData.get('r2ThumbnailUrl') as string;
        const r2ThumbnailKey = formData.get('r2ThumbnailKey') as string;
        const duration = parseInt(formData.get('duration') as string) || 0;
        const modelsInput = formData.get('models') as string;
        const categoriesInput = formData.get('categories') as string;
        const tagsInput = formData.get('tags') as string;

        if (!title || !streamUrl) {
            return { error: 'Título e URL do Stream são obrigatórios' };
        }

        if (!r2ThumbnailUrl && !posterUrl) {
            return { error: 'Thumbnail é obrigatória' };
        }

        let slug = slugify(title, { lower: true, strict: true });
        const existing = await db.video.findUnique({ where: { slug } });
        if (existing) {
            slug = `${slug}-${Math.floor(Math.random() * 1000)}`;
        }

        const modelNames = modelsInput.split(',').map(s => s.trim()).filter(Boolean);
        const categoryNames = categoriesInput.split(',').map(s => s.trim()).filter(Boolean);
        const tagNames = tagsInput.split(',').map(s => s.trim()).filter(Boolean);

        await db.$transaction(async (tx) => {

            const video = await tx.video.create({
                data: {
                    slug,
                    metaTitle: title.substring(0, 60),
                    metaDescription: description?.substring(0, 160) || title,
                    h1Title: h1Title.substring(0, 100),
                    duration,
                    status: 'PUBLISHED',
                    publishedAt: new Date(),

                    embed: {
                        create: {
                            hlsUrl: streamUrl,
                            iframeUrl: '',
                            sourcePlatform: 'vazounudes',
                            sourceId: streamUrl.split('/').pop()?.split('.')[0] || 'manual',
                            originalPosterUrl: posterUrl,
                        }
                    },

                    thumbnail: {
                        create: {
                            url: r2ThumbnailUrl || posterUrl,
                            r2Key: r2ThumbnailKey || 'manual-entry',
                            altText: h1Title,
                        }
                    },

                    models: {
                        connectOrCreate: modelNames.map(name => ({
                            where: { slug: slugify(name, { lower: true, strict: true }) },
                            create: { name, slug: slugify(name, { lower: true, strict: true }) }
                        }))
                    },

                    categories: {
                        connectOrCreate: categoryNames.map(name => ({
                            where: { slug: slugify(name, { lower: true, strict: true }) },
                            create: { name, slug: slugify(name, { lower: true, strict: true }) }
                        }))
                    },

                    tags: {
                        connectOrCreate: tagNames.map(name => ({
                            where: { slug: slugify(name, { lower: true, strict: true }) },
                            create: { name, slug: slugify(name, { lower: true, strict: true }) }
                        }))
                    }
                },
            });
        });

        revalidatePath('/backoffice-92/videos');
        revalidatePath('/');
    } catch (error: any) {
        console.error('[Action] Erro ao criar vídeo:', error);
        return { error: error.message || 'Erro interno ao criar vídeo' };
    }

    redirect('/backoffice-92/videos');
}

export async function updateHLSVideo(prevState: CreateHLSVideoState, formData: FormData): Promise<CreateHLSVideoState> {
    try {
        const videoId = formData.get('videoId') as string;
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const h1Title = formData.get('h1Title') as string || title;
        const streamUrl = formData.get('streamUrl') as string;
        const r2ThumbnailUrl = formData.get('r2ThumbnailUrl') as string;
        const r2ThumbnailKey = formData.get('r2ThumbnailKey') as string;
        const duration = parseInt(formData.get('duration') as string) || 0;
        const modelsInput = formData.get('models') as string;
        const categoriesInput = formData.get('categories') as string;
        const tagsInput = formData.get('tags') as string;

        if (!videoId || !title || !streamUrl) {
            return { error: 'ID, Título e URL do Stream são obrigatórios' };
        }

        const existingVideo = await db.video.findUnique({
            where: { id: videoId },
            include: { thumbnail: true, embed: true, models: true, categories: true, tags: true },
        });

        if (!existingVideo) {
            return { error: 'Vídeo não encontrado' };
        }

        const modelNames = modelsInput?.split(',').map(s => s.trim()).filter(Boolean) || [];
        const categoryNames = categoriesInput?.split(',').map(s => s.trim()).filter(Boolean) || [];
        const tagNames = tagsInput?.split(',').map(s => s.trim()).filter(Boolean) || [];

        await db.$transaction(async (tx) => {

            await tx.video.update({
                where: { id: videoId },
                data: {
                    metaTitle: title.substring(0, 60),
                    metaDescription: description?.substring(0, 160) || title,
                    h1Title: h1Title.substring(0, 100),
                    duration,

                    models: { set: [] },
                    categories: { set: [] },
                    tags: { set: [] },
                },
            });

            await tx.video.update({
                where: { id: videoId },
                data: {
                    models: {
                        connectOrCreate: modelNames.map(name => ({
                            where: { slug: slugify(name, { lower: true, strict: true }) },
                            create: { name, slug: slugify(name, { lower: true, strict: true }) },
                        })),
                    },
                    categories: {
                        connectOrCreate: categoryNames.map(name => ({
                            where: { slug: slugify(name, { lower: true, strict: true }) },
                            create: { name, slug: slugify(name, { lower: true, strict: true }) },
                        })),
                    },
                    tags: {
                        connectOrCreate: tagNames.map(name => ({
                            where: { slug: slugify(name, { lower: true, strict: true }) },
                            create: { name, slug: slugify(name, { lower: true, strict: true }) },
                        })),
                    },
                },
            });

            if (existingVideo.embed) {
                await tx.videoEmbed.update({
                    where: { id: existingVideo.embed.id },
                    data: { hlsUrl: streamUrl },
                });
            }

            if (r2ThumbnailUrl && r2ThumbnailKey) {
                if (existingVideo.thumbnail) {
                    await tx.videoThumbnail.update({
                        where: { id: existingVideo.thumbnail.id },
                        data: {
                            url: r2ThumbnailUrl,
                            r2Key: r2ThumbnailKey,
                            altText: h1Title,
                        },
                    });
                } else {
                    await tx.videoThumbnail.create({
                        data: {
                            videoId,
                            url: r2ThumbnailUrl,
                            r2Key: r2ThumbnailKey,
                            altText: h1Title,
                        },
                    });
                }
            }
        });

        revalidatePath('/backoffice-92/videos');
        revalidatePath('/');
        revalidatePath(`/video/${existingVideo.slug}`);
    } catch (error: any) {
        console.error('[Action] Erro ao atualizar vídeo:', error);
        return { error: error.message || 'Erro interno ao atualizar vídeo' };
    }

    redirect('/backoffice-92/videos');
}

export async function deleteVideo(videoId: string): Promise<{ error?: string; success?: boolean }> {
    try {

        const video = await db.video.findUnique({
            where: { id: videoId },
            include: { thumbnail: true },
        });

        if (!video) {
            return { error: 'Vídeo não encontrado' };
        }

        if (video.thumbnail?.r2Key && video.thumbnail.r2Key !== 'manual-entry') {
            try {
                const { deleteObject } = await import('@/lib/services/r2');
                await deleteObject(video.thumbnail.r2Key);
            } catch (r2Error) {
                console.warn('[Action] Erro ao deletar thumbnail do R2:', r2Error);
            }
        }

        await db.video.delete({
            where: { id: videoId },
        });

        revalidatePath('/backoffice-92/videos');
        revalidatePath('/');

        return { success: true };
    } catch (error: any) {
        console.error('[Action] Erro ao deletar vídeo:', error);
        return { error: error.message || 'Erro interno ao deletar vídeo' };
    }
}
