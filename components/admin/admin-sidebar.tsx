'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Video,
    Users,
    FolderOpen,
    Tags,
    LogOut,
    Layers,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Vídeos', href: '/admin/videos', icon: Video },
    { name: 'Importação em Massa', href: '/admin/videos/bulk-import', icon: Layers },
    { name: 'Modelos', href: '/admin/modelos', icon: Users },
    { name: 'Categorias', href: '/admin/categorias', icon: FolderOpen },
    { name: 'Tags', href: '/admin/tags', icon: Tags },
];

export function AdminSidebar() {
    const pathname = usePathname();

    return (
        <div className="flex h-full w-64 flex-col bg-sidebar text-sidebar-foreground">

            <div className="flex h-16 items-center justify-center border-b border-sidebar-border">
                <h1 className="text-xl font-bold">Club da Putaria</h1>
            </div>

            <nav className="flex-1 space-y-1 px-2 py-4">
                {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                'group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors',
                                isActive
                                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                                    : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                            )}
                        >
                            <item.icon
                                className={cn(
                                    'mr-3 h-5 w-5 flex-shrink-0',
                                    isActive ? 'text-sidebar-primary' : 'text-sidebar-foreground/60 group-hover:text-sidebar-primary'
                                )}
                            />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="border-t border-sidebar-border p-4">
                <form action="/api/admin/logout" method="POST">
                    <button
                        type="submit"
                        className="group flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    >
                        <LogOut className="mr-3 h-5 w-5 flex-shrink-0 text-sidebar-foreground/60 group-hover:text-destructive" />
                        Sair
                    </button>
                </form>
            </div>
        </div>
    );
}
