import { db } from '@/lib/db';
import { isAuthenticated } from '@/lib/admin-auth';
import { redirect } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const dynamic = 'force-dynamic';

export default async function SolicitacoesPage() {
    const authed = await isAuthenticated();
    if (!authed) redirect('/backoffice-92/login');

    let requests: {
        id: string;
        modelName: string;
        details: string | null;
        videoSlug: string | null;
        read: boolean;
        createdAt: Date;
    }[] = [];
    let dbError = false;

    try {
        requests = await (db as any).videoRequest.findMany({
            orderBy: { createdAt: 'desc' },
        });
    } catch {
        dbError = true;
    }

    const unreadCount = requests.filter((r) => !r.read).length;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Solicitações de Vídeos</h1>
                <p className="text-muted-foreground text-sm mt-1">
                    Pedidos de usuários para encontrar vídeos de modelos específicas
                    {unreadCount > 0 && (
                        <span className="ml-2 inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">
                            {unreadCount} novas
                        </span>
                    )}
                </p>
            </div>

            {dbError && (
                <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
                    <strong>Tabela não encontrada.</strong> Execute{' '}
                    <code className="bg-yellow-100 px-1 rounded font-mono">npx prisma@6 db push</code>{' '}
                    no servidor para criar a tabela <code className="bg-yellow-100 px-1 rounded font-mono">video_requests</code>.
                </div>
            )}

            {!dbError && requests.length === 0 && (
                <div className="rounded-lg border border-border bg-muted/30 p-10 text-center text-muted-foreground text-sm">
                    Nenhuma solicitação recebida ainda.
                </div>
            )}

            {!dbError && requests.length > 0 && (
                <div className="rounded-xl border border-border overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
                            <tr>
                                <th className="px-4 py-3 text-left">Modelo</th>
                                <th className="px-4 py-3 text-left">Detalhes</th>
                                <th className="px-4 py-3 text-left">Vídeo (slug)</th>
                                <th className="px-4 py-3 text-left">Recebido</th>
                                <th className="px-4 py-3 text-left">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {requests.map((r) => (
                                <tr key={r.id} className={r.read ? 'bg-background' : 'bg-yellow-50/30'}>
                                    <td className="px-4 py-3 font-semibold">{r.modelName}</td>
                                    <td className="px-4 py-3 text-muted-foreground max-w-xs">
                                        {r.details ? (
                                            <span className="line-clamp-2">{r.details}</span>
                                        ) : (
                                            <span className="italic text-xs">—</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                                        {r.videoSlug ?? '—'}
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                                        {formatDistanceToNow(new Date(r.createdAt), { addSuffix: true, locale: ptBR })}
                                    </td>
                                    <td className="px-4 py-3">
                                        {r.read ? (
                                            <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                                                Lida
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-semibold text-yellow-700">
                                                Nova
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
