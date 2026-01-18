import { requireAuth } from '../middleware/auth';

export interface LinkEntry {
  key: string;
  url: string;
  createdAt: string;
  createdBy: string;
}

/**
 * GET /api/links - List all link entries
 */
export async function handleGetLinks(request: Request, env: Env): Promise<Response> {
  const authResult = await requireAuth(request);
  if (authResult instanceof Response) {
    return authResult;
  }

  try {
    const list = await env.LINKMAP.list();
    const links: LinkEntry[] = [];

    for (const key of list.keys) {
      const value = await env.LINKMAP.get(key.name, { type: 'json' });
      if (value && typeof value === 'object' && 'url' in value) {
        links.push(value as LinkEntry);
      } else if (typeof value === 'string') {
        // Legacy format - just the URL
        links.push({
          key: key.name,
          url: value,
          createdAt: new Date().toISOString(),
          createdBy: 'unknown'
        });
      }
    }

    return new Response(JSON.stringify({ links }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to fetch links' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

/**
 * POST /api/links - Create a new link entry
 */
export async function handleCreateLink(request: Request, env: Env): Promise<Response> {
  const authResult = await requireAuth(request);
  if (authResult instanceof Response) {
    return authResult;
  }

  try {
    const body = await request.json() as { key: string; url: string };
    
    if (!body.key || !body.url) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: key and url' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Validate URL
    try {
      new URL(body.url);
    } catch {
      return new Response(
        JSON.stringify({ error: 'Invalid URL format' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Check if key already exists
    const existing = await env.LINKMAP.get(body.key);
    if (existing) {
      return new Response(
        JSON.stringify({ error: 'Key already exists' }),
        {
          status: 409,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const linkEntry: LinkEntry = {
      key: body.key,
      url: body.url,
      createdAt: new Date().toISOString(),
      createdBy: authResult.email
    };

    // Store the URL directly for the redirector to work
    // But also store metadata
    await env.LINKMAP.put(body.key, body.url);
    await env.LINKMAP.put(`meta:${body.key}`, JSON.stringify(linkEntry));

    return new Response(JSON.stringify({ success: true, link: linkEntry }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to create link' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

/**
 * PUT /api/links/:key - Update an existing link entry
 */
export async function handleUpdateLink(request: Request, env: Env, key: string): Promise<Response> {
  const authResult = await requireAuth(request);
  if (authResult instanceof Response) {
    return authResult;
  }

  try {
    const body = await request.json() as { url: string };
    
    if (!body.url) {
      return new Response(
        JSON.stringify({ error: 'Missing required field: url' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Validate URL
    try {
      new URL(body.url);
    } catch {
      return new Response(
        JSON.stringify({ error: 'Invalid URL format' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Check if key exists
    const existing = await env.LINKMAP.get(key);
    if (!existing) {
      return new Response(
        JSON.stringify({ error: 'Key not found' }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const linkEntry: LinkEntry = {
      key: key,
      url: body.url,
      createdAt: new Date().toISOString(),
      createdBy: authResult.email
    };

    await env.LINKMAP.put(key, body.url);
    await env.LINKMAP.put(`meta:${key}`, JSON.stringify(linkEntry));

    return new Response(JSON.stringify({ success: true, link: linkEntry }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to update link' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

/**
 * DELETE /api/links/:key - Delete a link entry
 */
export async function handleDeleteLink(request: Request, env: Env, key: string): Promise<Response> {
  const authResult = await requireAuth(request);
  if (authResult instanceof Response) {
    return authResult;
  }

  try {
    const existing = await env.LINKMAP.get(key);
    if (!existing) {
      return new Response(
        JSON.stringify({ error: 'Key not found' }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    await env.LINKMAP.delete(key);
    await env.LINKMAP.delete(`meta:${key}`);

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to delete link' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
