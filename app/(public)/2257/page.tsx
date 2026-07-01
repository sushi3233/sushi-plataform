import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: '18 U.S.C. 2257 - Xvideos Prime',
    description: 'Declaração de conformidade com o 18 U.S.C. § 2257 do Xvideos Prime.',
    alternates: { canonical: '/2257' },
};

export default function Page2257() {
    return (
        <div className="max-w-3xl mx-auto py-4 space-y-8">
            <div className="space-y-3">
                <h1 className="text-3xl font-bold">18 U.S.C. § 2257</h1>
                <p className="text-sm text-muted-foreground">Declaração de Conformidade de Manutenção de Registros</p>
                <div className="h-1 w-16 bg-[#b40200] rounded-full" />
            </div>

            <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">

                <p>
                    O Xvideos Prime (<strong className="text-foreground">xvideosprime.com</strong>) não é um produtor
                    primário — conforme definido em 18 U.S.C. § 2257 e 28 C.F.R. 75 — de nenhum dos conteúdos visuais
                    exibidos neste Site.
                </p>

                <p>
                    Todo o conteúdo exibido neste Site foi produzido por terceiros e é incorporado ou indexado de outras
                    plataformas da internet. O Xvideos Prime atua exclusivamente como um agregador de conteúdo de
                    terceiros, não participando da produção, direção ou criação de qualquer material visual exibido.
                </p>

                <p>
                    Os produtores primários de todo o conteúdo exibido neste Site mantêm os registros exigidos por lei
                    e estão em total conformidade com as disposições do 18 U.S.C. § 2257 e regulamentações relacionadas.
                    As declarações de conformidade e os registros de verificação de idade dos participantes estão
                    disponíveis diretamente junto aos produtores originais de cada conteúdo.
                </p>

                <p>
                    Todos os indivíduos retratados em conteúdo visual exibido neste Site tinham 18 anos de idade ou
                    mais no momento da produção do conteúdo. Não toleramos nem publicamos qualquer conteúdo envolvendo
                    menores de idade. Qualquer conteúdo suspeito pode e deve ser reportado imediatamente através da
                    nossa página de <a href="/contato" className="text-[#b40200] hover:underline">Contato/DMCA</a>.
                </p>

                <div className="rounded-lg border border-border bg-muted/20 p-4 space-y-2">
                    <p className="font-semibold text-foreground">Produtor Secundário / Operador do Site</p>
                    <p>Xvideos Prime</p>
                    <p>
                        Contato:{' '}
                        <a href="/contato" className="text-[#b40200] hover:underline">
                            xvideosprime.com/contato
                        </a>
                    </p>
                </div>

                <p>
                    Para mais informações sobre o 18 U.S.C. § 2257, consulte a legislação federal norte-americana
                    ou entre em contato com um advogado especializado em direito do entretenimento adulto.
                </p>

            </div>
        </div>
    );
}
