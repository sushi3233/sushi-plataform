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
          <p className="text-xs">
            <strong>Aviso Legal:</strong> Este site contém conteúdo adulto e é
            destinado apenas para maiores de 18 anos. Todos os modelos têm 18
            anos ou mais. O acesso é proibido em locais onde o conteúdo adulto é
            ilegal. Ao acessar este site, você confirma ter 18 anos ou mais e
            concorda com nossos Termos de Uso.
          </p>
        </div>
      </div>
    </footer>
  );
}
