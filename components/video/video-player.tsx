'use client';

import { useEffect, useRef, useState } from 'react';

interface VideoPlayerProps {
    embed: {
        streamUrl?: string;
        hlsUrl?: string;
        posterUrl: string;
        videoId: string;
    } | null;
    title: string;
}

export function VideoPlayer({ embed, title }: VideoPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [error, setError] = useState<string | null>(null);
    const viewTrackedRef = useRef(false);

    const rawUrl = embed?.hlsUrl || embed?.streamUrl;
    const finalUrl = rawUrl?.includes('vazounudes.net')
        ? `/api/hls-proxy?url=${encodeURIComponent(rawUrl)}`
        : rawUrl;

    useEffect(() => {
        if (!embed) return;

        if (!finalUrl) {
            setError('URL do vídeo não encontrada');
            return;
        }

        import('hls.js')
            .then(({ default: Hls }) => {
                if (!videoRef.current) return;

                if (Hls.isSupported()) {
                    const hls = new Hls({
                        enableWorker: true,
                        lowLatencyMode: false,
                        backBufferLength: 90,
                    });

                    hls.loadSource(finalUrl);
                    hls.attachMedia(videoRef.current);

                    hls.on(Hls.Events.MANIFEST_PARSED, () => {
                        console.log('[VideoPlayer] HLS manifest carregado');
                    });

                    hls.on(Hls.Events.ERROR, (event, data) => {
                        if (data.fatal) {
                            console.error('[VideoPlayer] Erro fatal HLS:', data);
                            setError('Erro ao carregar vídeo');
                        }
                    });

                    const viewTimer = setTimeout(() => {
                        if (!viewTrackedRef.current) {
                            viewTrackedRef.current = true;
                            fetch('/api/views', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ videoId: embed.videoId }),
                            }).catch((err) => console.error('[VideoPlayer] Erro ao registrar view:', err));
                        }
                    }, 3000);

                    return () => {
                        hls.destroy();
                        clearTimeout(viewTimer);
                    };
                } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {

                    videoRef.current.src = finalUrl;
                } else {
                    setError('Navegador não suporta HLS');
                }
            })
            .catch((err) => {
                console.error('[VideoPlayer] Erro ao carregar HLS.js:', err);
                setError('Erro ao inicializar player');
            });
    }, [embed, finalUrl]);

    if (!embed) {
        return (
            <div className="relative w-full aspect-video bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Vídeo não disponível</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="relative w-full aspect-video bg-muted rounded-lg flex items-center justify-center">
                <p className="text-destructive">{error}</p>
            </div>
        );
    }

    return (
        <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
            <video
                ref={videoRef}
                className="w-full h-full"
                controls
                poster={embed.posterUrl}
                preload="metadata"
                playsInline
                aria-label={title}
            >
                {finalUrl && <source src={finalUrl} type="application/x-mpegURL" />}
                Seu navegador não suporta vídeo HTML5.
            </video>
        </div>
    );
}
