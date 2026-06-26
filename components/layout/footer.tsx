import Link from 'next/link';
import { Separator } from '@/components/ui/separator';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-8">

        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <h3 className="font-semibold mb-3">Categorias</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/videos/amador" className="hover:text-primary">
                  Amador
                </Link>
              </li>
              <li>
                <Link href="/videos/brasileiro" className="hover:text-primary">
                  Brasileiro
                </Link>
              </li>
              <li>
                <Link href="/videos/novinha" className="hover:text-primary">
                  Novinha
                </Link>
              </li>
              <li>
                <Link href="/videos/caseiro" className="hover:text-primary">
                  Caseiro
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Navegação</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-primary">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/recentes" className="hover:text-primary">
                  Recentes
                </Link>
              </li>
              <li>
                <Link href="/mais-vistos" className="hover:text-primary">
                  Mais Vistos
                </Link>
              </li>
              <li>
                <Link href="/bombando" className="hover:text-primary">
                  Bombando
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Informações</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/sobre" className="hover:text-primary">
                  Sobre
                </Link>
              </li>
              <li>
                <Link href="/contato" className="hover:text-primary">
                  Contato
                </Link>
              </li>
              <li>
                <Link href="/dmca" className="hover:text-primary">
                  DMCA
                </Link>
              </li>
              <li>
                <Link href="/termos" className="hover:text-primary">
                  Termos de Uso
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/privacidade" className="hover:text-primary">
                  Privacidade
                </Link>
              </li>
              <li>
                <Link href="/2257" className="hover:text-primary">
                  18 U.S.C. 2257
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="space-y-4 text-center text-sm text-muted-foreground">
          <p>
            © {currentYear} Xvideos Prime. Todos os direitos reservados.
          </p>
          {/* Badges de conformidade */}
          <div className="flex items-center justify-center gap-4 flex-wrap">
            {/* RTA */}
            <a href="https://www.rtalabel.org" target="_blank" rel="noopener noreferrer" title="RTA Label">
              <svg width="68" height="40" viewBox="0 0 34 20" xmlns="http://www.w3.org/2000/svg" aria-label="RTA">
                <path fill="#FFFFFF" d="M29.3,3.8H0v12.4h3.8v-5c1.4-0.2,1.8,0.7,1.8,0.7l2.3,4.3h4.4c0,0-0.8-1.6-1.5-2.8c-0.4-0.9-1-1.7-1.7-2.3 c-0.2-0.2-0.5-0.3-0.8-0.4c3.5-0.8,3-3.8,3-3.8h3.9v9.4h3.7V6.8h5.3l-3.6,9.4h3.9l0.6-2.1h4.4l0.6,2.1h4L29.3,3.8z M5.7,8.9H3.8V6.3h1.8c0,0,1.7-0.1,1.7,1.3S5.7,8.9,5.7,8.9z M25.8,11.5L27.2,7l1.4,4.4H25.8z"/>
              </svg>
            </a>
            {/* ASACP */}
            <a href="https://www.asacp.org" target="_blank" rel="noopener noreferrer" title="ASACP">
              <svg width="68" height="40" viewBox="0 0 34 20" xmlns="http://www.w3.org/2000/svg" aria-label="ASACP">
                <path fill="#FFFFFF" d="M32.2,6.5h-9.1c-1.8,0-2.6,2.2-2.6,3.4c0,0.8,0.2,1.5,0.5,2.2h-0.8L18,6.5H9c-1.1,0-1.8,1-1.8,2.2 s2.1,1.7,2.6,1.8c0.5,0.1,1.4,0.2,1.4,1s-0.9,0.7-0.9,0.7H7.1L5,6.5H2.7l-2.7,7h2.2l0.4-1.2H5l0.4,1.2h5.7c0.9-0.2,1.6-0.8,1.9-1.6 c0.1-0.5,0.1-1.1-0.1-1.6c-0.3-1-2.5-1.3-2.8-1.4C9.8,8.7,9.2,8.7,9.2,8.2c0-0.5,0.6-0.5,0.6-0.5h5.6l-2.3,5.8h2.2l0.4-1.2h2.4 l0.4,1.2h6.4c1.8,0,2.3-2.2,2.3-2.2l-1.7-0.6c0,0-0.4,1.3-1.6,1.3s-1.3-0.8-1.3-2.3S23.8,8,23.8,8h4.4v5.5h2.1v-2.7H32 c1.1,0,2-1,2-2.1c0,0,0,0,0-0.1C34,6.7,32.2,6.5,32.2,6.5z M3,10.8l0.8-2.6l0.8,2.6H3z M16,10.8l0.8-2.6l0.8,2.6H16z M31.2,9.5h-1V7.9h1.1C31.7,8,32,8.3,32,8.7C32,9.1,31.7,9.5,31.2,9.5z"/>
              </svg>
            </a>
            {/* Badge 18+ */}
            <div className="flex items-center gap-2 border border-white/20 rounded-full px-4 py-1.5 text-xs text-white/70">
              <span className="font-bold text-white text-sm">18+</span>
              <span>Conteúdo proibido para menores de 18 anos.</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
