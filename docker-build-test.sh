#!/bin/bash

# 🐳 Script para testar o build do Docker localmente
# Execute: ./docker-build-test.sh

set -e

echo "🔍 Verificando arquivos necessários..."
if [ ! -f "Dockerfile" ]; then
    echo "❌ Dockerfile não encontrado!"
    exit 1
fi

if [ ! -f ".dockerignore" ]; then
    echo "⚠️  .dockerignore não encontrado (recomendado)"
fi

echo "✅ Arquivos encontrados!"
echo ""

echo "🧹 Limpando builds anteriores..."
docker system prune -f

echo ""
echo "🏗️  Iniciando build da imagem Docker..."
docker build -t clubdaputaria:test .

echo ""
echo "✅ Build concluído com sucesso!"
echo ""

echo "🚀 Deseja executar o container? (y/n)"
read -r response

if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    echo "🔧 Carregando variáveis de ambiente do .env.local..."
    
    echo "🚀 Iniciando container..."
    docker run -p 3000:3000 \
        --env-file .env.local \
        --name clubdaputaria-test \
        clubdaputaria:test
    
    echo ""
    echo "✅ Container rodando em http://localhost:3000"
    echo "Para parar: docker stop clubdaputaria-test"
    echo "Para remover: docker rm clubdaputaria-test"
else
    echo "ℹ️  Para executar manualmente:"
    echo "docker run -p 3000:3000 --env-file .env.local --name clubdaputaria-test clubdaputaria:test"
fi
