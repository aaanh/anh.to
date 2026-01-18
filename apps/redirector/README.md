# anh.to Redirector

Fast URL redirector powered by Cloudflare Workers and KV storage.

## Features

- Global edge redirects with < 10ms latency
- Custom 404 error page
- Shared KV namespace with manager app
- No authentication required (read-only operations)

## How it Works

1. User visits `anh.to/{key}` (e.g., `anh.to/github`)
2. Worker extracts the key from the URL path
3. Looks up the key in the `LINKMAP` KV namespace
4. If found: Returns HTTP 302 redirect to the target URL
5. If not found: Shows custom 404 page with HTTP 418 status

## Configuration

### KV Namespace

The redirector uses the `LINKMAP` KV namespace:

```json
{
  "kv_namespaces": [
    {
      "id": "10243b9dccff4d0c9bb63ef68ab64431",
      "binding": "LINKMAP"
    }
  ]
}
```

This namespace is shared with the manager app, which creates and updates the link entries.

### Routes

Configured to handle the root domain:

```json
{
  "routes": [
    {
      "pattern": "anh.to",
      "zone_name": "anh.to",
      "custom_domain": true
    }
  ]
}
```

## Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Visit http://localhost:8787/{key} to test
```

### Testing Locally

1. Start the dev server: `pnpm dev`
2. Add test entries to your KV namespace
3. Visit `http://localhost:8787/{key}` in your browser

## Deployment

```bash
pnpm deploy
```

This deploys the worker to Cloudflare's global network.

## File Structure

```
src/
├── index.ts        # Main entry point, routing logic
├── redirect.ts     # Redirect handler
├── proxy.ts        # Proxy handler (unused)
├── router.ts       # API router (unused)
└── error-404.html  # Custom 404 page
```

## Error Handling

### 404 Not Found

When a key is not found in KV, the worker returns:

- **Status**: 418 I'm a teapot (because why not 🫖)
- **Response**: Custom HTML page with the requested key
- **Template**: `error-404.html` with `{{KEY_PATH}}` placeholder

### Example

```
GET https://anh.to/nonexistent
  ↓
KV Lookup: key="nonexistent" → null
  ↓
418 I'm a teapot
Custom error page: "Key 'nonexistent' not found"
```

### Fallback

If an error occurs during redirect processing, the worker falls back to:

```javascript
return Response.redirect("https://aaanh.com");
```

## Performance

- **Cold start**: ~5ms
- **KV read**: < 10ms at the edge
- **Total redirect**: < 20ms globally

## Examples

### Existing Links

- <https://anh.to/gh> - GitHub profile
- <https://anh.to/nohello> - No Hello article

### Creating New Links

Use the [manager app](https://manager.anh.to) to create new short links.

## Related

- [Manager App](../manager/README.md) - Web interface to manage links
- [Architecture](../../ARCHITECTURE.md) - System architecture overview
- [Setup Guide](../manager/SETUP.md) - Cloudflare Access setup

## License

Private project
