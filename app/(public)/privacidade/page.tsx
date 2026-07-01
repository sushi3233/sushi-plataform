import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Política de Privacidade - Xvideos Prime',
    description: 'Saiba como o Xvideos Prime coleta, usa e protege suas informações pessoais.',
    alternates: { canonical: '/privacidade' },
};

const SECTIONS = [
    {
        title: '1. Informações que Coletamos',
        content: `Ao utilizar o Xvideos Prime, podemos coletar os seguintes tipos de informações:

• Dados de uso: páginas visitadas, tempo de permanência, buscas realizadas e vídeos assistidos;
• Dados técnicos: endereço IP, tipo de navegador, sistema operacional e dispositivo utilizado;
• Cookies e tecnologias similares: utilizamos cookies para melhorar a experiência de navegação;
• Formulários: quando você entra em contato conosco, coletamos nome, e-mail e o conteúdo da mensagem.

Não coletamos dados de pagamento, pois o acesso ao Site é totalmente gratuito.`,
    },
    {
        title: '2. Como Usamos suas Informações',
        content: `As informações coletadas são utilizadas para:

• Operar, manter e melhorar o Site;
• Personalizar a experiência de navegação;
• Analisar o tráfego e entender como os usuários utilizam o Site;
• Responder às suas mensagens e solicitações de suporte;
• Detectar, investigar e prevenir atividades fraudulentas ou ilegais;
• Cumprir obrigações legais.`,
    },
    {
        title: '3. Cookies',
        content: `Utilizamos cookies e tecnologias similares para melhorar a funcionalidade do Site. Os cookies podem ser:

• Essenciais: necessários para o funcionamento básico do Site;
• Analíticos: nos ajudam a entender como os visitantes interagem com o Site;
• De preferência: permitem que o Site lembre suas configurações.

Você pode configurar seu navegador para recusar cookies, mas isso pode afetar algumas funcionalidades do Site.`,
    },
    {
        title: '4. Compartilhamento de Informações',
        content: `Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros para fins comerciais. Podemos compartilhar informações apenas nas seguintes situações:

• Com prestadores de serviço que nos auxiliam na operação do Site, sob obrigação de confidencialidade;
• Quando exigido por lei, ordem judicial ou autoridade governamental competente;
• Para proteger os direitos, propriedade ou segurança do Site e de seus usuários.`,
    },
    {
        title: '5. Segurança dos Dados',
        content: `Adotamos medidas técnicas e organizacionais razoáveis para proteger suas informações contra acesso não autorizado, alteração, divulgação ou destruição. Utilizamos conexão segura (HTTPS) em todo o Site.

No entanto, nenhum método de transmissão pela internet é 100% seguro. Não podemos garantir segurança absoluta das informações transmitidas ao Site.`,
    },
    {
        title: '6. Retenção de Dados',
        content: `Retemos as informações coletadas pelo tempo necessário para cumprir as finalidades descritas nesta Política de Privacidade, a menos que um período de retenção maior seja exigido ou permitido por lei.

Mensagens de contato são mantidas pelo prazo necessário para resolução da solicitação e podem ser excluídas a qualquer momento mediante pedido.`,
    },
    {
        title: '7. Seus Direitos',
        content: `Dependendo da sua localização, você pode ter os seguintes direitos em relação aos seus dados pessoais:

• Direito de acesso: solicitar informações sobre os dados que mantemos sobre você;
• Direito de retificação: solicitar a correção de dados imprecisos;
• Direito de exclusão: solicitar a exclusão dos seus dados pessoais;
• Direito de oposição: opor-se ao processamento dos seus dados;
• Direito de portabilidade: receber seus dados em formato estruturado.

Para exercer qualquer um desses direitos, entre em contato conosco em /contato.`,
    },
    {
        title: '8. Menores de Idade',
        content: `O Xvideos Prime é destinado exclusivamente a maiores de 18 anos. Não coletamos intencionalmente informações de menores de idade. Se tomarmos conhecimento de que coletamos dados de um menor, excluiremos essas informações imediatamente.`,
    },
    {
        title: '9. Links Externos',
        content: `O Site pode conter links para sites de terceiros. Esta Política de Privacidade se aplica apenas ao Xvideos Prime. Não somos responsáveis pelas práticas de privacidade de sites externos e recomendamos que você leia as políticas de privacidade de cada site que visitar.`,
    },
    {
        title: '10. Alterações nesta Política',
        content: `Reservamo-nos o direito de atualizar esta Política de Privacidade periodicamente. Alterações significativas serão comunicadas através do Site. O uso contínuo do Site após as alterações constitui aceitação da nova política.`,
    },
    {
        title: '11. Contato',
        content: `Dúvidas, solicitações ou reclamações relacionadas à privacidade podem ser enviadas através da nossa página de Contato em /contato.`,
    },
];

export default function PrivacidadePage() {
    return (
        <div className="max-w-3xl mx-auto py-4 space-y-8">
            <div className="space-y-3">
                <h1 className="text-3xl font-bold">Política de Privacidade</h1>
                <p className="text-sm text-muted-foreground">
                    Última atualização: {new Date().toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
                <div className="h-1 w-16 bg-[#b40200] rounded-full" />
            </div>

            <div className="space-y-6">
                {SECTIONS.map(({ title, content }) => (
                    <div key={title} className="space-y-2">
                        <h2 className="text-base font-semibold">{title}</h2>
                        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                            {content}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
