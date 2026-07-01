import type { Metadata } from 'next';
import { Shield, Film, Users, Globe, Lock, Mail } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Sobre o Xvideos Prime - Plataforma de Vídeos Adultos',
    description: 'Conheça o Xvideos Prime, a plataforma de vídeos adultos em HD com os melhores conteúdos brasileiros e internacionais totalmente gratuitos.',
    alternates: {
        canonical: '/sobre',
    },
};

const SECTIONS = [
    {
        icon: Film,
        title: 'Nossa Plataforma',
        text: 'O Xvideos Prime é uma plataforma de vídeos adultos gratuita dedicada a oferecer o melhor conteúdo em alta definição. Reunimos milhares de vídeos de modelos brasileiras e internacionais em uma experiência rápida, limpa e fácil de usar.',
    },
    {
        icon: Users,
        title: 'Conteúdo e Modelos',
        text: 'Todo o conteúdo disponível no Xvideos Prime é produzido por modelos adultas que consentem e têm 18 anos ou mais. Trabalhamos com categorias variadas para atender a todos os gostos, sempre com qualidade e respeito às modelos.',
    },
    {
        icon: Globe,
        title: 'Acesso Gratuito',
        text: 'Acredimtos que o entretenimento adulto de qualidade deve ser acessível a todos. Por isso, todo o catálogo do Xvideos Prime é 100% gratuito, sem necessidade de cadastro ou assinatura para assistir.',
    },
    {
        icon: Shield,
        title: 'Segurança e Privacidade',
        text: 'Levamos a privacidade dos nossos usuários a sério. Não coletamos dados pessoais desnecessários e utilizamos conexão segura (HTTPS) em todo o site. Sua navegação é discreta e protegida.',
    },
    {
        icon: Lock,
        title: 'Proteção de Menores',
        text: 'O Xvideos Prime é estritamente destinado a adultos com 18 anos ou mais. Implementamos o selo RTA (Restricted to Adults) para que softwares de controle parental possam bloquear o acesso ao site. Se você é menor de idade, por favor saia imediatamente.',
    },
    {
        icon: Mail,
        title: 'Contato e DMCA',
        text: 'Respeitamos os direitos autorais e a privacidade. Se você é titular de direitos sobre algum conteúdo publicado ou deseja reportar material indevido, entre em contato pelo nosso formulário de DMCA. Processamos todas as solicitações com agilidade.',
    },
];

export default function SobrePage() {
    return (
        <div className="max-w-3xl mx-auto space-y-10 py-4">

            {/* Hero */}
            <div className="space-y-3">
                <h1 className="text-3xl md:text-4xl font-bold">Sobre o Xvideos Prime</h1>
                <p className="text-muted-foreground text-lg leading-relaxed">
                    A sua plataforma de vídeos adultos gratuita com os melhores conteúdos em HD.
                </p>
                <div className="h-1 w-16 bg-[#b40200] rounded-full" />
            </div>

            {/* Sections */}
            <div className="grid gap-6">
                {SECTIONS.map(({ icon: Icon, title, text }) => (
                    <div key={title} className="flex gap-4 p-5 rounded-xl border border-border bg-muted/20">
                        <div className="shrink-0 mt-0.5">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#b40200]/10">
                                <Icon className="h-5 w-5 text-[#b40200]" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <h2 className="font-semibold text-base">{title}</h2>
                            <p className="text-sm text-muted-foreground leading-relaxed">{text}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Aviso legal */}
            <div className="rounded-xl border border-[#b40200]/30 bg-[#b40200]/5 p-5 text-sm text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Aviso Legal:</strong> Este site contém conteúdo adulto explícito destinado exclusivamente a maiores de 18 anos.
                Todos os modelos presentes no site têm 18 anos ou mais no momento da gravação.
                O acesso é proibido onde conteúdo adulto for ilegal. Ao acessar o Xvideos Prime, você confirma ser maior de idade e concordar com nossos{' '}
                <a href="/termos" className="text-[#b40200] hover:underline">Termos de Uso</a> e{' '}
                <a href="/privacidade" className="text-[#b40200] hover:underline">Política de Privacidade</a>.
            </div>
        </div>
    );
}
