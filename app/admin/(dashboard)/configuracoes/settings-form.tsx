'use client';

import { useState } from 'react';

export function SettingsForm({ devtoolsEnabled }: { devtoolsEnabled: boolean }) {
    const [enabled, setEnabled] = useState(devtoolsEnabled);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const toggle = async () => {
        setLoading(true);
        setMessage('');
        try {
            const res = await fetch('/api/admin/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key: 'devtools_protection', value: String(!enabled) }),
                credentials: 'include',
            });

            if (!res.ok) throw new Error('Erro ao salvar');

            setEnabled(!enabled);
            setMessage('Configuração salva com sucesso!');
        } catch {
            setMessage('Erro ao salvar configuração.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-between py-4 border-t">
            <div>
                <p className="font-medium text-foreground">Proteção contra DevTools</p>
                <p className="text-sm text-muted-foreground mt-1">
                    Quando ativado, o site fecha automaticamente ao detectar a abertura do DevTools do navegador.
                </p>
                {message && (
                    <p className={`text-sm mt-2 ${message.includes('Erro') ? 'text-destructive' : 'text-green-500'}`}>
                        {message}
                    </p>
                )}
            </div>

            <button
                onClick={toggle}
                disabled={loading}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:opacity-50 ${
                    enabled ? 'bg-primary' : 'bg-muted'
                }`}
                role="switch"
                aria-checked={enabled}
            >
                <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        enabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                />
            </button>
        </div>
    );
}
