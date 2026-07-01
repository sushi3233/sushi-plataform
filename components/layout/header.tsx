'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    ChevronDown, ChevronUp, Flame, Globe, Heart, LayoutGrid,
    Menu, MonitorPlay, Search, Star, ThumbsUp, Users, X,
} from 'lucide-react';
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

const SIDEBAR_CATEGORIES = [
    { label: 'Lésbicas',  href: '/videos/lesbicas' },
    { label: 'Novinhas',  href: '/videos/novinhas' },
    { label: 'Famosas',   href: '/videos/famosas' },
    { label: 'Gostosas',  href: '/videos/gostosas' },
    { label: 'Anal',      href: '/videos/anal' },
    { label: 'Boquetes',  href: '/videos/boquetes' },
    { label: 'Coroas',    href: '/videos/coroas' },
    { label: 'Peitudas',  href: '/videos/peitudas' },
    { label: 'Bucetas',   href: '/videos/bucetas' },
    { label: 'Pornô Longo', href: '/videos/porno-longo' },
];

export function Header() {
    const pathname = usePathname();
    const router = useRouter();
    const [query, setQuery] = useState('');
    const [langOpen, setLangOpen] = useState(false);
    const [activeLang, setActiveLang] = useState(LANGUAGES[0]);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [catsOpen, setCatsOpen] = useState(false);
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

    useEffect(() => {
        if (sidebarOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [sidebarOpen]);

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

    const closeSidebar = () => setSidebarOpen(false);

    return (
        <>
            <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">

                {/* ── Linha superior: Hambúrguer + Logo + Busca + Idioma ── */}
                <div className="flex items-center justify-center gap-3 px-4 py-2.5">

                    {/* Botão hambúrguer */}
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="shrink-0 mr-3 text-foreground hover:text-muted-foreground transition-colors"
                        aria-label="Menu"
                    >
                        <Menu className="h-6 w-6" />
                    </button>

                    {/* Logo */}
                    <Link href="/" className="shrink-0">
                        <XvideosPrimeLogo className="h-9 md:h-11 w-auto" />
                    </Link>

                    {/* Barra de busca com ícone à esquerda */}
                    <form onSubmit={handleSearch} className="relative w-80 md:w-[28rem] shrink-0">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                        <input
                            type="search"
                            placeholder="Buscar por: negão, ninfeta, gozada... ou Nome da Modelo"
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
                    <nav className="flex items-center justify-center overflow-x-auto scrollbar-hide px-4">
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

            {/* ── Sidebar overlay ── */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-[60] bg-black/60"
                    onClick={closeSidebar}
                />
            )}

            {/* ── Sidebar panel ── */}
            <aside
                className={`fixed top-0 left-0 z-[70] h-full w-72 bg-[#1a1a1a] shadow-2xl transition-transform duration-300 ease-in-out flex flex-col ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                {/* Cabeçalho do sidebar */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                    <Link href="/" onClick={closeSidebar}>
                        <XvideosPrimeLogo className="h-8 w-auto" />
                    </Link>
                    <button
                        onClick={closeSidebar}
                        className="text-white/70 hover:text-white transition-colors"
                        aria-label="Fechar menu"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Itens do sidebar */}
                <nav className="flex-1 overflow-y-auto py-2">
                    <SidebarItem icon={MonitorPlay} label="Vídeos Em Destaque" href="/" onClick={closeSidebar} />
                    <SidebarItem icon={Star}        label="Pornô Novos"         href="/recentes"    onClick={closeSidebar} />
                    <SidebarItem icon={ThumbsUp}    label="Vídeos Recomendados" href="/recentes"    onClick={closeSidebar} />
                    <SidebarItem icon={Flame}       label="Mais Populares"      href="/mais-vistos" onClick={closeSidebar} />
                    <SidebarItem icon={Heart}       label="Bombando Hoje"       href="/bombando"    onClick={closeSidebar} />
                    <SidebarItem icon={Users}       label="Estrelas Pornô"      href="/modelos"     onClick={closeSidebar} />

                    <div className="my-2 border-t border-white/10" />

                    {/* Categorias expansível */}
                    <button
                        onClick={() => setCatsOpen((o) => !o)}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                    >
                        <LayoutGrid className="h-5 w-5 shrink-0 text-white/60" />
                        <span className="flex-1 text-left font-medium">Categorias Principais</span>
                        {catsOpen
                            ? <ChevronUp className="h-4 w-4 text-white/50" />
                            : <ChevronDown className="h-4 w-4 text-white/50" />
                        }
                    </button>

                    {catsOpen && (
                        <div className="bg-black/20">
                            {SIDEBAR_CATEGORIES.map((cat) => (
                                <Link
                                    key={cat.href}
                                    href={cat.href}
                                    onClick={closeSidebar}
                                    className="flex items-center gap-3 pl-12 pr-4 py-2.5 text-sm text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                                >
                                    <LayoutGrid className="h-4 w-4 shrink-0 text-white/40" />
                                    {cat.label}
                                </Link>
                            ))}
                        </div>
                    )}
                </nav>
            </aside>
        </>
    );
}

function SidebarItem({
    icon: Icon,
    label,
    href,
    onClick,
}: {
    icon: React.ElementType;
    label: string;
    href: string;
    onClick: () => void;
}) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className="flex items-center gap-3 px-4 py-3 text-sm text-white/80 hover:bg-white/10 hover:text-white transition-colors"
        >
            <Icon className="h-5 w-5 shrink-0 text-white/60" />
            <span className="font-medium">{label}</span>
        </Link>
    );
}
