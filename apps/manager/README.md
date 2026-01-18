# anh.to Manager

Link management application for the anh.to URL shortener, built with Vike and deployed on Cloudflare Workers.

## Features

- Create, read, update, and delete short links
- Protected by Cloudflare Access authentication
- Shares KV namespace with the redirector app
- Modern React-based UI

## Authentication

This application uses Cloudflare Access for authentication. To set it up:

1. Go to Cloudflare Zero Trust dashboard
2. Create an Access application for `manager.anh.to`
3. Configure authentication policies (e.g., allow your Cloudflare account email)
4. The app validates JWT tokens from Cloudflare Access

## API Endpoints

All API endpoints require a valid Cloudflare Access JWT token in the `Cf-Access-Jwt-Assertion` header.

- `GET /api/links` - List all links
- `POST /api/links` - Create a new link
  ```json
  { "key": "github", "url": "https://github.com/yourusername" }
  ```
- `PUT /api/links/:key` - Update an existing link
  ```json
  { "url": "https://github.com/newusername" }
  ```
- `DELETE /api/links/:key` - Delete a link

## Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Deploy to Cloudflare Workers
pnpm deploy
```

## Configuration

The app requires:
- KV namespace binding: `LINKMAP` (same as redirector app)
- Cloudflare Access configured for authentication
- Custom domain: `manager.anh.to`

## How it works with the redirector

1. Manager app stores links in the `LINKMAP` KV namespace
2. The key becomes the short path (e.g., `github`)
3. The value is the target URL
4. Redirector app reads from the same KV namespace
5. When someone visits `anh.to/github`, the redirector looks up `github` in KV and redirects to the stored URL
