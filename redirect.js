export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const keyPath = url.pathname.replace("/", "");
    let target = "";

    try {
      target = await env.LINKMAP.get(keyPath);
      return Response.redirect(target);
    } catch (err) {
      return new Response(
        `
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <script src="https://cdn.tailwindcss.com"></script>
          <title>Anh's URL Shortener</title>
          <meta name="description" content="A simple private URL shortener using Cloudflare Workers and KV."/>
        </head>
        <style>
          body {
            margin: 0;
            padding: 0;
          }
        </style>
        <div class="font-sans bg-black text-white h-screen flex flex-col p-8">
          <h1 class="text-4xl">Anh's URL Shortener</h1>
          <h2><b>Bad Request:</b> Missing/Incorrect source pathname for redirection.</h2>
          <h2><b>Error code:</b> <code>HTTP/418</code></h2>
          <p>You have tried to request path: <code style="padding: 0.25rem 1rem; background: #242424;">${
            keyPath === "" ? "very null, like, nothing's there..." : keyPath
          }</code>, which does not exist in my database :sadEmoji:</p>
          <p>Try <a class="text-sky-500 hover:underline" href="https://anh.to/nohello">anh.to/nohello</a></p>
          <br/>
          <ul class="flex">
            <li><a class="m-2 ml-0 p-2 bg-white/10 hover:bg-white/20 transition-all ease-in-out rounded-xl" href="https://aaanh.com">Homepage</a></li>
            <li><a class="m-2 p-2 bg-white/10 hover:bg-white/20 transition-all ease-in-out rounded-xl" href="https://github.com/aaanh">Github</a></li>
          </ul>
        </div>
      </html>  
      `,
        { headers: { "Content-Type": "text/html" }, status: 418 }
      );
    }

    // if (!target) {
    //   return new Response('Bad request: Missing `redirectUrl` query param', { status: 400 });
    // }

    // The Response class has static methods to create common Response objects as a convenience
  },
};
