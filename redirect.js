export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const keyPath = url.pathname.replace("/", "")
    let target = ""

    try {
      target = await env.LINKMAP.get(keyPath)
      return Response.redirect(target);
    } catch (err) {
      return new Response(`
      <style>
        body {
          margin: 0;
          padding: 0;
        }
      </style>
      <div style="font-family: sans-serif; background: black; color: white; height: 100vh; display: flex; flex-direction: column; padding: 2rem;">
        <h1>Anh's URL Shortener</h1>
        <h2>Bad Request: Missing/Incorrect source pathname for redirection.</h2>
        <h2>Error code: HTTP/418</h2>
        <p>You have tried to request path: <code style="padding: 0.25rem 1rem; background: #242424;">${keyPath === "" ? "very null" : keyPath}</code>, which does not exist in my database :sadEmoji:</p>
      </div>  
      `, { headers: { "Content-Type": "text/html" }, status: 418 });
    }

    // if (!target) {
    //   return new Response('Bad request: Missing `redirectUrl` query param', { status: 400 });
    // }

    // The Response class has static methods to create common Response objects as a convenience
  },
};
