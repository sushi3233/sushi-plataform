import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Termos de Uso - Xvideos Prime',
    description: 'Leia os Termos de Uso do Xvideos Prime antes de utilizar nossa plataforma.',
    alternates: { canonical: '/termos' },
};

const SECTIONS = [
    {
        title: '1. Aceitação dos Termos',
        content: `Ao acessar e utilizar o Xvideos Prime ("Site"), você declara ter lido, compreendido e concordado com os presentes Termos de Uso. Caso não concorde com qualquer parte destes termos, solicitamos que deixe o Site imediatamente.

O uso contínuo do Site após qualquer alteração nos Termos de Uso constitui aceitação das modificações realizadas. Reservamo-nos o direito de atualizar estes termos a qualquer momento sem aviso prévio.`,
    },
    {
        title: '2. Restrição de Idade',
        content: `O Xvideos Prime é destinado exclusivamente a adultos com 18 anos ou mais. Ao acessar este Site, você confirma e declara que:

• Tem 18 anos de idade ou mais;
• É legalmente capaz de visualizar conteúdo adulto em sua jurisdição;
• Não está acessando o Site de um local onde o conteúdo adulto seja proibido por lei.

É estritamente proibido o acesso ao Site por menores de 18 anos. Se você tiver conhecimento de que um menor está acessando este Site, entre em contato conosco imediatamente.`,
    },
    {
        title: '3. Uso Permitido',
        content: `O conteúdo disponível no Xvideos Prime é fornecido exclusivamente para uso pessoal e não comercial. É expressamente proibido:

• Reproduzir, distribuir, transmitir ou publicar qualquer conteúdo do Site sem autorização;
• Utilizar robôs, scrapers ou qualquer meio automatizado para acessar o Site;
• Tentar contornar medidas de segurança ou proteção do Site;
• Utilizar o Site para qualquer finalidade ilegal ou não autorizada;
• Fazer upload ou transmitir vírus, malware ou qualquer código malicioso.`,
    },
    {
        title: '4. Propriedade Intelectual',
        content: `Todo o conteúdo disponível no Xvideos Prime, incluindo mas não se limitando a textos, gráficos, logotipos, ícones, imagens e clipes de vídeo, é de propriedade do Site ou de seus respectivos detentores de direitos e está protegido pelas leis de direitos autorais aplicáveis.

Caso acredite que seus direitos de propriedade intelectual foram violados, entre em contato conosco através da nossa página de Contato/DMCA para que possamos analisar e resolver a situação.`,
    },
    {
        title: '5. Isenção de Responsabilidade',
        content: `O Xvideos Prime não produz, hospeda nem distribui diretamente nenhum dos conteúdos exibidos. Os vídeos são incorporados de plataformas de terceiros e indexados da internet. Não somos responsáveis pela veracidade, legalidade ou adequação do conteúdo de terceiros.

O Site é fornecido "no estado em que se encontra", sem garantias de qualquer tipo, expressas ou implícitas. Não garantimos que o Site estará disponível ininterruptamente ou livre de erros.`,
    },
    {
        title: '6. Privacidade',
        content: `O tratamento dos seus dados pessoais é regido pela nossa Política de Privacidade, disponível em /privacidade. Ao utilizar o Site, você concorda com a coleta e uso de informações conforme descrito nessa política.`,
    },
    {
        title: '7. Links de Terceiros',
        content: `O Site pode conter links para sites de terceiros. Esses links são fornecidos apenas para sua conveniência. Não temos controle sobre o conteúdo desses sites e não assumimos responsabilidade por eles ou por qualquer perda ou dano que possa ocorrer pelo seu uso.`,
    },
    {
        title: '8. Modificações e Rescisão',
        content: `Reservamo-nos o direito de modificar, suspender ou encerrar o Site a qualquer momento, com ou sem aviso prévio. Também podemos revogar seu acesso ao Site caso você viole estes Termos de Uso.`,
    },
    {
        title: '9. Lei Aplicável',
        content: `Estes Termos de Uso são regidos pelas leis aplicáveis à jurisdição em que o Site opera. Qualquer disputa decorrente do uso do Site será resolvida nos tribunais competentes dessa jurisdição.`,
    },
    {
        title: '10. Contato',
        content: `Dúvidas sobre estes Termos de Uso podem ser enviadas através da nossa página de Contato disponível em /contato.`,
    },
];

export default function TermosPage() {
    return (
        <div className="max-w-3xl mx-auto py-4 space-y-8">
            <div className="space-y-3">
                <h1 className="text-3xl font-bold">Termos de Uso</h1>
                <p className="text-sm text-muted-foreground">
                    Última atualização: {new Date().toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
                <div className="h-1 w-16 bg-[#b40200] rounded-full" />
            </div>

            <div className="space-y-6">
                {SECTIONS.map(({ title, content }) => (
                    <div key={title} className="space-y-2">
                        <h2 className="text-base font-semibold">{title}</h2>
                        <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                            {content}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
