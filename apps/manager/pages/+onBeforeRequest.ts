import { handleApiRequest } from '../server/api/handler';
import type { OnBeforeRequestAsync } from 'vike/types';

export const onBeforeRequest: OnBeforeRequestAsync = async (pageContext) => {
  const { request } = pageContext;
  
  // Cast to access env - this is available in Cloudflare Workers context
  const env = (pageContext as any).env as Env;
  
  if (!env) {
    console.warn('No env available in pageContext');
    return;
  }

  // Try to handle API requests
  const url = new URL(request.url);
  if (url.pathname.startsWith('/api/')) {
    const response = await handleApiRequest(request, env);
    if (response) {
      // Return the response directly to bypass Vike rendering
      return {
        pageContext: {
          httpResponse: {
            statusCode: response.status,
            headers: Object.fromEntries(response.headers.entries()),
            body: await response.text()
          }
        }
      };
    }
  }
};
