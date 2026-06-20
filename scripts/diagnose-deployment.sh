#!/bin/bash

# ========================================
# Script de Diagnóstico - Club da Putaria
# ========================================
# Valida infraestrutura e identifica problemas

echo "🔍 Iniciando diagnóstico completo..."
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# ========================================
# 1. VERIFICAR VARIÁVEIS DE AMBIENTE
# ========================================
echo "📋 1. Verificando variáveis de ambiente..."

required_vars=(
    "DATABASE_URL"
    "CLOUDFLARE_R2_ENDPOINT"
    "CLOUDFLARE_R2_ACCESS_KEY_ID"
    "CLOUDFLARE_R2_SECRET_ACCESS_KEY"
    "R2_BUCKET_NAME"
    "NEXT_PUBLIC_R2_PUBLIC_URL"
    "ADMIN_EMAIL"
    "ADMIN_PASSWORD"
    "ADMIN_SECRET"
    "ADMIN_NAME"
    "NEXT_PUBLIC_SITE_URL"
    "NODE_ENV"
)

missing_vars=0
for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        echo -e "${RED}❌ $var não configurada${NC}"
        missing_vars=$((missing_vars + 1))
    else
        echo -e "${GREEN}✅ $var${NC}"
    fi
done

if [ $missing_vars -gt 0 ]; then
    echo -e "${RED}⚠️  $missing_vars variáveis faltando!${NC}"
else
    echo -e "${GREEN}✅ Todas as variáveis configuradas${NC}"
fi
echo ""

# ========================================
# 2. VERIFICAR CONEXÃO COM BANCO
# ========================================
echo "🗄️  2. Testando conexão com PostgreSQL..."

if [ -n "$DATABASE_URL" ]; then
    # Extrair componentes da URL
    if command -v psql &> /dev/null; then
        if psql "$DATABASE_URL" -c "SELECT 1;" &> /dev/null; then
            echo -e "${GREEN}✅ Conexão com banco OK${NC}"
            
            # Contar registros
            video_count=$(psql "$DATABASE_URL" -t -c "SELECT COUNT(*) FROM videos;" 2>/dev/null | tr -d ' ')
            model_count=$(psql "$DATABASE_URL" -t -c "SELECT COUNT(*) FROM models;" 2>/dev/null | tr -d ' ')
            category_count=$(psql "$DATABASE_URL" -t -c "SELECT COUNT(*) FROM categories;" 2>/dev/null | tr -d ' ')
            
            echo "   📊 Vídeos: $video_count"
            echo "   👤 Modelos: $model_count"
            echo "   📁 Categorias: $category_count"
        else
            echo -e "${RED}❌ Falha ao conectar no banco${NC}"
        fi
    else
        echo -e "${YELLOW}⚠️  psql não instalado, pulando teste de conexão${NC}"
    fi
else
    echo -e "${RED}❌ DATABASE_URL não configurada${NC}"
fi
echo ""

# ========================================
# 3. VERIFICAR BUILD
# ========================================
echo "🏗️  3. Verificando build..."

if [ -d ".next" ]; then
    echo -e "${GREEN}✅ Diretório .next existe${NC}"
    
    if [ -f ".next/BUILD_ID" ]; then
        build_id=$(cat .next/BUILD_ID)
        echo "   🆔 Build ID: $build_id"
    else
        echo -e "${YELLOW}⚠️  BUILD_ID não encontrado${NC}"
    fi
    
    # Verificar standalone
    if [ -f ".next/standalone/server.js" ]; then
        echo -e "${GREEN}✅ Build standalone OK${NC}"
    else
        echo -e "${RED}❌ Build standalone não encontrado${NC}"
    fi
else
    echo -e "${RED}❌ Diretório .next não existe - build necessário${NC}"
fi
echo ""

# ========================================
# 4. VERIFICAR PRISMA
# ========================================
echo "🔧 4. Verificando Prisma..."

if [ -d "node_modules/@prisma/client" ]; then
    echo -e "${GREEN}✅ Prisma Client instalado${NC}"
else
    echo -e "${RED}❌ Prisma Client não encontrado${NC}"
    echo "   Execute: pnpm prisma generate"
fi

if [ -f "prisma/schema.prisma" ]; then
    echo -e "${GREEN}✅ Schema Prisma existe${NC}"
else
    echo -e "${RED}❌ Schema Prisma não encontrado${NC}"
fi
echo ""

# ========================================
# 5. VERIFICAR DOCKER (se aplicável)
# ========================================
echo "🐳 5. Verificando Docker..."

if command -v docker &> /dev/null; then
    echo -e "${GREEN}✅ Docker instalado${NC}"
    
    # Verificar containers rodando
    running_containers=$(docker ps --filter "name=clubdaputaria" --format "{{.Names}}" 2>/dev/null)
    if [ -n "$running_containers" ]; then
        echo -e "${GREEN}✅ Container rodando: $running_containers${NC}"
        
        # Verificar logs recentes
        echo "   📋 Últimas 5 linhas do log:"
        docker logs --tail 5 $running_containers 2>&1 | sed 's/^/      /'
    else
        echo -e "${YELLOW}⚠️  Nenhum container rodando${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Docker não instalado (OK se não estiver usando)${NC}"
fi
echo ""

# ========================================
# 6. VERIFICAR CLOUDFLARE R2
# ========================================
echo "☁️  6. Verificando Cloudflare R2..."

if [ -n "$NEXT_PUBLIC_R2_PUBLIC_URL" ]; then
    echo "   🔗 Public URL: $NEXT_PUBLIC_R2_PUBLIC_URL"
    
    # Testar se URL está acessível
    if command -v curl &> /dev/null; then
        status_code=$(curl -s -o /dev/null -w "%{http_code}" "$NEXT_PUBLIC_R2_PUBLIC_URL" 2>/dev/null)
        if [ "$status_code" = "200" ] || [ "$status_code" = "403" ]; then
            echo -e "${GREEN}✅ R2 endpoint acessível${NC}"
        else
            echo -e "${YELLOW}⚠️  R2 endpoint retornou: $status_code${NC}"
        fi
    fi
else
    echo -e "${RED}❌ NEXT_PUBLIC_R2_PUBLIC_URL não configurada${NC}"
fi
echo ""

# ========================================
# 7. VERIFICAR GIT
# ========================================
echo "📦 7. Verificando Git..."

if [ -d ".git" ]; then
    echo -e "${GREEN}✅ Repositório Git inicializado${NC}"
    
    current_branch=$(git branch --show-current 2>/dev/null)
    echo "   🌿 Branch atual: $current_branch"
    
    last_commit=$(git log -1 --oneline 2>/dev/null)
    echo "   📝 Último commit: $last_commit"
    
    # Verificar se há mudanças não commitadas
    if ! git diff-index --quiet HEAD -- 2>/dev/null; then
        echo -e "${YELLOW}⚠️  Há mudanças não commitadas${NC}"
    else
        echo -e "${GREEN}✅ Working tree limpo${NC}"
    fi
else
    echo -e "${RED}❌ Não é um repositório Git${NC}"
fi
echo ""

# ========================================
# 8. RESUMO
# ========================================
echo "========================================="
echo "📊 RESUMO DO DIAGNÓSTICO"
echo "========================================="

total_checks=7
passed_checks=0

[ $missing_vars -eq 0 ] && passed_checks=$((passed_checks + 1)) || echo -e "${RED}❌ Variáveis de ambiente${NC}"
[ -d ".next" ] && passed_checks=$((passed_checks + 1)) || echo -e "${RED}❌ Build Next.js${NC}"
[ -d "node_modules/@prisma/client" ] && passed_checks=$((passed_checks + 1)) || echo -e "${RED}❌ Prisma Client${NC}"
[ -d ".git" ] && passed_checks=$((passed_checks + 1)) || echo -e "${RED}❌ Git${NC}"

echo ""
echo "Checks passados: $passed_checks/$total_checks"

if [ $passed_checks -eq $total_checks ]; then
    echo -e "${GREEN}✅ Sistema OK - Pronto para deploy!${NC}"
else
    echo -e "${YELLOW}⚠️  Alguns problemas encontrados - verificar acima${NC}"
fi

echo ""
echo "🔍 Diagnóstico completo!"
