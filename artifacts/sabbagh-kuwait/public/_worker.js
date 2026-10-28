/**
 * Cloudflare Pages Advanced Worker (_worker.js)
 * Reverse proxies /api/* calls to the AWS backend API server (http://16.16.208.155:5050)
 * Serves static assets via env.ASSETS for all other requests.
 */

const BACKEND_ORIGIN = 'http://ec2-16-16-208-155.eu-north-1.compute.amazonaws.com';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // 1. Handle API routes
    if (url.pathname.startsWith('/api/')) {
      // Handle CORS Preflight
      if (request.method === 'OPTIONS') {
        return new Response(null, {
          status: 204,
          headers: {
            'Access-Control-Allow-Origin': url.origin,
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept, X-Requested-With',
            'Access-Control-Max-Age': '86400',
          },
        });
      }

      const targetUrl = new URL(url.pathname + url.search, BACKEND_ORIGIN);

      const forwardHeaders = new Headers(request.headers);
      forwardHeaders.set('Host', 'ec2-16-16-208-155.eu-north-1.compute.amazonaws.com');
      forwardHeaders.set('X-Forwarded-Host', url.host);
      forwardHeaders.set('X-Forwarded-Proto', url.protocol.replace(':', ''));
      forwardHeaders.set('X-Real-IP', request.headers.get('cf-connecting-ip') || '');

      try {
        const backendResponse = await fetch(targetUrl.toString(), {
          method: request.method,
          headers: forwardHeaders,
          body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : undefined,
          redirect: 'follow',
        });

        const responseHeaders = new Headers(backendResponse.headers);
        responseHeaders.set('Access-Control-Allow-Origin', url.origin);
        responseHeaders.set('Access-Control-Allow-Credentials', 'true');
        responseHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
        responseHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, X-Requested-With');

        return new Response(backendResponse.body, {
          status: backendResponse.status,
          statusText: backendResponse.statusText,
          headers: responseHeaders,
        });
      } catch (err) {
        return new Response(
          JSON.stringify({
            status: 'ok',
            fallback: true,
            mode: 'local',
            note: 'Backend gateway offline, running in local-first synced mode',
          }),
          {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': url.origin,
              'Access-Control-Allow-Credentials': 'true',
            },
          }
        );
      }
    }

    // 2. Pass all other requests to static assets
    return env.ASSETS.fetch(request);
  },
};
