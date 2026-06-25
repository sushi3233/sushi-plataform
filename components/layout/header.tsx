'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ChevronDown, Globe, Search } from 'lucide-react';
import XvideosPrimeLogo from '@/app/logos/xvideosprime-logo';

const NAV_LINKS = [
    { label: 'Página Principal', href: '/' },
    { label: 'Vídeos', href: '/recentes' },
    { label: 'Categorias', href: '/videos' },
    { label: 'Estrelas Pornô', href: '/modelos' },
    { label: 'Bombando', href: '/bombando' },
    { label: 'Mais Vistos', href: '/mais-vistos' },
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
        <header className="sticky top-0 z-50 w-full bg-[#1b1b1b]">

            {/* ── Linha superior: Logo + Busca + Idioma ── */}
            <div className="flex items-center gap-3 px-4 py-2.5">

                {/* Logo */}
                <Link href="/" className="shrink-0">
                    <XvideosPrimeLogo className="h-9 md:h-11 w-auto" />
                </Link>

                {/* Barra de busca */}
                <form onSubmit={handleSearch} className="flex flex-1 min-w-0 mx-auto max-w-2xl">
                    <input
                        type="search"
                        placeholder="Buscar vídeos..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="flex-1 min-w-0 bg-[#383838] text-white placeholder-gray-400 px-4 py-2.5 rounded-l-full outline-none text-sm focus:bg-[#444]"
                    />
                    <button
                        type="submit"
                        aria-label="Buscar"
                        className="bg-[#b40200] hover:bg-[#cc0000] active:bg-[#900] px-5 rounded-r-full text-white transition-colors shrink-0"
                    >
                        <Search className="h-4 w-4" />
                    </button>
                </form>

                {/* Seletor de idioma */}
                <div ref={langRef} className="relative shrink-0">
                    <button
                        onClick={() => setLangOpen((o) => !o)}
                        className="flex items-center gap-1.5 text-white hover:text-gray-300 transition-colors py-1"
                        aria-label="Selecionar idioma"
                    >
                        <Globe className="h-5 w-5" />
                        <span className="hidden sm:inline text-xs font-semibold uppercase">
                            {activeLang.code}
                        </span>
                        <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${langOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {langOpen && (
                        <div className="absolute right-0 top-full mt-2 w-44 bg-[#2b2b2b] border border-[#444] rounded-md shadow-2xl z-50 overflow-hidden">
                            {LANGUAGES.map((lang) => (
                                <button
                                    key={lang.code}
                                    onClick={() => { setActiveLang(lang); setLangOpen(false); }}
                                    className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-left transition-colors ${
                                        activeLang.code === lang.code
                                            ? 'bg-[#b40200] text-white'
                                            : 'text-gray-300 hover:bg-[#383838] hover:text-white'
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
            <div className="border-t border-[#333]">
                <nav className="flex items-center overflow-x-auto scrollbar-hide px-2">
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`shrink-0 px-3 md:px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider whitespace-nowrap transition-colors border-b-2 ${
                                isActive(link.href)
                                    ? 'text-[#b40200] border-[#b40200]'
                                    : 'text-gray-400 border-transparent hover:text-white hover:border-gray-500'
                            }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>
            </div>
        </header>
    );
}
