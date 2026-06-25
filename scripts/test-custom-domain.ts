

import 'dotenv/config';

const CUSTOM_DOMAIN = 'https://thumbs.xvideosprime.com';

const THUMBNAIL_KEYS = [
    'thumbnails/1771342644909-k691v5ot.png',
    'thumbnails/1771342658986-dz2x1nix.png',
];

async function testCustomDomain() {
    console.log(' Testando acesso ao R2 via Custom Domain...\n');
    console.log(` Custom Domain: ${CUSTOM_DOMAIN}\n`);

    for (const key of THUMBNAIL_KEYS) {
        const url = `${CUSTOM_DOMAIN}/${key}`;
        console.log(`\n Testando: ${url}`);
        console.log('─'.repeat(80));

        try {
            const response = await fetch(url, { method: 'HEAD' });

            console.log(`   Status: ${response.status} ${response.statusText}`);
            console.log(`   Content-Type: ${response.headers.get('content-type')}`);
            console.log(`   Content-Length: ${response.headers.get('content-length')} bytes`);

            if (response.status === 200) {
                console.log('    SUCESSO! Imagem está acessível via custom domain.');
            } else if (response.status === 403) {
                console.log('    ERRO 403: Acesso negado.');
                console.log('    Verifique se o custom domain está configurado corretamente.');
            } else if (response.status === 404) {
                console.log('    ERRO 404: Arquivo não encontrado.');
                console.log('    Verifique se o upload foi concluído com sucesso.');
            } else if (response.status === 401) {
                console.log('    ERRO 401: Não autorizado.');
                console.log('    Custom domain pode não estar configurado corretamente.');
            } else if (response.status === 522 || response.status === 523) {
                console.log('    ERRO Cloudflare: Timeout ou origem inacessível.');
                console.log('    O custom domain pode não estar conectado ao bucket.');
            } else {
                console.log(`     Status inesperado: ${response.status}`);
            }
        } catch (error: any) {
            console.log(`    ERRO na requisição: ${error.message}`);
        }
    }

    console.log('\n' + '='.repeat(80));
    console.log(' PRÓXIMOS PASSOS');
    console.log('='.repeat(80));
    console.log('\nSe as imagens carregaram com sucesso (200 OK):');
    console.log('1. Reinicie o servidor de desenvolvimento: npm run dev');
    console.log('2. Acesse: https://xvideosprime.com/backoffice-92/videos/novo-hls');
    console.log('3. Faça upload de uma nova thumbnail');
    console.log('4. O preview deve funcionar agora! \n');
    console.log('\nSe ainda houver erros:');
    console.log('1. Verifique se o DNS do custom domain está propagado');
    console.log('2. Execute: nslookup thumbs.xvideosprime.com');
    console.log('3. Aguarde alguns minutos para propagação DNS\n');
}

testCustomDomain().catch(console.error);
