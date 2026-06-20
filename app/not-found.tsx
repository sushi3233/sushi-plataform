import Link from 'next/link';
import { FileQuestion, Home, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
                <FileQuestion className="h-12 w-12 text-primary" />
            </div>

            <h1 className="mb-2 text-4xl font-bold">404</h1>
            <h2 className="mb-4 text-xl font-semibold text-muted-foreground">
                Página não encontrada
            </h2>

            <p className="mb-8 max-w-md text-muted-foreground">
                Ops! Parece que você está procurando algo que não existe.
                O vídeo pode ter sido removido ou o link pode estar incorreto.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
                <Link href="/">
                    <Button className="gap-2">
                        <Home className="h-4 w-4" />
                        Voltar ao Início
                    </Button>
                </Link>

                <Link href="/busca">
                    <Button variant="outline" className="gap-2">
                        <Search className="h-4 w-4" />
                        Buscar Vídeos
                    </Button>
                </Link>
            </div>
        </div>
    );
}
