'use client';

import { useState } from 'react';
import type { Metadata } from 'next';

const ASSUNTOS = [
    'Consulta',
    'Reclamação',
    'Sugestão',
    'Alteração',
    'Publicidade',
    'Erro no site',
    'Parceria',
    'Abuse',
];

export default function ContatoPage() {
    const [form, setForm] = useState({ nome: '', email: '', assunto: '', mensagem: '' });
    const [enviado, setEnviado] = useState(false);

    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErro('');
        try {
            const res = await fetch('/api/contato', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            if (!res.ok) throw new Error('Erro ao enviar');
            setEnviado(true);
        } catch {
            setErro('Não foi possível enviar a mensagem. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto py-4 space-y-8">

            <h1 className="text-2xl font-bold border-b border-border pb-3">
                Contato - Xvideos Prime
            </h1>

            {/* DMCA */}
            <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                <h2 className="text-base font-bold text-foreground">DMCA</h2>

                <p>
                    No <strong>xvideosprime.com</strong>, nosso objetivo é oferecer uma ampla variedade de conteúdos
                    de diversas fontes disponíveis na internet. Os vídeos publicados em nossa plataforma são coletados
                    de sites e materiais indexados pelo Google.
                </p>

                <p>
                    O envio de conteúdos é feito por usuários anônimos e por isso solicitamos documentos para a remoção.
                </p>

                <p>
                    Valorizamos a conformidade legal e seguimos rigorosamente todas as diretrizes relacionadas à remoção
                    de conteúdo não autorizado. Caso você encontre material seu em nosso site sem a devida permissão,
                    pedimos desculpas e solicitamos que nos contate por e-mail.
                </p>

                <p>
                    Nos comprometemos a analisar e remover o conteúdo em até <strong>72 horas</strong>, seguindo os
                    seguintes princípios legais:
                </p>

                <ul className="space-y-2 list-none">
                    <li>
                        <strong className="text-foreground">Propriedade Intelectual:</strong> Respeitamos rigorosamente
                        os direitos de propriedade intelectual. Se o seu conteúdo estiver sendo utilizado sem a devida
                        autorização, procederemos com a remoção conforme as leis de direitos autorais.
                    </li>
                    <li>
                        <strong className="text-foreground">Privacidade e Proteção de Dados:</strong> Garantimos que
                        todos os dados pessoais divulgados em nosso site estejam em conformidade com as leis de
                        privacidade e proteção de dados. Se houver qualquer preocupação com a privacidade, removeremos
                        as informações conforme as regulamentações aplicáveis.
                    </li>
                    <li>
                        <strong className="text-foreground">Regulamentação de Conteúdo Adulto:</strong> Cumprimos todas
                        as leis e regulamentações locais sobre a exibição e distribuição de conteúdo adulto, assegurando
                        que nosso material atenda a todas as restrições etárias.
                    </li>
                </ul>

                <p>
                    Para garantir a veracidade do pedido de remoção e evitar que alguém tente prejudicar o site de
                    forma maliciosa, solicitamos que sejam enviados os seguintes documentos e informações para confirmar
                    a posse do vídeo:
                </p>

                <ul className="space-y-1 list-disc list-inside">
                    <li>Foto da identidade (RG) ou CNH.</li>
                    <li>Nome completo.</li>
                    <li>Telefone.</li>
                    <li>CPF.</li>
                    <li>Data de nascimento.</li>
                    <li>Uma selfie segurando o <strong className="text-foreground">documento de identificação</strong>.</li>
                    <li>Um breve texto <strong className="text-foreground">explicando o motivo da remoção</strong>.</li>
                </ul>

                <div className="space-y-2 pt-1">
                    <p className="font-semibold text-foreground uppercase text-xs tracking-wide">
                        Faça upload dos documentos acima para algum site de imagens como:
                    </p>
                    <p>
                        <a href="https://imgbb.com" target="_blank" rel="noopener noreferrer" className="text-[#b40200] hover:underline font-semibold">IMGBB</a>
                        {' / '}
                        <a href="https://imgur.com" target="_blank" rel="noopener noreferrer" className="text-[#b40200] hover:underline font-semibold">IMGUR</a>
                        {' / '}
                        <a href="https://drive.google.com" target="_blank" rel="noopener noreferrer" className="text-[#b40200] hover:underline font-semibold">GOOGLE DRIVE</a>
                    </p>
                    <p className="font-semibold text-foreground uppercase text-xs tracking-wide">
                        Basta compartilhar o link das imagens no formulário abaixo também.
                    </p>
                    <p className="font-semibold text-[#b40200] uppercase text-xs tracking-wide">
                        É indispensável o envio da documentação solicitada acima para a remoção dos conteúdos.
                    </p>
                </div>

                <p>
                    Embora tomemos todas as medidas para garantir a legalidade dos conteúdos, ocasionalmente podemos
                    adquirir material de terceiros que alegam ser a modelo, o que pode ser difícil de verificar. No
                    entanto, estamos comprometidos em agir rapidamente para resolver qualquer questão de uso indevido
                    de conteúdo. Se acredita que seu material está sendo utilizado de forma inadequada, entre em contato
                    conosco para que possamos tomar as medidas necessárias e proteger seus direitos.
                </p>

                <p className="italic">
                    Reservamo-nos o direito de modificar, alterar ou adicionar a esta política, e todos os usuários
                    devem verificar regularmente estes termos e condições para se manterem atualizados com tais alterações.
                </p>
            </div>

            {/* Formulário */}
            <div className="space-y-4">
                <p className="text-sm text-muted-foreground italic">
                    Envie um email no formulário abaixo.
                </p>

                {enviado ? (
                    <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-6 text-center space-y-2">
                        <p className="font-semibold text-green-400">Mensagem enviada com sucesso!</p>
                        <p className="text-sm text-muted-foreground">Entraremos em contato em até 72 horas.</p>
                        <button
                            onClick={() => { setEnviado(false); setForm({ nome: '', email: '', assunto: '', mensagem: '' }); }}
                            className="mt-2 text-sm text-[#b40200] hover:underline"
                        >
                            Enviar nova mensagem
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-1">
                                <label className="text-sm font-medium" htmlFor="nome">Nome:</label>
                                <input
                                    id="nome"
                                    type="text"
                                    required
                                    value={form.nome}
                                    onChange={e => setForm(f => ({ ...f, nome: e.target.value }))}
                                    className="w-full rounded border border-border bg-muted px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#b40200] transition"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium" htmlFor="email">E-mail:</label>
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    value={form.email}
                                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                                    className="w-full rounded border border-border bg-muted px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#b40200] transition"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium" htmlFor="assunto">Assunto:</label>
                                <select
                                    id="assunto"
                                    required
                                    value={form.assunto}
                                    onChange={e => setForm(f => ({ ...f, assunto: e.target.value }))}
                                    className="w-full rounded border border-border bg-muted px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#b40200] transition"
                                >
                                    <option value="">Selecione</option>
                                    {ASSUNTOS.map(a => (
                                        <option key={a} value={a}>{a}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium" htmlFor="mensagem">Mensagem:</label>
                            <textarea
                                id="mensagem"
                                required
                                rows={6}
                                value={form.mensagem}
                                onChange={e => setForm(f => ({ ...f, mensagem: e.target.value }))}
                                className="w-full rounded border border-border bg-muted px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#b40200] transition resize-none"
                            />
                        </div>

                        {erro && (
                            <p className="text-sm text-red-400">{erro}</p>
                        )}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#b40200] hover:bg-[#900100] disabled:opacity-60 text-white font-semibold py-2.5 rounded transition-colors"
                        >
                            {loading ? 'Enviando...' : 'Enviar contato'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
