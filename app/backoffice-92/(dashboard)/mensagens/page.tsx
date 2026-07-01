import { db } from '@/lib/db';
import type { Metadata } from 'next';
import { MessageActions } from './message-actions';

export const metadata: Metadata = { title: 'Mensagens de Contato' };
export const dynamic = 'force-dynamic';

const STATUS_LABEL: Record<string, string> = {
    UNREAD: 'Não lida',
    READ: 'Lida',
    REPLIED: 'Respondida',
};

const STATUS_COLOR: Record<string, string> = {
    UNREAD: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
    READ: 'bg-muted text-muted-foreground border-border',
    REPLIED: 'bg-green-500/15 text-green-400 border-green-500/30',
};

export default async function MensagensPage() {
    let messages: any[] = [];

    try {
        messages = await (db as any).contactMessage.findMany({
            orderBy: { createdAt: 'desc' },
        });
    } catch {
        return (
            <div className="space-y-4">
                <h1 className="text-2xl font-bold">Mensagens de Contato</h1>
                <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-6 text-sm text-yellow-400">
                    <strong>Tabela ainda não existe no banco.</strong> Rode{' '}
                    <code className="bg-black/30 px-1 rounded">pnpm db:push</code> no servidor para criar a tabela{' '}
                    <code className="bg-black/30 px-1 rounded">contact_messages</code>.
                </div>
            </div>
        );
    }

    const unread = messages.filter(m => m.status === 'UNREAD').length;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Mensagens de Contato</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        {messages.length} mensagem(ns) no total
                        {unread > 0 && (
                            <span className="ml-2 inline-flex items-center rounded-full bg-yellow-500/15 border border-yellow-500/30 px-2 py-0.5 text-xs text-yellow-400 font-medium">
                                {unread} não lida(s)
                            </span>
                        )}
                    </p>
                </div>
            </div>

            {messages.length === 0 ? (
                <div className="rounded-lg border border-border bg-muted/20 p-12 text-center text-muted-foreground">
                    Nenhuma mensagem recebida ainda.
                </div>
            ) : (
                <div className="space-y-3">
                    {messages.map((msg: any) => (
                        <div
                            key={msg.id}
                            className={`rounded-lg border bg-card p-5 space-y-3 ${msg.status === 'UNREAD' ? 'border-yellow-500/30' : 'border-border'}`}
                        >
                            <div className="flex flex-wrap items-start justify-between gap-2">
                                <div className="space-y-0.5">
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold">{msg.nome}</span>
                                        <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${STATUS_COLOR[msg.status] ?? ''}`}>
                                            {STATUS_LABEL[msg.status] ?? msg.status}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-sm text-muted-foreground">
                                        <a href={`mailto:${msg.email}`} className="hover:text-foreground transition-colors">
                                            {msg.email}
                                        </a>
                                        <span>·</span>
                                        <span className="font-medium text-foreground">{msg.assunto}</span>
                                        <span>·</span>
                                        <span>{new Date(msg.createdAt).toLocaleString('pt-BR')}</span>
                                    </div>
                                </div>

                                <MessageActions id={msg.id} status={msg.status} email={msg.email} />
                            </div>

                            <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed border-t border-border pt-3">
                                {msg.mensagem}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
