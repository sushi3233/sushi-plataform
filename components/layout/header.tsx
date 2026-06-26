'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ChevronDown, Globe, Heart, Search, Star } from 'lucide-react';
import XvideosPrimeLogo from '@/app/logos/xvideosprime-logo';

const NAV_LINKS: { label: string; href: string; icon?: 'star' | 'heart' }[] = [
    { label: 'Pornô Novos',   href: '/recentes',           icon: 'star' },
    { label: 'Bombando Hoje', href: '/bombando',            icon: 'heart' },
    { label: 'Pornô Longo',   href: '/videos/porno-longo' },
    { label: 'Famosas',       href: '/videos/famosas' },
    { label: 'Lésbicas',      href: '/videos/lesbicas' },
    { label: 'Boquetes',      href: '/videos/boquetes' },
    { label: 'Anal',          href: '/videos/anal' },
    { label: 'Gostosas',      href: '/videos/gostosas' },
    { label: 'Novinhas',      href: '/videos/novinhas' },
    { label: 'Coroas',        href: '/videos/coroas' },
    { label: 'Bucetas',       href: '/videos/bucetas' },
    { label: 'Peitudas',      href: '/videos/peitudas' },
];

const LANGUAGES = [
    { code: 'pt', flag: '🇧🇷', label: 'Português' },
    { code: 'en', flag: '🇺🇸', label: 'English' },
    { code: 'es', flag: '🇪🇸', label: 'Español' },
    { code: 'fr', flag: '🇫🇷', label: 'Français' },
    { code: 'de', flag: '🇩🇪', label: 'Deutsch' },
    { code: 'it', flag: '🇮🇹', label: 'Italiano' },
];

export function Header() {
    const pathname = usePathname();
    const router = useRouter();
    const [query, setQuery] = useState('');
    const [langOpen, setLangOpen] = useState(false);
    const [activeLang, setActiveLang] = useState(LANGUAGES[0]);
    const langRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (langRef.current && !langRef.current.contains(e.target as Node)) {
                setLangOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/busca?q=${encodeURIComponent(query.trim())}`);
        }
    };

    const isActive = (href: string) => {
        if (href === '/') return pathname === '/';
        return pathname.startsWith(href);
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">

            {/* ── Linha superior: Logo + Busca + Idioma ── */}
            <div className="flex items-center justify-center gap-3 px-4 py-2.5">

                {/* Logo */}
                <Link href="/" className="shrink-0">
                    <XvideosPrimeLogo className="h-9 md:h-11 w-auto" />
                </Link>

                {/* Barra de busca com ícone à esquerda */}
                <form onSubmit={handleSearch} className="relative w-72 md:w-96 shrink-0">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <input
                        type="search"
                        placeholder="Buscar vídeos..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full bg-muted text-foreground placeholder-muted-foreground pl-10 pr-4 py-2.5 rounded-full outline-none text-sm focus:ring-2 focus:ring-[#b40200] transition"
                    />
                </form>

                {/* Seletor de idioma */}
                <div ref={langRef} className="relative shrink-0">
                    <button
                        onClick={() => setLangOpen((o) => !o)}
                        className="flex items-center gap-1.5 text-foreground hover:text-muted-foreground transition-colors py-1"
                        aria-label="Selecionar idioma"
                    >
                        <Globe className="h-5 w-5" />
                        <span className="hidden sm:inline text-xs font-semibold uppercase">
                            {activeLang.code}
                        </span>
                        <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${langOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {langOpen && (
                        <div className="absolute right-0 top-full mt-2 w-44 bg-popover border border-border rounded-md shadow-2xl z-50 overflow-hidden">
                            {LANGUAGES.map((lang) => (
                                <button
                                    key={lang.code}
                                    onClick={() => { setActiveLang(lang); setLangOpen(false); }}
                                    className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-left transition-colors ${
                                        activeLang.code === lang.code
                                            ? 'bg-[#b40200] text-white'
                                            : 'text-popover-foreground hover:bg-muted'
                                    }`}
                                >
                                    <span className="text-base">{lang.flag}</span>
                                    <span>{lang.label}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* ── Nav inferior ── */}
            <div>
                <nav className="container mx-auto flex items-center overflow-x-auto scrollbar-hide px-4">
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`shrink-0 flex items-center gap-1 px-3 md:px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider whitespace-nowrap transition-colors border-b-2 ${
                                isActive(link.href)
                                    ? 'text-[#b40200] border-[#b40200]'
                                    : 'text-muted-foreground border-transparent hover:text-foreground hover:border-border'
                            }`}
                        >
                            {link.icon === 'star' && <Star className="h-3 w-3" />}
                            {link.icon === 'heart' && <Heart className="h-3 w-3" />}
                            {link.label}
                        </Link>
                    ))}
                </nav>
            </div>
        </header>
    );
}
