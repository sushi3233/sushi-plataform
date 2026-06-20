#!/bin/bash

# ========================================
# Script para inserir os 3 vídeos da Brasiloirinha
# EXECUTAR NA VPS via SSH
# ========================================

echo "🚀 Inserindo 3 vídeos da Brasiloirinha no banco de produção..."
echo ""

# Conectar no banco e executar SQL
psql "postgres://clubdaputaria:Cp@2026!Segura#DB@g4sccck0g44wco4ockg0s840:5432/clubdaputaria" << 'EOF'

-- ========================================
-- INSERIR MODELOS
-- ========================================
INSERT INTO models (id, name, slug, created_at)
VALUES 
    (gen_random_uuid(), 'Brasiloirinha', 'brasiloirinha', NOW()),
    (gen_random_uuid(), 'Igor de Marco', 'igor-de-marco', NOW())
ON CONFLICT (slug) DO NOTHING;

-- INSERIR CATEGORIA
INSERT INTO categories (id, name, slug, created_at)
VALUES (gen_random_uuid(), 'Amador', 'amador', NOW())
ON CONFLICT (slug) DO NOTHING;

-- INSERIR TAGS
INSERT INTO tags (id, name, slug, created_at)
VALUES 
    (gen_random_uuid(), 'Buceta', 'buceta', NOW()),
    (gen_random_uuid(), 'Video longo', 'video-longo', NOW()),
    (gen_random_uuid(), 'Boquete', 'boquete', NOW()),
    (gen_random_uuid(), 'Anal', 'anal', NOW()),
    (gen_random_uuid(), 'Gozada dentro', 'gozada-dentro', NOW()),
    (gen_random_uuid(), 'Loira', 'loira', NOW()),
    (gen_random_uuid(), 'Novinha', 'novinha', NOW())
ON CONFLICT (slug) DO NOTHING;

-- ========================================
-- VÍDEO 1: Brasiloirinha transando forte
-- ========================================
DO $$
DECLARE
    v_video_id UUID;
    v_brasiloirinha_id UUID;
    v_igor_id UUID;
    v_amador_id UUID;
    v_buceta_id UUID;
    v_video_longo_id UUID;
    v_boquete_id UUID;
BEGIN
    -- Criar vídeo
    INSERT INTO videos (id, slug, meta_title, meta_description, h1_title, duration, status, published_at, created_at, updated_at)
    VALUES (
        gen_random_uuid(),
        'brasiloirinha-transando-forte-maromba-igor-marco',
        'Brasiloirinha Transando Forte com Maromba Igor de Marco',
        'Assista Brasiloirinha transando forte com o maromba Igor de Marco em vídeo completo. Sexo intenso, buceta molhada e muito tesão neste vídeo amador.',
        'Brasiloirinha Transando Forte com o Maromba Igor de Marco',
        635, -- 10:35
        'PUBLISHED',
        NOW(),
        NOW(),
        NOW()
    )
    RETURNING id INTO v_video_id;

    -- Criar embed
    INSERT INTO video_embeds (id, video_id, hls_url, iframe_url, source_platform, source_id, created_at)
    VALUES (
        gen_random_uuid(),
        v_video_id,
        'https://vazounudes.net/hls/d1caa325-5b4d-4fa5-8216-2523833a5a47/playlist.m3u8',
        '',
        'vazounudes',
        'd1caa325-5b4d-4fa5-8216-2523833a5a47',
        NOW()
    );

    -- Associar modelos
    SELECT id INTO v_brasiloirinha_id FROM models WHERE slug = 'brasiloirinha';
    SELECT id INTO v_igor_id FROM models WHERE slug = 'igor-de-marco';
    
    INSERT INTO "_VideoModels" ("A", "B") VALUES (v_video_id, v_brasiloirinha_id);
    INSERT INTO "_VideoModels" ("A", "B") VALUES (v_video_id, v_igor_id);

    -- Associar categoria
    SELECT id INTO v_amador_id FROM categories WHERE slug = 'amador';
    INSERT INTO "_VideoCategories" ("A", "B") VALUES (v_video_id, v_amador_id);

    -- Associar tags
    SELECT id INTO v_buceta_id FROM tags WHERE slug = 'buceta';
    SELECT id INTO v_video_longo_id FROM tags WHERE slug = 'video-longo';
    SELECT id INTO v_boquete_id FROM tags WHERE slug = 'boquete';
    
    INSERT INTO "_VideoTags" ("A", "B") VALUES (v_video_id, v_buceta_id);
    INSERT INTO "_VideoTags" ("A", "B") VALUES (v_video_id, v_video_longo_id);
    INSERT INTO "_VideoTags" ("A", "B") VALUES (v_video_id, v_boquete_id);

    RAISE NOTICE '✅ Vídeo 1 criado: /brasiloirinha-transando-forte-maromba-igor-marco/';
END $$;

-- ========================================
-- VÍDEO 2: Brasiloirinha dando o cuzinho
-- ========================================
DO $$
DECLARE
    v_video_id UUID;
    v_brasiloirinha_id UUID;
    v_amador_id UUID;
    v_anal_id UUID;
    v_gozada_id UUID;
    v_loira_id UUID;
BEGIN
    -- Criar vídeo
    INSERT INTO videos (id, slug, meta_title, meta_description, h1_title, duration, status, published_at, created_at, updated_at)
    VALUES (
        gen_random_uuid(),
        'brasiloirinha-dando-cuzinho-apertado-gozada-dentro',
        'Brasiloirinha Dando o Cuzinho Apertado e Levando Gozada',
        'Brasiloirinha loira dando o cuzinho apertado e levando gozada dentro. Vídeo amador completo de sexo anal intenso com a gostosa gemendo muito.',
        'Brasiloirinha Dando o Cuzinho Apertado e Levando Gozada Dentro',
        261, -- 4:21
        'PUBLISHED',
        NOW(),
        NOW(),
        NOW()
    )
    RETURNING id INTO v_video_id;

    -- Criar embed
    INSERT INTO video_embeds (id, video_id, hls_url, iframe_url, source_platform, source_id, created_at)
    VALUES (
        gen_random_uuid(),
        v_video_id,
        'https://vazounudes.net/hls/c8274513-5550-40de-adb8-46abc5584a52/playlist.m3u8',
        '',
        'vazounudes',
        'c8274513-5550-40de-adb8-46abc5584a52',
        NOW()
    );

    -- Associar modelo
    SELECT id INTO v_brasiloirinha_id FROM models WHERE slug = 'brasiloirinha';
    INSERT INTO "_VideoModels" ("A", "B") VALUES (v_video_id, v_brasiloirinha_id);

    -- Associar categoria
    SELECT id INTO v_amador_id FROM categories WHERE slug = 'amador';
    INSERT INTO "_VideoCategories" ("A", "B") VALUES (v_video_id, v_amador_id);

    -- Associar tags
    SELECT id INTO v_anal_id FROM tags WHERE slug = 'anal';
    SELECT id INTO v_gozada_id FROM tags WHERE slug = 'gozada-dentro';
    SELECT id INTO v_loira_id FROM tags WHERE slug = 'loira';
    
    INSERT INTO "_VideoTags" ("A", "B") VALUES (v_video_id, v_anal_id);
    INSERT INTO "_VideoTags" ("A", "B") VALUES (v_video_id, v_gozada_id);
    INSERT INTO "_VideoTags" ("A", "B") VALUES (v_video_id, v_loira_id);

    RAISE NOTICE '✅ Vídeo 2 criado: /brasiloirinha-dando-cuzinho-apertado-gozada-dentro/';
END $$;

-- ========================================
-- VÍDEO 3: Brasiloirinha levando chupada
-- ========================================
DO $$
DECLARE
    v_video_id UUID;
    v_brasiloirinha_id UUID;
    v_amador_id UUID;
    v_buceta_id UUID;
    v_loira_id UUID;
    v_novinha_id UUID;
BEGIN
    -- Criar vídeo
    INSERT INTO videos (id, slug, meta_title, meta_description, h1_title, duration, status, published_at, created_at, updated_at)
    VALUES (
        gen_random_uuid(),
        'brasiloirinha-levando-chupada-buceta-boquete-negao',
        'Brasiloirinha Levando Chupada na Buceta e Fazendo Boquete',
        'Brasiloirinha novinha loira levando chupada na buceta e fazendo boquete no negão. Vídeo amador completo de sexo oral intenso com a gostosa gemendo.',
        'Brasiloirinha Levando Chupada na Buceta e Fazendo Boquete no Negão',
        466, -- 7:46
        'PUBLISHED',
        NOW(),
        NOW(),
        NOW()
    )
    RETURNING id INTO v_video_id;

    -- Criar embed
    INSERT INTO video_embeds (id, video_id, hls_url, iframe_url, source_platform, source_id, created_at)
    VALUES (
        gen_random_uuid(),
        v_video_id,
        'https://vazounudes.net/hls/c97b0ed1-66e2-493b-bcfe-1eeab8e24978/playlist.m3u8',
        '',
        'vazounudes',
        'c97b0ed1-66e2-493b-bcfe-1eeab8e24978',
        NOW()
    );

    -- Associar modelo
    SELECT id INTO v_brasiloirinha_id FROM models WHERE slug = 'brasiloirinha';
    INSERT INTO "_VideoModels" ("A", "B") VALUES (v_video_id, v_brasiloirinha_id);

    -- Associar categoria
    SELECT id INTO v_amador_id FROM categories WHERE slug = 'amador';
    INSERT INTO "_VideoCategories" ("A", "B") VALUES (v_video_id, v_amador_id);

    -- Associar tags
    SELECT id INTO v_buceta_id FROM tags WHERE slug = 'buceta';
    SELECT id INTO v_loira_id FROM tags WHERE slug = 'loira';
    SELECT id INTO v_novinha_id FROM tags WHERE slug = 'novinha';
    
    INSERT INTO "_VideoTags" ("A", "B") VALUES (v_video_id, v_buceta_id);
    INSERT INTO "_VideoTags" ("A", "B") VALUES (v_video_id, v_loira_id);
    INSERT INTO "_VideoTags" ("A", "B") VALUES (v_video_id, v_novinha_id);

    RAISE NOTICE '✅ Vídeo 3 criado: /brasiloirinha-levando-chupada-buceta-boquete-negao/';
END $$;

-- ========================================
-- RESUMO
-- ========================================
SELECT 
    '✅ 3 VÍDEOS INSERIDOS COM SUCESSO!' as status,
    COUNT(*) as total_videos
FROM videos;

SELECT 
    '📊 Estatísticas:' as info,
    (SELECT COUNT(*) FROM videos) as videos,
    (SELECT COUNT(*) FROM models) as modelos,
    (SELECT COUNT(*) FROM categories) as categorias,
    (SELECT COUNT(*) FROM tags) as tags;

EOF

echo ""
echo "========================================="
echo "✅ SCRIPT CONCLUÍDO!"
echo "========================================="
echo ""
echo "📊 URLs dos vídeos:"
echo "1. https://clubdaputaria.com/brasiloirinha-transando-forte-maromba-igor-marco/"
echo "2. https://clubdaputaria.com/brasiloirinha-dando-cuzinho-apertado-gozada-dentro/"
echo "3. https://clubdaputaria.com/brasiloirinha-levando-chupada-buceta-boquete-negao/"
echo ""
echo "⚠️  PRÓXIMOS PASSOS:"
echo "1. Adicionar thumbnails via admin"
echo "2. Verificar vídeos no site"
echo "3. Testar players HLS"
echo ""
