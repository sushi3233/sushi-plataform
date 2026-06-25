'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    AlertCircle,
    ArrowLeft,
    CheckCircle,
    Clock,
    FileJson,
    ImageOff,
    Loader2,
    PlayCircle,
    RotateCcw,
    Send,
    Upload,
    X,
} from 'lucide-react';

type Step = 'paste' | 'importing' | 'review';

interface ScrapeResultItem {
    url: string;
    success: boolean;
    videoId?: string;
    title?: string;
    slug?: string;
    missingThumbnail?: boolean;
    error?: string;
}

interface ImportedVideo {
    id: string;
    slug: string;
    metaTitle: string;
    metaDescription: string;
    h1Title: string;
    models: string;
    categories: string;
    tags: string;
    durationSeconds: number;
    durationInput: string;
    hlsUrl: string;
    thumbnailUrl: string | null;
    thumbnailKey: string | null;
    missingThumbnail: boolean;
    selected: boolean;
}

interface PublishResult {
    published: number;
    failed: number;
    errors: string[];
}

interface AdminVideoApiItem {
    id: string;
    slug: string;
    metaTitle: string;
    metaDescription: string;
    h1Title: string;
    duration: number;
    models: Array<{ name: string }>;
    categories: Array<{ name: string }>;
    tags: Array<{ name: string }>;
    thumbnail: { url: string; r2Key: string } | null;
    embed: { hlsUrl: string } | null;
}

interface AdminVideoResponse {
    videos: AdminVideoApiItem[];
}

const BATCH_SIZE = 10;

function getErrorMessage(error: unknown): string {
    return error instanceof Error ? error.message : 'Erro inesperado';
}

function parseTaxonomyInput(input: string): string[] {
    const result: string[] = [];
    const seen = new Set<string>();
    for (const rawPart of input.split(/[\n,;]+/)) {
        const normalized = rawPart.replace(/\s+/g, ' ').trim();
        if (!normalized) continue;
        const key = normalized.toLocaleLowerCase('pt-BR');
        if (seen.has(key)) continue;
        seen.add(key);
        result.push(normalized);
    }
    return result;
}

function normalizeSlugInput(input: string): string {
    return input
        .toLowerCase()
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/-{2,}/g, '-')
        .replace(/(^-|-$)/g, '');
}

function secondsToTimeString(seconds: number): string {
    if (!seconds || seconds <= 0) return '';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    const mm = String(m).padStart(2, '0');
    const ss = String(s).padStart(2, '0');
    return h > 0 ? `${h}:${mm}:${ss}` : `${m}:${ss}`;
}

function timeStringToSeconds(input: string): number {
    const parts = input.trim().split(':').map((p) => parseInt(p, 10));
    if (parts.some(isNaN)) return 0;
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    return 0;
}

const ALLOWED_THUMB_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_THUMB_SIZE_BYTES = 5 * 1024 * 1024;

interface VideoCardProps {
    video: ImportedVideo;
    onUpdate: (id: string, field: keyof ImportedVideo, value: string | boolean | number | null) => void;
}

function VideoReviewCard({ video, onUpdate }: VideoCardProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [thumbUploading, setThumbUploading] = useState(false);
    const [thumbError, setThumbError] = useState<string | null>(null);

    const handleThumbnailFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!ALLOWED_THUMB_TYPES.includes(file.type)) {
            setThumbError('Formato inválido. Use JPEG, PNG ou WebP.');
            return;
        }
        if (file.size > MAX_THUMB_SIZE_BYTES) {
            setThumbError('Arquivo muito grande. Máximo: 5 MB.');
            return;
        }
        setThumbUploading(true);
        setThumbError(null);
        try {
            const formData = new FormData();
            formData.append('thumbnail', file);
            const response = await fetch('/api/backoffice-92/upload-thumbnail', {
                method: 'POST',
                body: formData,
            });
            const data = (await response.json()) as { url?: string; key?: string; error?: string };
            if (!response.ok) throw new Error(data.error || 'Erro no upload');
            onUpdate(video.id, 'thumbnailUrl', data.url ?? '');
            onUpdate(video.id, 'thumbnailKey', data.key ?? '');
            onUpdate(video.id, 'missingThumbnail', false);
        } catch (err: unknown) {
            setThumbError(err instanceof Error ? err.message : 'Erro ao fazer upload');
        } finally {
            setThumbUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleRemoveThumbnail = () => {
        onUpdate(video.id, 'thumbnailUrl', '');
        onUpdate(video.id, 'thumbnailKey', null);
        onUpdate(video.id, 'missingThumbnail', true);
        setThumbError(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className={`rounded-lg border bg-white shadow-sm ${video.selected ? 'border-blue-300' : 'border-gray-200'}`}>
            <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                className="hidden"
                onChange={handleThumbnailFileChange}
            />

            <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-3">
                <input
                    type="checkbox"
                    id={`select-${video.id}`}
                    checked={video.selected}
                    onChange={(e) => onUpdate(video.id, 'selected', e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 accent-blue-600 cursor-pointer"
                />
                <label htmlFor={`select-${video.id}`} className="cursor-pointer flex-1 text-sm font-medium text-gray-700 truncate">
                    {video.metaTitle || 'Sem título'}
                </label>
                {video.missingThumbnail ? (
                    <span className="flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800">
                        <ImageOff className="h-3 w-3" />
                        Sem thumbnail
                    </span>
                ) : (
                    <span className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                        <CheckCircle className="h-3 w-3" />
                        Pronto
                    </span>
                )}
            </div>

            <div className="grid gap-4 p-4 md:grid-cols-2">
                <div className="space-y-4">
                    <div>
                        <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500">Thumbnail (R2)</p>
                        {thumbUploading ? (
                            <div className="flex aspect-video items-center justify-center rounded-lg border-2 border-blue-300 bg-blue-50">
                                <div className="text-center">
                                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-500" />
                                    <p className="mt-2 text-xs text-blue-600">Fazendo upload...</p>
                                </div>
                            </div>
                        ) : video.thumbnailUrl ? (
                            <div className="relative">
                                <div className="relative aspect-video overflow-hidden rounded-lg border border-gray-200 bg-black shadow-sm">
                                    <Image
                                        src={video.thumbnailUrl}
                                        alt={video.metaTitle}
                                        fill
                                        className="object-cover"
                                        unoptimized
                                    />
                                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-2 py-1">
                                        <p className="truncate text-xs text-white/80">{video.thumbnailUrl}</p>
                                    </div>
                                </div>
                                <div className="mt-2 flex gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="flex-1 text-xs"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <Upload className="mr-1.5 h-3 w-3" />
                                        Trocar thumbnail
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                                        onClick={handleRemoveThumbnail}
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div
                                className="flex aspect-video cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-yellow-300 bg-yellow-50 transition-colors hover:border-blue-400 hover:bg-blue-50"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <div className="text-center">
                                    <Upload className="mx-auto h-8 w-8 text-gray-400" />
                                    <p className="mt-1 text-xs font-medium text-gray-600">Clique para fazer upload</p>
                                    <p className="text-xs text-gray-400">JPEG, PNG ou WebP (máx 5 MB)</p>
                                </div>
                            </div>
                        )}
                        {thumbError && <p className="mt-1.5 text-xs text-red-600">{thumbError}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Stream (m3u8)</p>
                        <div className="flex items-center gap-2">
                            <div className="relative flex-1">
                                <PlayCircle className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                                <Input
                                    value={video.hlsUrl}
                                    readOnly
                                    className="pl-9 font-mono text-xs bg-gray-50 border-gray-200 text-gray-600 cursor-default"
                                    title={video.hlsUrl}
                                />
                            </div>
                            {video.hlsUrl && (
                                <a href={video.hlsUrl} target="_blank" rel="noopener noreferrer">
                                    <Button type="button" variant="outline" size="sm" className="shrink-0">▶</Button>
                                </a>
                            )}
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label
                            htmlFor={`duration-${video.id}`}
                            className="text-xs font-semibold uppercase tracking-wide text-gray-500 flex items-center gap-1"
                        >
                            <Clock className="h-3 w-3" />
                            Duração (MM:SS ou H:MM:SS)
                        </label>
                        <Input
                            id={`duration-${video.id}`}
                            value={video.durationInput}
                            onChange={(e) => onUpdate(video.id, 'durationInput', e.target.value)}
                            onBlur={(e) => {
                                const secs = timeStringToSeconds(e.target.value);
                                onUpdate(video.id, 'durationSeconds', secs);
                                if (secs > 0) onUpdate(video.id, 'durationInput', secondsToTimeString(secs));
                            }}
                            placeholder="Ex: 12:34 ou 1:02:34"
                            className={`font-mono ${video.durationSeconds === 0 && video.durationInput
                                ? 'border-red-300 focus:border-red-500'
                                : 'border-gray-300'}`}
                        />
                        {video.durationSeconds > 0 && (
                            <p className="text-xs text-gray-500">{video.durationSeconds} segundos</p>
                        )}
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="space-y-1.5">
                        <label htmlFor={`slug-${video.id}`} className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Slug <span className="text-gray-400 font-normal normal-case">editável</span>
                        </label>
                        <div className="flex items-center gap-2">
                            <span className="rounded-md border border-gray-200 bg-gray-50 px-2 py-2 text-xs text-gray-500">/</span>
                            <Input
                                id={`slug-${video.id}`}
                                value={video.slug}
                                onChange={(e) => onUpdate(video.id, 'slug', e.target.value)}
                                onBlur={(e) => onUpdate(video.id, 'slug', normalizeSlugInput(e.target.value))}
                                className="font-mono text-sm"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label htmlFor={`metaTitle-${video.id}`} className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Meta título <span className="text-gray-400 font-normal normal-case">máx 60</span>
                        </label>
                        <Input
                            id={`metaTitle-${video.id}`}
                            value={video.metaTitle}
                            maxLength={60}
                            onChange={(e) => onUpdate(video.id, 'metaTitle', e.target.value)}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label htmlFor={`h1Title-${video.id}`} className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Título H1 <span className="text-gray-400 font-normal normal-case">máx 100</span>
                        </label>
                        <Input
                            id={`h1Title-${video.id}`}
                            value={video.h1Title}
                            maxLength={100}
                            onChange={(e) => onUpdate(video.id, 'h1Title', e.target.value)}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label htmlFor={`desc-${video.id}`} className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Meta descrição <span className="text-gray-400 font-normal normal-case">máx 160</span>
                        </label>
                        <textarea
                            id={`desc-${video.id}`}
                            value={video.metaDescription}
                            maxLength={160}
                            rows={2}
                            onChange={(e) => onUpdate(video.id, 'metaDescription', e.target.value)}
                            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label htmlFor={`models-${video.id}`} className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Modelos <span className="text-gray-400 font-normal normal-case">separar por vírgula</span>
                        </label>
                        <Input
                            id={`models-${video.id}`}
                            value={video.models}
                            onChange={(e) => onUpdate(video.id, 'models', e.target.value)}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label htmlFor={`categories-${video.id}`} className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Categorias <span className="text-gray-400 font-normal normal-case">separar por vírgula</span>
                        </label>
                        <Input
                            id={`categories-${video.id}`}
                            value={video.categories}
                            onChange={(e) => onUpdate(video.id, 'categories', e.target.value)}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label htmlFor={`tags-${video.id}`} className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Tags <span className="text-gray-400 font-normal normal-case">separar por vírgula</span>
                        </label>
                        <Input
                            id={`tags-${video.id}`}
                            value={video.tags}
                            onChange={(e) => onUpdate(video.id, 'tags', e.target.value)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ImportJsonPage() {
    const [step, setStep] = useState<Step>('paste');
    const [jsonText, setJsonText] = useState('');
    const [jsonError, setJsonError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [importProgress, setImportProgress] = useState(0);
    const [importTotal, setImportTotal] = useState(0);
    const [importResults, setImportResults] = useState<ScrapeResultItem[]>([]);
    const [importErrors, setImportErrors] = useState<ScrapeResultItem[]>([]);

    const [videos, setVideos] = useState<ImportedVideo[]>([]);
    const [publishing, setPublishing] = useState(false);
    const [publishResult, setPublishResult] = useState<PublishResult | null>(null);

    const handleFileLoad = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            setJsonText((ev.target?.result as string) || '');
            setJsonError(null);
        };
        reader.readAsText(file, 'utf-8');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const parseJson = (): unknown[] | null => {
        try {
            const parsed = JSON.parse(jsonText) as unknown;
            if (Array.isArray(parsed)) return parsed;
            if (typeof parsed === 'object' && parsed !== null) {
                const videos = (parsed as Record<string, unknown>).videos;
                if (Array.isArray(videos)) return videos;
            }
            setJsonError('JSON inválido: esperado um array de vídeos ou { videos: [...] }');
            return null;
        } catch {
            setJsonError('JSON inválido: verifique a formatação');
            return null;
        }
    };

    const fetchDraftVideos = useCallback(async (ids: string[]): Promise<ImportedVideo[]> => {
        if (ids.length === 0) return [];
        const params = new URLSearchParams();
        ids.forEach((id) => params.append('ids', id));
        const response = await fetch(`/api/backoffice-92/videos?${params.toString()}`);
        if (!response.ok) return [];
        const data = (await response.json()) as AdminVideoResponse;
        return data.videos.map((video) => {
            const durationSecs = video.duration || 0;
            return {
                id: video.id,
                slug: video.slug || '',
                metaTitle: video.metaTitle || '',
                metaDescription: video.metaDescription || '',
                h1Title: video.h1Title || '',
                durationSeconds: durationSecs,
                durationInput: secondsToTimeString(durationSecs),
                models: video.models.map((m) => m.name).join(', '),
                categories: video.categories.map((c) => c.name).join(', '),
                tags: video.tags.map((t) => t.name).join(', '),
                hlsUrl: video.embed?.hlsUrl || '',
                thumbnailUrl: video.thumbnail?.url || null,
                thumbnailKey: video.thumbnail?.r2Key || null,
                missingThumbnail: !video.thumbnail,
                selected: true,
            };
        });
    }, []);

    const handleImport = async () => {
        setJsonError(null);
        const rawVideos = parseJson();
        if (!rawVideos) return;
        if (rawVideos.length === 0) {
            setJsonError('Nenhum vídeo encontrado no JSON');
            return;
        }

        setStep('importing');
        setImportTotal(rawVideos.length);
        setImportProgress(0);
        setImportResults([]);
        setImportErrors([]);

        const allResults: ScrapeResultItem[] = [];

        for (let i = 0; i < rawVideos.length; i += BATCH_SIZE) {
            const batch = rawVideos.slice(i, i + BATCH_SIZE);
            try {
                const response = await fetch('/api/backoffice-92/scrape/import-json', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ videos: batch }),
                });
                const data = (await response.json()) as { results?: ScrapeResultItem[]; error?: string };
                const batchResults = response.ok && Array.isArray(data.results)
                    ? data.results
                    : batch.map((_, j) => ({
                        url: (batch[j] as Record<string, string>)?.url || '',
                        success: false,
                        error: data.error || 'Erro no lote',
                    }));
                allResults.push(...batchResults);
            } catch (err) {
                allResults.push(...batch.map((_, j) => ({
                    url: (batch[j] as Record<string, string>)?.url || '',
                    success: false,
                    error: getErrorMessage(err),
                })));
            }
            setImportProgress(Math.min(allResults.length, rawVideos.length));
            setImportResults([...allResults]);
        }

        setImportErrors(allResults.filter((r) => !r.success));
        const createdIds = allResults
            .filter((r) => r.success && r.videoId)
            .map((r) => r.videoId as string);
        setVideos(await fetchDraftVideos(createdIds));
        setStep('review');
    };

    const updateVideo = (id: string, field: keyof ImportedVideo, value: string | boolean | number | null) => {
        setVideos((prev) => prev.map((v) => (v.id === id ? { ...v, [field]: value } : v)));
    };

    const handlePublish = async () => {
        const selected = videos.filter((v) => v.selected);
        if (selected.length === 0) return;
        setPublishing(true);
        setPublishResult(null);
        try {
            const response = await fetch('/api/backoffice-92/scrape/bulk/publish', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    videos: selected.map((v) => ({
                        id: v.id,
                        slug: v.slug,
                        metaTitle: v.metaTitle,
                        metaDescription: v.metaDescription,
                        h1Title: v.h1Title || v.metaTitle,
                        duration: v.durationSeconds,
                        models: parseTaxonomyInput(v.models),
                        categories: parseTaxonomyInput(v.categories),
                        tags: parseTaxonomyInput(v.tags),
                        thumbnailUrl: v.thumbnailUrl,
                        thumbnailKey: v.thumbnailKey,
                    })),
                }),
            });
            const data = (await response.json()) as {
                published?: number;
                failed?: number;
                publishedIds?: string[];
                errors?: string[];
                error?: string;
            };
            if (!response.ok) {
                setPublishResult({ published: 0, failed: selected.length, errors: [data.error || 'Falha ao publicar'] });
                return;
            }
            setPublishResult({
                published: data.published || 0,
                failed: data.failed || 0,
                errors: data.errors || [],
            });
            const publishedIds = new Set(data.publishedIds || []);
            setVideos((prev) => prev.filter((v) => !publishedIds.has(v.id)));
        } catch (err) {
            setPublishResult({ published: 0, failed: selected.length, errors: [getErrorMessage(err)] });
        } finally {
            setPublishing(false);
        }
    };

    const selectedCount = videos.filter((v) => v.selected).length;
    const blockedSelected = videos.filter((v) => v.selected && v.missingThumbnail).length;
    const allSelected = videos.length > 0 && selectedCount === videos.length;
    const progressPct = importTotal ? Math.round((importProgress / importTotal) * 100) : 0;
    const successCount = importResults.filter((r) => r.success).length;

    const statusHint = useMemo(
        () => (blockedSelected > 0 ? `${blockedSelected} selecionado(s) sem thumbnail — não serão publicados.` : null),
        [blockedSelected]
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-4">
                <Link href="/backoffice-92/videos">
                    <Button variant="ghost" size="sm">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div className="flex-1">
                    <h1 className="text-3xl font-bold">Importar JSON do Scraper</h1>
                    <p className="text-sm text-gray-500 mt-0.5">Cole ou faça upload do arquivo gerado pelo scraper local</p>
                </div>
                {step !== 'paste' && (
                    <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Reiniciar
                    </Button>
                )}
            </div>

            {step === 'paste' && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileJson className="h-5 w-5" />
                            Cole o JSON do scraper
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-2">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".json,application/json"
                                className="hidden"
                                onChange={handleFileLoad}
                            />
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <Upload className="mr-2 h-4 w-4" />
                                Carregar arquivo .json
                            </Button>
                            {jsonText && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="text-gray-400 hover:text-gray-600"
                                    onClick={() => { setJsonText(''); setJsonError(null); }}
                                >
                                    <X className="mr-1 h-4 w-4" />
                                    Limpar
                                </Button>
                            )}
                        </div>

                        <textarea
                            value={jsonText}
                            onChange={(e) => { setJsonText(e.target.value); setJsonError(null); }}
                            placeholder={'Cole aqui o conteúdo do arquivo resultado_TIMESTAMP.json gerado pelo scraper...\n\nExemplo:\n{\n  "videos": [\n    { "title": "...", "vazounudesUUID": "...", ... }\n  ]\n}'}
                            rows={12}
                            className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 font-mono text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            spellCheck={false}
                        />

                        {jsonError && (
                            <div className="flex items-center gap-2 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                                <AlertCircle className="h-4 w-4 shrink-0" />
                                {jsonError}
                            </div>
                        )}

                        {jsonText && (
                            <Button onClick={handleImport} disabled={!jsonText.trim()}>
                                <FileJson className="mr-2 h-4 w-4" />
                                Importar vídeos
                            </Button>
                        )}
                    </CardContent>
                </Card>
            )}

            {step === 'importing' && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Importando vídeos...
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-2xl font-bold tabular-nums">
                            {importProgress}/{importTotal}{' '}
                            <span className="text-base font-normal text-gray-500">({progressPct}%)</span>
                        </p>
                        <div className="h-3 overflow-hidden rounded-full bg-gray-200">
                            <div
                                className="h-full bg-blue-600 transition-all duration-300"
                                style={{ width: `${progressPct}%` }}
                            />
                        </div>
                        <p className="text-sm text-gray-600">
                            Sucesso: {successCount} &nbsp;|&nbsp; Falhas: {importErrors.length}
                        </p>
                        <p className="text-xs text-gray-400">
                            Aguarde — fazendo upload das thumbnails e criando os vídeos no banco...
                        </p>
                    </CardContent>
                </Card>
            )}

            {step === 'review' && (
                <div className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Revisão e Publicação</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {statusHint && (
                                <div className="flex items-center gap-2 rounded border border-yellow-300 bg-yellow-50 p-3 text-sm text-yellow-800">
                                    <AlertCircle className="h-4 w-4 shrink-0" />
                                    {statusHint}
                                </div>
                            )}

                            {publishResult && (
                                <div className="rounded border border-green-200 bg-green-50 p-3">
                                    <p className="text-sm font-medium text-green-800">
                                        Publicados: {publishResult.published} &nbsp;|&nbsp; Falhas: {publishResult.failed}
                                    </p>
                                    {publishResult.errors.map((err, i) => (
                                        <p key={i} className="text-xs text-red-600 mt-1">{err}</p>
                                    ))}
                                </div>
                            )}

                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    className="text-sm text-blue-600 hover:underline"
                                    onClick={() => setVideos((prev) => prev.map((v) => ({ ...v, selected: !allSelected })))}
                                >
                                    {allSelected ? 'Desmarcar todos' : 'Selecionar todos'}
                                </button>
                                <Button onClick={handlePublish} disabled={publishing || selectedCount === 0}>
                                    {publishing ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <Send className="mr-2 h-4 w-4" />
                                    )}
                                    Publicar ({selectedCount})
                                </Button>
                            </div>

                            <div className="space-y-4">
                                {videos.map((video) => (
                                    <VideoReviewCard key={video.id} video={video} onUpdate={updateVideo} />
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {importErrors.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-red-600">Falhas na Importação</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-1">
                                {importErrors.map((err, i) => (
                                    <p key={i} className="text-sm text-red-600">
                                        <span className="font-mono text-xs text-gray-500">{err.url}</span> — {err.error}
                                    </p>
                                ))}
                            </CardContent>
                        </Card>
                    )}

                    {videos.length === 0 && importErrors.length === 0 && (
                        <Card>
                            <CardContent className="py-8 text-center text-sm text-gray-500">
                                Nenhum vídeo novo foi importado.
                            </CardContent>
                        </Card>
                    )}
                </div>
            )}
        </div>
    );
}
