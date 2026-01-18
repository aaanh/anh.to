import { handleApiRequest } from './api/handler';

/**
 * Cloudflare Workers entry point with API handling
 */
export interface CloudflareEnv extends Env {
  LINKMAP: KVNamespace;
}

export default {
  async fetch(request: Request, env: CloudflareEnv, ctx: ExecutionContext): Promise<Response> {
    // Try to handle API requests first
    const apiResponse = await handleApiRequest(request, env);
    if (apiResponse) {
      return apiResponse;
    }

    // For non-API requests, let Vike handle them
    // This will be handled by vike-photon's built-in handler
    // You'll need to integrate this with vike-photon's entry point
    
    return new Response('Not an API route - should be handled by Vike', { 
      status: 500,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
};
