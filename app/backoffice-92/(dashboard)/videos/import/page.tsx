'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Download, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export default function ImportVideoPage() {
    const router = useRouter();
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<{
        success: boolean;
        message: string;
        videoId?: string;
    } | null>(null);

    const handleImport = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setResult(null);

        try {
            const response = await fetch('/api/backoffice-92/scrape', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url }),
            });

            const data = await response.json();

            if (response.ok) {
                setResult({
                    success: true,
                    message: `Vídeo "${data.title}" importado com sucesso!`,
                    videoId: data.videoId,
                });
                setUrl('');

                setTimeout(() => {
                    router.push(`/backoffice-92/videos`);
                }, 2000);
            } else {
                setResult({
                    success: false,
                    message: data.error || 'Erro ao importar vídeo',
                });
            }
        } catch (error: any) {
            setResult({
                success: false,
                message: error.message || 'Erro ao conectar com o servidor',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">

            <div className="flex items-center space-x-4">
                <Link href="/backoffice-92/videos">
                    <Button variant="ghost" size="sm">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Importar Vídeo</h1>
                    <p className="text-muted-foreground">
                        Cole a URL do xvideosbuceta.com para importar automaticamente
                    </p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>URL do Vídeo</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleImport} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="url" className="text-sm font-medium text-foreground">
                                URL do xvideosbuceta.com
                            </label>
                            <Input
                                id="url"
                                type="url"
                                placeholder="https://xvideosbuceta.com/video/..."
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                required
                                disabled={loading}
                            />
                            <p className="text-xs text-muted-foreground">
                                O sistema irá extrair automaticamente: título, duração, modelos, categorias, tags e
                                processar a thumbnail diretamente para o R2.
                            </p>
                        </div>

                        <Button type="submit" disabled={loading || !url}>
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Importando...
                                </>
                            ) : (
                                <>
                                    <Download className="mr-2 h-4 w-4" />
                                    Importar Vídeo
                                </>
                            )}
                        </Button>
                    </form>

                    {result && (
                        <div
                            className={`mt-4 p-4 rounded-lg flex items-start space-x-3 ${result.success
                                ? 'bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-300'
                                : 'bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-300'
                                }`}
                        >
                            {result.success ? (
                                <CheckCircle className="h-5 w-5 mt-0.5" />
                            ) : (
                                <AlertCircle className="h-5 w-5 mt-0.5" />
                            )}
                            <div>
                                <p className="font-medium">{result.message}</p>
                                {result.success && (
                                    <p className="text-sm mt-1">
                                        Redirecionando para a listagem de vídeos...
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Como funciona?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                    <p>1. Cole a URL completa do vídeo no xvideosbuceta.com</p>
                    <p>2. O sistema fará scraping automático de todos os metadados</p>
                    <p>3. A thumbnail de capa será processada e enviada para o R2 com SEO otimizado</p>
                    <p>4. O vídeo será salvo como <strong>RASCUNHO</strong> por segurança</p>
                    <p>5. Você será redirecionado para a listagem principal onde poderá editar ou publicar o vídeo</p>
                </CardContent>
            </Card>
        </div>
    );
}
