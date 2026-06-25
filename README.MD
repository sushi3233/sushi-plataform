# Xvideos Prime

Plataforma web de vídeos com catálogo público, descoberta de conteúdo e painel administrativo.

## Stack

| Camada | Tecnologia |
|--------|------------|
| Aplicação | Next.js 16, React 19, TypeScript |
| Interface | Tailwind CSS 4, shadcn/ui |
| Dados | PostgreSQL, Prisma |
| Mídia | HLS.js, object storage (S3-compatible) |

## O que existe hoje

**Site público**
- Home, paginação e páginas por vídeo
- Listagens por modelo, categoria e tag
- Busca, recentes, mais vistos e trending
- Sitemaps e metadados estruturados

**Admin**
- Login e dashboard
- Gestão de vídeos, modelos, categorias e tags
- Importação de conteúdo via scraping
- Upload e processamento de thumbnails

**Backend / API**
- Tracking de visualizações
- Proxy de mídia e thumbnails
- Endpoints administrativos

## Estrutura

```
app/          Páginas, layouts e rotas de API
components/   Componentes reutilizáveis
lib/          Serviços, scrapers e utilitários
prisma/       Schema e seed
public/       Arquivos estáticos
scripts/      Scripts auxiliares
```
