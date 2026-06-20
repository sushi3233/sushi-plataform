'use client';

import { Bell, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export function AdminHeader() {
    return (
        <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6">

            <div className="flex flex-1 items-center">
                <div className="relative w-96">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Buscar..."
                        className="pl-10"
                    />
                </div>
            </div>

            <div className="flex items-center space-x-4">
                <button className="rounded-full p-2 hover:bg-secondary transition-colors">
                    <Bell className="h-5 w-5 text-muted-foreground" />
                </button>
                <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-accent" />
                    <div className="text-sm">
                        <p className="font-medium text-foreground">Admin</p>
                        <p className="text-muted-foreground">Administrador</p>
                    </div>
                </div>
            </div>
        </header>
    );
}
