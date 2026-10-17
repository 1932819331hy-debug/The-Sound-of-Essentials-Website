/**
 * Cloudflare Pages Functions API Middleware:
 * Provides universal CORS support and OPTIONS preflight handling for all /api/* routes.
 * Ensures seamless API calls from thesoundofessentials.com, Vercel, and local dev.
 */

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, Neon-Connection-String',
  'Access-Control-Max-Age': '86400',
};

// Handle all preflight requests immediately
export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}

// Attach CORS headers to all API responses
export async function onRequest(context) {
  const { request, next } = context;

  if (request.method === 'OPTIONS') {
    return onRequestOptions();
  }

  const response = await next();
  const newHeaders = new Headers(response.headers);

  for (const [key, value] of Object.entries(CORS_HEADERS)) {
    newHeaders.set(key, value);
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders,
  });
}
