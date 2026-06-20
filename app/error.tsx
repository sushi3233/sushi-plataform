'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {

        console.error('Application error:', error);
    }, [error]);

    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-destructive/10">
                <AlertTriangle className="h-12 w-12 text-destructive" />
            </div>

            <h1 className="mb-2 text-3xl font-bold">Algo deu errado!</h1>

            <p className="mb-8 max-w-md text-muted-foreground">
                Ocorreu um erro inesperado. Por favor, tente novamente.
                Se o problema persistir, volte à página inicial.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
                <Button onClick={reset} className="gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Tentar Novamente
                </Button>

                <Link href="/">
                    <Button variant="outline" className="gap-2">
                        <Home className="h-4 w-4" />
                        Voltar ao Início
                    </Button>
                </Link>
            </div>
        </div>
    );
}
