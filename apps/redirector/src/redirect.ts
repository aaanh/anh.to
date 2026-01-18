import { Env } from "./index";
import errorHtml from "./error-404.html";

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const keyPath = url.pathname.replace("/", "");

    try {
      const target = await env.LINKMAP.get(keyPath);
      if (!target) {
        throw new Error("Key not found");
      }
      return Response.redirect(target);
    } catch (err) {
      const keyPathDisplay = keyPath === "" ? "very null, like, nothing's there..." : keyPath;
      const html = errorHtml.replace("{{KEY_PATH}}", keyPathDisplay);
      
      return new Response(html, { 
        headers: { "Content-Type": "text/html" }, 
        status: 418 
      });
    }

    // if (!target) {
    //   return new Response('Bad request: Missing `redirectUrl` query param', { status: 400 });
    // }

    // The Response class has static methods to create common Response objects as a convenience
  },
};
