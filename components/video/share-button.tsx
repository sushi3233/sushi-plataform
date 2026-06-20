'use client';

import { useState, useEffect } from 'react';
import { Share2, Copy, Check, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ShareButtonProps {
    url: string;
    title: string;
}

export function ShareButton({ url, title }: ShareButtonProps) {
    const [copied, setCopied] = useState(false);
    const [canShare, setCanShare] = useState(false);

    useEffect(() => {

        setCanShare(typeof navigator !== 'undefined' && 'share' in navigator);
    }, []);

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const handleShareWhatsApp = () => {
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${title}\n${url}`)}`;
        window.open(whatsappUrl, '_blank');
    };

    const handleShare = () => {
        if (canShare) {
            navigator.share({
                title,
                url,
            });
        }
    };

    return (
        <div className="flex items-center gap-2">
            <Button
                variant="outline"
                size="sm"
                onClick={handleCopyLink}
                className="gap-2"
            >
                {copied ? (
                    <>
                        <Check className="h-4 w-4 text-green-500" />
                        Copiado!
                    </>
                ) : (
                    <>
                        <Copy className="h-4 w-4" />
                        Copiar Link
                    </>
                )}
            </Button>

            <Button
                variant="outline"
                size="sm"
                onClick={handleShareWhatsApp}
                className="gap-2 hover:bg-green-50 hover:border-green-500 hover:text-green-600"
            >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
            </Button>

            {canShare && (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleShare}
                    className="gap-2"
                >
                    <Share2 className="h-4 w-4" />
                    Compartilhar
                </Button>
            )}
        </div>
    );
}
