# anh.to Monorepo

URL shortener powered by Cloudflare Workers. Functionalities similar to `aka.ms` 👌

## Apps

### Redirector (`apps/redirector`)

URL shortener that handles the actual redirections.

- **URL**: <https://anh.to>
- **Technology**: Cloudflare Workers + KV
- **Features**: Fast edge redirects, custom 404 page

Try it:
- <https://anh.to/gh>
- <https://anh.to/nohello>

### Manager (`apps/manager`)

Web application to manage short links.

- **URL**: <https://manager.anh.to>
- **Technology**: Vike (React SSR) + Cloudflare Workers
- **Authentication**: Cloudflare Access (SSO)
- **Features**: Create, read, update, delete short links

## Architecture

Both apps share the same Cloudflare KV namespace for storing link mappings:
- **Redirector** reads from KV to perform redirects
- **Manager** writes to KV to create/update/delete links
- **Manager** is protected by Cloudflare Access authentication

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed architecture documentation.

## Development

Install dependencies:

```bash
pnpm install
```

Run redirector:

```bash
cd apps/redirector
pnpm dev
# Runs on localhost:8787
```

Run manager:

```bash
cd apps/manager
pnpm dev
# Runs on localhost:3000
```

## Deployment

Deploy redirector:

```bash
cd apps/redirector
pnpm deploy
```

Deploy manager:

```bash
cd apps/manager
pnpm deploy
```

## Setup

For setting up Cloudflare Access authentication, see [apps/manager/SETUP.md](./apps/manager/SETUP.md).

## Documentation

- [Architecture Overview](./ARCHITECTURE.md)
- [Manager Setup Guide](./apps/manager/SETUP.md)
- [Manager API Reference](./apps/manager/API.md)
- [Manager README](./apps/manager/README.md)
