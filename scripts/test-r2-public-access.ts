

import 'dotenv/config';

const R2_PUBLIC_URL = process.env.NEXT_PUBLIC_R2_PUBLIC_URL;

const TEST_URLS = [
    'https://pub-1168b46e2743464391393a8d30f91711.r2.dev/thumbnails/1771342644909-k691v5ot.png',
    'https://pub-1168b46e2743464391393a8d30f91711.r2.dev/thumbnails/1771342658986-dz2x1nix.png',
];

async function testPublicAccess() {
    console.log(' Testando acesso público ao R2...\n');
    console.log(` NEXT_PUBLIC_R2_PUBLIC_URL: ${R2_PUBLIC_URL}\n`);

    for (const url of TEST_URLS) {
        console.log(`\n Testando: ${url}`);
        console.log('─'.repeat(80));

        try {
            const response = await fetch(url, { method: 'HEAD' });

            console.log(`   Status: ${response.status} ${response.statusText}`);
            console.log(`   Content-Type: ${response.headers.get('content-type')}`);
            console.log(`   Content-Length: ${response.headers.get('content-length')} bytes`);

            if (response.status === 200) {
                console.log('    SUCESSO! Imagem está acessível publicamente.');
            } else if (response.status === 403) {
                console.log('    ERRO 403: Bucket não está público.');
                console.log('    Solução: Habilite "Public Access" no Cloudflare R2 Dashboard.');
            } else if (response.status === 404) {
                console.log('    ERRO 404: Arquivo não encontrado.');
                console.log('    Verifique se o upload foi concluído com sucesso.');
            } else if (response.status === 401) {
                console.log('    ERRO 401: Não autorizado.');
                console.log('    Bucket requer autenticação. Habilite acesso público.');
            } else {
                console.log(`     Status inesperado: ${response.status}`);
            }
        } catch (error: any) {
            console.log(`    ERRO na requisição: ${error.message}`);
        }
    }

    console.log('\n' + '='.repeat(80));
    console.log(' RESUMO');
    console.log('='.repeat(80));
    console.log('\nSe você viu "403 Forbidden" ou "401 Unauthorized":');
    console.log('1. Acesse: https://dash.cloudflare.com → R2 → my-app-uploads');
    console.log('2. Vá em Settings → Public Access');
    console.log('3. Clique em "Allow Access" ou "Enable R2.dev subdomain"');
    console.log('4. Execute este script novamente para confirmar\n');
}

testPublicAccess().catch(console.error);
