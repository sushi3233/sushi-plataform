'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft, PlayCircle, Upload, X, Loader2, CheckCircle, Save } from 'lucide-react';
import { updateHLSVideo } from '@/app/admin/_actions/video';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                </>
            ) : (
                <>
                    <Save className="mr-2 h-4 w-4" />
                    Salvar Alterações
                </>
            )}
        </Button>
    );
}

interface ThumbnailUploadState {
    url: string | null;
    key: string | null;
    uploading: boolean;
    error: string | null;
}

interface VideoData {
    id: string;
    slug: string;
    metaTitle: string;
    metaDescription: string;
    h1Title: string;
    duration: number;
    views: number;
    status: string;
    embed?: {
        hlsUrl: string;
        iframeUrl: string;
        originalPosterUrl?: string;
    } | null;
    thumbnail?: {
        url: string;
        r2Key: string;
        altText?: string;
    } | null;
    models: { name: string; slug: string }[];
    categories: { name: string; slug: string }[];
    tags: { name: string; slug: string }[];
}

export default function EditVideoPage({ params }: { params: Promise<{ id: string }> }) {
    const [state, action] = useFormState(updateHLSVideo, {});
    const [videoId, setVideoId] = useState<string>('');
    const [video, setVideo] = useState<VideoData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [thumbnail, setThumbnail] = useState<ThumbnailUploadState>({
        url: null,
        key: null,
        uploading: false,
        error: null,
    });
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        async function loadVideo() {
            try {
                const resolvedParams = await params;
                setVideoId(resolvedParams.id);

                const response = await fetch(`/api/admin/videos/${resolvedParams.id}`);
                if (!response.ok) {
                    throw new Error('Vídeo não encontrado');
                }

                const data = await response.json();
                setVideo(data);

                if (data.thumbnail) {
                    setThumbnail({
                        url: data.thumbnail.url,
                        key: data.thumbnail.r2Key,
                        uploading: false,
                        error: null,
                    });
                }
            } catch (err: any) {
                setError(err.message || 'Erro ao carregar vídeo');
            } finally {
                setLoading(false);
            }
        }

        loadVideo();
    }, [params]);

    const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            setThumbnail(prev => ({ ...prev, error: 'Use: JPEG, PNG ou WebP' }));
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setThumbnail(prev => ({ ...prev, error: 'Máximo: 5MB' }));
            return;
        }

        setThumbnail({ url: null, key: null, uploading: true, error: null });

        try {
            const formData = new FormData();
            formData.append('thumbnail', file);

            const response = await fetch('/api/admin/upload-thumbnail', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Erro no upload');
            }

            setThumbnail({
                url: result.url,
                key: result.key,
                uploading: false,
                error: null,
            });
        } catch (err: any) {
            setThumbnail({
                url: video?.thumbnail?.url || null,
                key: video?.thumbnail?.r2Key || null,
                uploading: false,
                error: err.message || 'Erro no upload',
            });
        }
    };

    const removeThumbnail = () => {
        setThumbnail({ url: null, key: null, uploading: false, error: null });
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                    <p className="text-gray-600">Carregando vídeo...</p>
                </div>
            </div>
        );
    }

    if (error || !video) {
        return (
            <div className="space-y-6 bg-gray-50 min-h-screen p-6 rounded-lg">
                <div className="flex items-center space-x-4">
                    <Link href="/admin/videos">
                        <Button variant="ghost" size="sm" className="text-gray-700 hover:text-gray-900 hover:bg-gray-200">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900">Erro</h1>
                </div>
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    <strong>Erro:</strong> {error || 'Vídeo não encontrado'}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 bg-gray-50 min-h-screen p-6 rounded-lg">

            <div className="flex items-center space-x-4">
                <Link href="/admin/videos">
                    <Button variant="ghost" size="sm" className="text-gray-700 hover:text-gray-900 hover:bg-gray-200">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Editar Vídeo</h1>
                    <p className="text-gray-600">/{video.slug} • {video.views} views</p>
                </div>
            </div>

            <form action={action} className="space-y-6">

                <input type="hidden" name="videoId" value={videoId} />

                <input type="hidden" name="r2ThumbnailUrl" value={thumbnail.url || ''} />
                <input type="hidden" name="r2ThumbnailKey" value={thumbnail.key || ''} />

                {state.error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
                        <strong className="font-bold">Erro: </strong>
                        <span className="block sm:inline">{state.error}</span>
                    </div>
                )}

                <div className="grid gap-6 md:grid-cols-2">

                    <Card className="border-gray-200 shadow-sm bg-white">
                        <CardHeader className="border-b border-gray-100 pb-4">
                            <CardTitle className="text-gray-900">Fonte do Vídeo</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <label htmlFor="streamUrl" className="text-sm font-medium text-gray-700">
                                    URL do Stream (m3u8) *
                                </label>
                                <div className="relative">
                                    <PlayCircle className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="streamUrl"
                                        name="streamUrl"
                                        defaultValue={video.embed?.hlsUrl || ''}
                                        placeholder="https://vazounudes.net/hls/.../playlist.m3u8"
                                        className="pl-9 border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="duration" className="text-sm font-medium text-gray-700">
                                    Duração (segundos)
                                </label>
                                <Input
                                    id="duration"
                                    name="duration"
                                    type="number"
                                    placeholder="Ex: 240"
                                    defaultValue={video.duration}
                                    className="border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-2 border-dashed border-gray-300 shadow-sm bg-gray-50/50">
                        <CardHeader className="border-b border-gray-100 pb-4">
                            <CardTitle className="flex items-center gap-2 text-gray-900">
                                <Upload className="h-5 w-5 text-blue-600" />
                                Thumbnail (R2)
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-4">
                            {thumbnail.url ? (
                                <div className="relative">
                                    <div className="relative aspect-video rounded-lg overflow-hidden bg-black border border-gray-200 shadow-sm">
                                        <Image
                                            src={thumbnail.url}
                                            alt="Thumbnail Preview"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        className="absolute top-2 right-2 shadow-sm"
                                        onClick={removeThumbnail}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                    <div className="mt-2 flex items-center gap-2 text-sm text-green-700 bg-green-50 p-2 rounded border border-green-200">
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                        Thumbnail hospedada no R2.
                                    </div>
                                </div>
                            ) : (
                                <div
                                    className={`
                                        relative aspect-video rounded-lg border-2 border-dashed
                                        flex flex-col items-center justify-center gap-2 cursor-pointer
                                        transition-all duration-200 bg-white
                                        ${thumbnail.uploading
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
                                        }
                                    `}
                                    onClick={() => !thumbnail.uploading && fileInputRef.current?.click()}
                                >
                                    {thumbnail.uploading ? (
                                        <>
                                            <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                                            <span className="text-sm text-gray-600">Fazendo upload...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="h-8 w-8 text-gray-400" />
                                            <span className="text-sm text-gray-600 font-medium">
                                                Clique para fazer upload de nova thumbnail
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                JPEG, PNG ou WebP (máx. 5MB)
                                            </span>
                                        </>
                                    )}
                                </div>
                            )}

                            {thumbnail.error && (
                                <p className="text-sm text-red-600 bg-red-50 p-2 rounded border border-red-200">{thumbnail.error}</p>
                            )}

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/jpeg,image/jpg,image/png,image/webp"
                                className="hidden"
                                onChange={handleThumbnailUpload}
                            />
                        </CardContent>
                    </Card>
                </div>

                <Card className="border-gray-200 shadow-sm bg-white">
                    <CardHeader className="border-b border-gray-100 pb-4">
                        <CardTitle className="text-gray-900">SEO & Conteúdo</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <label htmlFor="title" className="text-sm font-medium text-gray-700">
                                    Título SEO (Meta Title) *
                                </label>
                                <Input
                                    id="title"
                                    name="title"
                                    defaultValue={video.metaTitle}
                                    placeholder="Ex: Mc Mirella Pelada Vazada"
                                    maxLength={60}
                                    required
                                    className="border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
                                />
                                <p className="text-xs text-gray-500">Máximo 60 caracteres</p>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="h1Title" className="text-sm font-medium text-gray-700">
                                    Título da Página (H1)
                                </label>
                                <Input
                                    id="h1Title"
                                    name="h1Title"
                                    defaultValue={video.h1Title}
                                    placeholder="Ex: Vídeo da Mc Mirella Pelada Vazado"
                                    maxLength={100}
                                    className="border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
                                />
                                <p className="text-xs text-gray-500">Opcional. Se vazio, usa o Título SEO.</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="description" className="text-sm font-medium text-gray-700">
                                Meta Descrição
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                defaultValue={video.metaDescription}
                                className="flex min-h-[100px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base text-gray-900 ring-offset-background placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                                placeholder="Descrição rica para atrair cliques no Google..."
                                maxLength={160}
                            />
                            <p className="text-xs text-gray-500">Máximo 160 caracteres</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-gray-200 shadow-sm bg-white">
                    <CardHeader className="border-b border-gray-100 pb-4">
                        <CardTitle className="text-gray-900">Categorização</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-4">
                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="space-y-2">
                                <label htmlFor="models" className="text-sm font-medium text-gray-700">
                                    Modelos
                                </label>
                                <Input
                                    id="models"
                                    name="models"
                                    defaultValue={video.models.map(m => m.name).join(', ')}
                                    placeholder="Mc Mirella, Outra Modelo"
                                    className="border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
                                />
                                <p className="text-xs text-gray-500">Separe por vírgula</p>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="categories" className="text-sm font-medium text-gray-700">
                                    Categorias
                                </label>
                                <Input
                                    id="categories"
                                    name="categories"
                                    defaultValue={video.categories.map(c => c.name).join(', ')}
                                    placeholder="Amador, Funk, Solo"
                                    className="border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
                                />
                                <p className="text-xs text-gray-500">Separe por vírgula</p>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="tags" className="text-sm font-medium text-gray-700">
                                    Tags
                                </label>
                                <Input
                                    id="tags"
                                    name="tags"
                                    defaultValue={video.tags.map(t => t.name).join(', ')}
                                    placeholder="vazado, caiu na net, famoso"
                                    className="border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
                                />
                                <p className="text-xs text-gray-500">Separe por vírgula</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                    <Link href="/admin/videos">
                        <Button type="button" variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900">
                            Cancelar
                        </Button>
                    </Link>
                    <SubmitButton />
                </div>
            </form>
        </div>
    );
}
