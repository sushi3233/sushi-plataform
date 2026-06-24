'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Trash2, Loader2 } from 'lucide-react';
import { deleteVideo } from '@/app/backoffice-92/_actions/video';

interface DeleteVideoButtonProps {
    videoId: string;
    videoTitle: string;
}

export function DeleteVideoButton({ videoId, videoTitle }: DeleteVideoButtonProps) {
    const [deleting, setDeleting] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        const confirmed = window.confirm(
            `Tem certeza que deseja excluir "${videoTitle}"?\n\nEsta ação é irreversível e também removerá a thumbnail do R2.`
        );

        if (!confirmed) return;

        setDeleting(true);

        try {
            const result = await deleteVideo(videoId);

            if (result.error) {
                alert(`Erro ao excluir: ${result.error}`);
            } else {
                router.refresh();
            }
        } catch (error: any) {
            alert(`Erro ao excluir: ${error.message}`);
        } finally {
            setDeleting(false);
        }
    };

    return (
        <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive/80"
            onClick={handleDelete}
            disabled={deleting}
        >
            {deleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                <Trash2 className="h-4 w-4" />
            )}
        </Button>
    );
}
