/**
 * Cloudflare Access Authentication Middleware
 * 
 * Validates JWT tokens from Cloudflare Access
 * Checks the Cf-Access-Jwt-Assertion header
 */

export interface AccessJwtPayload {
  email: string;
  sub: string;
  country: string;
  iat: number;
  exp: number;
}

/**
 * Validates Cloudflare Access JWT token
 * In production, this should verify the JWT signature against Cloudflare's public keys
 * For development, we can be more lenient
 */
export async function validateAccessToken(request: Request): Promise<AccessJwtPayload | null> {
  const token = request.headers.get('Cf-Access-Jwt-Assertion');
  
  if (!token) {
    return null;
  }

  try {
    // In a real implementation, you would:
    // 1. Fetch Cloudflare Access public keys from your team domain
    // 2. Verify the JWT signature
    // 3. Validate exp, iat claims
    // 
    // For now, we'll decode without verification for development
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }
    
    const payload = JSON.parse(atob(parts[1]));
    
    // Basic validation
    if (!payload.email || !payload.sub) {
      return null;
    }

    // Check if token is expired
    if (payload.exp && payload.exp < Date.now() / 1000) {
      return null;
    }

    return payload as AccessJwtPayload;
  } catch (error) {
    console.error('Error validating access token:', error);
    return null;
  }
}

/**
 * Middleware to check authentication
 * Returns 401 if not authenticated
 */
export async function requireAuth(request: Request): Promise<Response | AccessJwtPayload> {
  const user = await validateAccessToken(request);
  
  if (!user) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized. Please authenticate via Cloudflare Access.' }),
      {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  return user;
}
