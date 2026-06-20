import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const url = searchParams.get('url');

        if (!url) {
            return NextResponse.json(
                { error: 'URL parameter is required' },
                { status: 400 }
            );
        }

        if (!url.startsWith('https://vazounudes.net/')) {
            return NextResponse.json(
                { error: 'Only vazounudes.net URLs are allowed' },
                { status: 403 }
            );
        }

        console.log('[HLS Proxy] Fetching:', url);

        const requestHeaders: HeadersInit = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': '*/*',
            'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
            'Referer': 'https://xxx.vazounudes.net/',
            'Origin': 'https://xxx.vazounudes.net',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-site',
        };

        console.log('[HLS Proxy] Request headers:', requestHeaders);

        const rangeHeader = request.headers.get('range');
        if (rangeHeader) {
            requestHeaders['Range'] = rangeHeader;
        }

        const response = await fetch(url, {
            headers: requestHeaders,
        });

        if (!response.ok) {
            console.error('[HLS Proxy] Error:', response.status, response.statusText);
            console.error('[HLS Proxy] Response headers:', Object.fromEntries(response.headers.entries()));

            const errorBody = await response.text().catch(() => 'Unable to read error body');
            console.error('[HLS Proxy] Error body:', errorBody);

            return NextResponse.json(
                { error: `Failed to fetch: ${response.statusText}`, details: errorBody },
                { status: response.status }
            );
        }

        let contentType = response.headers.get('content-type');
        if (!contentType) {
            if (url.endsWith('.m3u8')) {
                contentType = 'application/vnd.apple.mpegurl';
            } else if (url.endsWith('.ts')) {
                contentType = 'video/mp2t';
            } else {
                contentType = 'application/octet-stream';
            }
        }

        if (url.endsWith('.ts')) {
            const buffer = await response.arrayBuffer();
            console.log('[HLS Proxy] Returning .ts segment, size:', buffer.byteLength);
            return new NextResponse(buffer, {
                status: 200,
                headers: {
                    'Content-Type': contentType,
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Range',
                    'Access-Control-Expose-Headers': 'Content-Length, Content-Range',
                    'Cache-Control': 'public, max-age=31536000, immutable',
                    'Accept-Ranges': 'bytes',
                },
            });
        }

        let body = await response.text();

        if (url.endsWith('.m3u8')) {
            const baseUrl = url.substring(0, url.lastIndexOf('/') + 1);
            console.log('[HLS Proxy] Processing .m3u8, base URL:', baseUrl);

            body = body.split('\n').map(line => {

                if (line.startsWith('#') || !line.trim()) {
                    return line;
                }

                if (!line.startsWith('http')) {
                    const absoluteUrl = baseUrl + line;
                    return `/api/hls-proxy?url=${encodeURIComponent(absoluteUrl)}`;
                }

                return `/api/hls-proxy?url=${encodeURIComponent(line)}`;
            }).join('\n');
        }

        return new NextResponse(body, {
            status: 200,
            headers: {
                'Content-Type': contentType,
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Cache-Control': 'public, max-age=3600',
            },
        });
    } catch (error: any) {
        console.error('[HLS Proxy] Error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function OPTIONS() {
    return new NextResponse(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
    });
}
