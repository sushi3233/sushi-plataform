import Link from 'next/link';
import XvideosPrimeLogo from '@/app/logos/xvideosprime-logo';
import { SearchBar } from './search-bar';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 md:h-24 items-center justify-between px-4">

        <Link href="/" className="flex items-center space-x-2">
          <XvideosPrimeLogo className="h-16 md:h-20 w-auto" />
        </Link>

        <div className="hidden flex-1 max-w-md mx-8 md:flex">
          <SearchBar />
        </div>

        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link
            href="/recentes"
            className="transition-colors hover:text-primary"
          >
            Recentes
          </Link>
          <Link
            href="/mais-vistos"
            className="transition-colors hover:text-primary"
          >
            Mais Vistos
          </Link>
          <Link
            href="/bombando"
            className="transition-colors hover:text-primary"
          >
            Bombando
          </Link>
        </nav>
      </div>

      <div className="container mx-auto px-4 pb-3 md:hidden space-y-3">
        <SearchBar />

        <nav className="flex items-center gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide">
          <Link
            href="/recentes"
            className="flex-shrink-0 rounded-full bg-secondary/50 px-4 py-1.5 text-xs font-medium hover:bg-secondary hover:text-primary transition-colors border border-border/50"
          >
            Recentes
          </Link>
          <Link
            href="/mais-vistos"
            className="flex-shrink-0 rounded-full bg-secondary/50 px-4 py-1.5 text-xs font-medium hover:bg-secondary hover:text-primary transition-colors border border-border/50"
          >
            Mais Vistos
          </Link>
          <Link
            href="/bombando"
            className="flex-shrink-0 rounded-full bg-secondary/50 px-4 py-1.5 text-xs font-medium hover:bg-secondary hover:text-primary transition-colors border border-border/50"
          >
            Bombando
          </Link>
          <Link
            href="/videos/brasileiro"
            className="flex-shrink-0 rounded-full bg-secondary/50 px-4 py-1.5 text-xs font-medium hover:bg-secondary hover:text-primary transition-colors border border-border/50"
          >
            Brasileiro
          </Link>
          <Link
            href="/videos/amador"
            className="flex-shrink-0 rounded-full bg-secondary/50 px-4 py-1.5 text-xs font-medium hover:bg-secondary hover:text-primary transition-colors border border-border/50"
          >
            Amador
          </Link>
        </nav>
      </div>
    </header>
  );
}
