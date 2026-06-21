import { prisma } from '@/lib/db';
import { SettingsForm } from './settings-form';

export const metadata = { title: 'Configurações' };

export default async function ConfiguracoesPage() {
    const setting = await prisma.setting.findUnique({
        where: { key: 'devtools_protection' },
    }).catch(() => null);

    const devtoolsEnabled = setting?.value === 'true';

    return (
        <div className="p-6 max-w-2xl">
            <h1 className="text-2xl font-bold mb-2">Configurações</h1>
            <p className="text-muted-foreground mb-8">Gerencie as configurações gerais da plataforma.</p>

            <div className="rounded-lg border bg-card p-6 space-y-6">
                <div>
                    <h2 className="text-lg font-semibold mb-1">Segurança</h2>
                    <p className="text-sm text-muted-foreground">Proteções aplicadas ao site público.</p>
                </div>

                <SettingsForm devtoolsEnabled={devtoolsEnabled} />
            </div>
        </div>
    );
}
