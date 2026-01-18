import { handleGetLinks, handleCreateLink, handleUpdateLink, handleDeleteLink } from './links';

/**
 * API Router for the manager app
 * Handles all /api/* routes
 */
export async function handleApiRequest(request: Request, env: Env): Promise<Response | null> {
  const url = new URL(request.url);
  
  if (!url.pathname.startsWith('/api/')) {
    return null;
  }

  // Enable CORS for API requests
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Cf-Access-Jwt-Assertion',
  };

  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    let response: Response;

    // GET /api/links - List all links
    if (url.pathname === '/api/links' && request.method === 'GET') {
      response = await handleGetLinks(request, env);
    }
    // POST /api/links - Create a new link
    else if (url.pathname === '/api/links' && request.method === 'POST') {
      response = await handleCreateLink(request, env);
    }
    // PUT /api/links/:key - Update a link
    else if (url.pathname.match(/^\/api\/links\/[^/]+$/) && request.method === 'PUT') {
      const key = url.pathname.split('/').pop()!;
      response = await handleUpdateLink(request, env, key);
    }
    // DELETE /api/links/:key - Delete a link
    else if (url.pathname.match(/^\/api\/links\/[^/]+$/) && request.method === 'DELETE') {
      const key = url.pathname.split('/').pop()!;
      response = await handleDeleteLink(request, env, key);
    }
    // 404 for unknown API routes
    else {
      response = new Response(
        JSON.stringify({ error: 'Not found' }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Add CORS headers to response
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  } catch (error) {
    console.error('API Error:', error);
    const response = new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );

    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  }
}
