'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';

export function RequestVideoForm({ videoSlug }: { videoSlug: string }) {
    const [modelName, setModelName] = useState('');
    const [details, setDetails] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [erro, setErro] = useState('');
    const [open, setOpen] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErro('');
        try {
            const res = await fetch('/api/solicitar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ modelName, details, videoSlug }),
            });
            if (!res.ok) throw new Error();
            setSent(true);
        } catch {
            setErro('Não foi possível enviar. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-3">
            <button
                onClick={() => setOpen(o => !o)}
                className="w-full flex items-center justify-between gap-3 text-left group"
            >
                <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#b40200]/15 shrink-0">
                        <Search className="h-4 w-4 text-[#b40200]" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold">Não encontrou o vídeo de uma modelo específica?</p>
                        <p className="text-xs text-muted-foreground">Solicite aqui e tentaremos encontrar para você</p>
                    </div>
                </div>
                <span className="text-xs text-[#b40200] font-semibold shrink-0 group-hover:underline">
                    {open ? 'Fechar' : 'Solicitar'}
                </span>
            </button>

            {open && (
                sent ? (
                    <div className="rounded-lg bg-green-500/10 border border-green-500/20 px-4 py-3 text-sm text-green-400 text-center">
                        Solicitação enviada! Vamos tentar encontrar o conteúdo para você.
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-3 pt-1 border-t border-border">
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                Nome da modelo *
                            </label>
                            <input
                                type="text"
                                required
                                value={modelName}
                                onChange={e => setModelName(e.target.value)}
                                placeholder="Ex: Pamela Alves, Lara Silva..."
                                className="w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#b40200] transition"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                Detalhes adicionais (opcional)
                            </label>
                            <textarea
                                value={details}
                                onChange={e => setDetails(e.target.value)}
                                placeholder="Descreva o vídeo, link de referência, etc."
                                rows={2}
                                className="w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#b40200] transition resize-none"
                            />
                        </div>
                        {erro && <p className="text-xs text-red-400">{erro}</p>}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#b40200] hover:bg-[#900100] disabled:opacity-60 text-white text-sm font-semibold py-2 rounded-lg transition-colors"
                        >
                            {loading ? 'Enviando...' : 'Enviar solicitação'}
                        </button>
                    </form>
                )
            )}
        </div>
    );
}
