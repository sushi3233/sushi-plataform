'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, CheckCheck, Trash2 } from 'lucide-react';

export function MessageActions({ id, status, email }: { id: string; status: string; email: string }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const update = async (action: 'read' | 'replied' | 'delete') => {
        setLoading(true);
        await fetch(`/api/backoffice-92/mensagens/${id}`, {
            method: action === 'delete' ? 'DELETE' : 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: action !== 'delete' ? JSON.stringify({ status: action === 'read' ? 'READ' : 'REPLIED' }) : undefined,
        });
        router.refresh();
        setLoading(false);
    };

    return (
        <div className="flex items-center gap-1 shrink-0">
            <a
                href={`mailto:${email}`}
                title="Responder por e-mail"
                className="p-1.5 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            >
                <Mail className="h-4 w-4" />
            </a>
            {status === 'UNREAD' && (
                <button
                    onClick={() => update('read')}
                    disabled={loading}
                    title="Marcar como lida"
                    className="p-1.5 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                >
                    <CheckCheck className="h-4 w-4" />
                </button>
            )}
            {status !== 'REPLIED' && (
                <button
                    onClick={() => update('replied')}
                    disabled={loading}
                    title="Marcar como respondida"
                    className="p-1.5 rounded hover:bg-green-500/20 transition-colors text-muted-foreground hover:text-green-400"
                >
                    <CheckCheck className="h-4 w-4" />
                </button>
            )}
            <button
                onClick={() => { if (confirm('Excluir esta mensagem?')) update('delete'); }}
                disabled={loading}
                title="Excluir"
                className="p-1.5 rounded hover:bg-red-500/20 transition-colors text-muted-foreground hover:text-red-400"
            >
                <Trash2 className="h-4 w-4" />
            </button>
        </div>
    );
}
