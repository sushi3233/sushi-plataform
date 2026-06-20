# Handoff — Club da Putaria

Documento de transferência do projeto. Descreve o que existe, como o sistema se organiza e quais peças precisam existir para a aplicação funcionar. Não cobre infraestrutura, provedores ou procedimentos operacionais.

---

## 1. Visão geral

Aplicação fullstack de catálogo de vídeos adultos, orientada a SEO e performance. Cada vídeo publicado possui URL canônica própria, metadados dedicados e thumbnail indexável.

O produto divide-se em três superfícies:

| Superfície | Papel |
|------------|-------|
| Site público | Descoberta, consumo e indexação |
| Painel admin | Curadoria, importação e publicação |
| API interna | Mídia, métricas e operações administrativas |

---

## 2. Stack

| Camada | Tecnologia |
|--------|------------|
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| UI | Tailwind CSS 4, shadcn/ui, Lucide |
| Banco | PostgreSQL 16, Prisma 6 |
| Player | HLS.js |
| Imagens | Sharp |
| Storage | AWS SDK (compatível S3) |
| Scraping | Cheerio |
| Runtime | Node.js 22, pnpm |
| Container | Docker multi-stage (build standalone) |

---

## 3. Arquitetura lógica

```
Browser
   │
   ▼
Next.js (SSR / SSG / ISR + API Routes)
   │
   ├── PostgreSQL ── vídeos, taxonomia, views, admin
   │
   ├── Object storage ── thumbnails processadas
   │
   └── Fontes externas ── streams HLS e páginas de origem (via embed/scraping)
```

**Vídeo:** o playback usa URLs HLS armazenadas no banco. Quando há restrição de CORS, a aplicação expõe um proxy interno.

**Thumbnail:** prioridade para arquivo no object storage; fallback via rota interna que faz proxy da fonte original, sem expor o domínio externo na UI.

**Views:** contagem persistida no banco, com agregação diária para rankings (trending).

**Renderização:** páginas públicas usam SSG com revalidação (ISR). Busca é renderizada sob demanda.

---

## 4. Modelo de dados

Entidades principais (`prisma/schema.prisma`):

| Entidade | Função |
|----------|--------|
| `Video` | Conteúdo central: slug, SEO, duração, views, status |
| `VideoEmbed` | URLs de reprodução e referência à fonte externa |
| `VideoThumbnail` | URL pública e chave no storage |
| `Model` | Pessoa/ator associada a vídeos |
| `Category` | Taxonomia ampla |
| `Tag` | Taxonomia granular |
| `DailyView` | Views por dia (rankings) |
| `Admin` | Registro de administrador (seed) |

**Status de vídeo:** `DRAFT`, `PUBLISHED`, `DMCA_REMOVED`.

Relações many-to-many entre vídeo e modelo/categoria/tag.

---

## 5. Rotas públicas

| Rota | Descrição |
|------|-----------|
| `/` | Home (mais vistos) |
| `/page/[n]` | Paginação da home |
| `/[videoSlug]` | Página do vídeo |
| `/modelo/[slug]` | Vídeos por modelo |
| `/videos/[categoria]` | Vídeos por categoria |
| `/xxx/[tag]` | Vídeos por tag |
| `/busca` | Busca |
| `/recentes` | Publicações recentes |
| `/mais-vistos` | Ranking all-time |
| `/bombando` | Ranking 24h |
| `/embed/[videoSlug]` | Player embeddable (SEO) |
| `/[videoSlug]/thumb/[n]` | Página de thumbnail |

Rotas paginadas seguem o padrão `.../page/[n]`.

**SEO:** sitemaps XML, `robots.ts`, JSON-LD (`VideoObject`, `WebSite`, `ItemList`), Open Graph e canonical por página.

---

## 6. Painel administrativo

| Rota | Descrição |
|------|-----------|
| `/admin/login` | Autenticação |
| `/admin` | Dashboard |
| `/admin/videos` | Listagem |
| `/admin/videos/import` | Import unitário (scraping) |
| `/admin/videos/bulk-import` | Import em lote |
| `/admin/videos/novo-hls` | Cadastro manual HLS |
| `/admin/videos/[id]/edit` | Edição |
| `/admin/modelos` | CRUD modelos |
| `/admin/categorias` | CRUD categorias |
| `/admin/tags` | CRUD tags |

**Autenticação:** credenciais definidas por variáveis de ambiente. Sessão em cookie assinado com `ADMIN_SECRET`. Comparação timing-safe via `crypto.timingSafeEqual`.

**Server Actions:** `app/admin/_actions/video.ts` concentra operações de vídeo (criar, publicar, excluir, etc.).

---

## 7. API interna

| Rota | Função |
|------|--------|
| `GET /api/thumb/[slug]/[n]` | Proxy/resolução de thumbnail |
| `GET /api/hls-proxy` | Proxy de playlists e segmentos HLS |
| `POST /api/views` | Incremento de views |
| `POST /api/videos/track-view` | Tracking alternativo |
| `POST /api/admin/login` | Login |
| `POST /api/admin/logout` | Logout |
| `GET/POST /api/admin/videos` | CRUD vídeos |
| `POST /api/admin/scrape` | Scraping unitário |
| `POST /api/admin/scrape/discover` | Descoberta de URLs |
| `POST /api/admin/scrape/bulk` | Scraping em lote |
| `POST /api/admin/upload-thumbnail` | Upload de thumbnail |

Rotas `/api/admin/*` exigem sessão válida.

---

## 8. Estrutura de código

```
app/
  (public)/          Site público
  admin/             Painel + actions
  api/               Route handlers
  sitemap-*/         Sitemaps
  layout.tsx         Layout raiz + metadata global
  globals.css        Tema escuro (design tokens)

components/
  video/             Player, cards, grid
  layout/            Header, footer, paginação, busca
  admin/             Shell do painel
  seo/               JSON-LD
  ui/                shadcn

lib/
  services/videos.ts       Queries Prisma
  services/r2.ts             Cliente object storage
  scraper/                 Parsers de páginas externas
  thumbnail-processor.ts   Download + Sharp + upload
  admin-auth.ts            Sessão admin
  utils.ts                 Formatação, slug, resolução de thumbnail
  db.ts                    Singleton Prisma

prisma/
  schema.prisma
  seed.ts                  Admin inicial + dados de exemplo

scripts/                   Utilitários pontuais (diagnóstico, inserts, testes)
```

---

## 9. Fluxos principais

### Publicação de vídeo (via admin)

1. URL externa é submetida ao scraper.
2. Scraper extrai título, duração, taxonomia, UUID/URLs de mídia.
3. Vídeo é criado como `DRAFT`.
4. Thumbnail é baixada, redimensionada (Sharp) e enviada ao storage.
5. Admin revisa metadados e publica → status `PUBLISHED`.

### Consumo no site público

1. Página lista ou detalhe busca vídeos `PUBLISHED` via Prisma.
2. Player carrega HLS (direto ou via proxy).
3. Thumbnail resolvida por `getThumbnailUrl()` (storage → proxy interno → poster original).
4. View registrada via API.

### SEO

- Uma URL canônica por vídeo (`slug` na raiz).
- Thumbnails servidas pelo domínio da aplicação ou storage próprio.
- Sitemaps paginados para vídeos, tags, categorias, modelos e páginas estáticas.

---

## 10. Variáveis de ambiente

Referência em `.env.example`. Propósito de cada grupo:

| Variável | Propósito |
|----------|-----------|
| `DATABASE_URL` | Conexão PostgreSQL |
| `R2_*` / `CLOUDFLARE_R2_*` | Credenciais e bucket do object storage |
| `NEXT_PUBLIC_R2_PUBLIC_URL` | URL pública das thumbnails |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME` | Credenciais do painel |
| `ADMIN_SECRET` | Assinatura da sessão admin |
| `NEXT_PUBLIC_SITE_URL` | URL base da aplicação |
| `NEXT_PUBLIC_TELEGRAM_BOT_URL` | Link opcional de monetização |
| `NEXT_PUBLIC_GA_ID` | Google Analytics (opcional) |

O código aceita prefixos `R2_*` ou `CLOUDFLARE_R2_*` para compatibilidade.

---

## 11. Scripts npm

| Comando | Função |
|---------|--------|
| `pnpm dev` | Desenvolvimento |
| `pnpm build` | Build de produção |
| `pnpm start` | Servidor standalone |
| `pnpm lint` | ESLint |
| `pnpm db:push` | Sincroniza schema |
| `pnpm db:seed` | Seed inicial |
| `pnpm db:studio` | Prisma Studio |

---

## 12. Dependências externas (conceitual)

Para operação completa, a aplicação espera:

1. **PostgreSQL** acessível pela aplicação.
2. **Object storage** compatível com S3 para thumbnails.
3. **Fontes de vídeo externas** com streams HLS disponíveis (referenciadas no banco após importação).
4. **Páginas de origem** compatíveis com os scrapers em `lib/scraper/`.

Nenhuma dessas dependências está acoplada a um provedor específico no código de negócio — apenas URLs e credenciais configuráveis.

---

## 13. Estado atual do produto

**Implementado**
- Site público completo com paginação e SEO
- Painel admin com import manual, bulk e cadastro HLS
- Processamento e upload de thumbnails
- Proxy HLS e proxy de thumbnails
- Tracking de views e ranking diário
- Sitemaps e structured data
- Container Docker para build standalone

**Não implementado / parcial**
- Rate limiting nas APIs
- CSRF explícito no admin
- Testes automatizados
- CI/CD no repositório

---

## 14. Pontos de atenção para quem assume

1. **Scrapers** dependem da estrutura HTML das páginas de origem — mudanças externas quebram importação.
2. **Proxies de mídia** existem por CORS e estratégia de SEO; não são opcionais no fluxo atual.
3. **URLs de produção** aparecem hardcoded em sitemaps e metadados — alinhar com `NEXT_PUBLIC_SITE_URL` ao colocar em ambiente novo.
4. **Admin** usa credenciais em env, não fluxo de recuperação de senha.
5. **Conteúdo adulto** — implicações legais e de ToS dos serviços utilizados ficam a cargo do operador.

---

## 15. Documentação no repositório

| Arquivo | Conteúdo |
|---------|----------|
| `README.MD` | Resumo público do projeto |
| `HANDOFF.md` | Este documento |
| `.env.example` | Lista de variáveis (sem valores) |

Não há documentação operacional, de deploy ou de arquitetura detalhada no repositório.
