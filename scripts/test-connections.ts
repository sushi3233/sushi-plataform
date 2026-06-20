#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client';
import { S3Client, ListBucketsCommand } from '@aws-sdk/client-s3';

console.log(' Testando configurações...\n');

console.log('1⃣ Verificando variáveis de ambiente...');
const requiredEnvVars = [
    'DATABASE_URL',
    'CLOUDFLARE_R2_ENDPOINT',
    'CLOUDFLARE_R2_ACCESS_KEY_ID',
    'CLOUDFLARE_R2_SECRET_ACCESS_KEY',
    'R2_BUCKET_NAME',
    'NEXT_PUBLIC_R2_PUBLIC_URL',
    'ADMIN_EMAIL',
    'ADMIN_PASSWORD',
    'ADMIN_SECRET',
    'NEXT_PUBLIC_SITE_URL',
];

const missingVars: string[] = [];
requiredEnvVars.forEach((varName) => {
    if (!process.env[varName]) {
        missingVars.push(varName);
        console.log(`    ${varName} - FALTANDO`);
    } else {

        const isSecret = varName.includes('SECRET') || varName.includes('PASSWORD') || varName.includes('KEY');
        const displayValue = isSecret ? '***' : process.env[varName];
        console.log(`    ${varName} = ${displayValue}`);
    }
});

if (missingVars.length > 0) {
    console.log(`\n  ${missingVars.length} variável(is) faltando!\n`);
} else {
    console.log(`\n Todas as variáveis obrigatórias estão configuradas!\n`);
}

console.log('2⃣ Testando conexão com PostgreSQL...');
try {
    const prisma = new PrismaClient();
    await prisma.$connect();
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('    Conexão com PostgreSQL OK');
    await prisma.$disconnect();
} catch (error: any) {
    console.log(`    Erro ao conectar no PostgreSQL: ${error.message}`);
    console.log(`    Verifique se o DATABASE_URL está correto e o PostgreSQL está rodando`);
}

console.log('\n3⃣ Testando conexão com Cloudflare R2...');
try {
    const r2Client = new S3Client({
        region: 'auto',
        endpoint: process.env.CLOUDFLARE_R2_ENDPOINT || process.env.R2_ENDPOINT,
        credentials: {
            accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || process.env.R2_ACCESS_KEY_ID || '',
            secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || process.env.R2_SECRET_ACCESS_KEY || '',
        },
    });

    const command = new ListBucketsCommand({});
    const response = await r2Client.send(command);

    const bucketExists = response.Buckets?.some(
        (bucket) => bucket.Name === process.env.R2_BUCKET_NAME
    );

    if (bucketExists) {
        console.log(`    Conexão com R2 OK`);
        console.log(`    Bucket "${process.env.R2_BUCKET_NAME}" encontrado`);
    } else {
        console.log(`     Conexão OK, mas bucket "${process.env.R2_BUCKET_NAME}" não encontrado`);
        console.log(`    Buckets disponíveis: ${response.Buckets?.map(b => b.Name).join(', ') || 'nenhum'}`);
    }
} catch (error: any) {
    console.log(`    Erro ao conectar no R2: ${error.message}`);
    console.log(`    Verifique as credenciais do R2`);
}

console.log('\n4⃣ Validando URLs...');
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
if (siteUrl) {
    try {
        const url = new URL(siteUrl);
        if (url.protocol === 'https:') {
            console.log(`    NEXT_PUBLIC_SITE_URL válido: ${siteUrl}`);
        } else {
            console.log(`     NEXT_PUBLIC_SITE_URL deve usar HTTPS: ${siteUrl}`);
        }
    } catch {
        console.log(`    NEXT_PUBLIC_SITE_URL inválido: ${siteUrl}`);
    }
} else {
    console.log(`    NEXT_PUBLIC_SITE_URL não configurado`);
}

const r2PublicUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL;
if (r2PublicUrl) {
    try {
        const url = new URL(r2PublicUrl);
        console.log(`    NEXT_PUBLIC_R2_PUBLIC_URL válido: ${r2PublicUrl}`);
    } catch {
        console.log(`    NEXT_PUBLIC_R2_PUBLIC_URL inválido: ${r2PublicUrl}`);
    }
} else {
    console.log(`    NEXT_PUBLIC_R2_PUBLIC_URL não configurado`);
}

console.log('\n Teste concluído!\n');
