import { useEffect, useState } from 'react';

export default function Page() {
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    // Try to get user email from Cloudflare Access headers
    // This would typically be passed from the server
    const email = document.cookie
      .split('; ')
      .find(row => row.startsWith('cf-access-email='))
      ?.split('=')[1];
    
    if (email) {
      setUser(decodeURIComponent(email));
    }
  }, []);

  return (
    <>
      <h1>anh.to Link Manager</h1>
      {user && <p>Welcome, {user}!</p>}
      <p>
        This application manages short links for the anh.to domain.
      </p>
      <p>
        <a href="/links">Go to Link Manager →</a>
      </p>
      <div style={{ marginTop: '2rem', padding: '1rem', background: '#f5f5f5', borderRadius: '4px' }}>
        <h2>How it works</h2>
        <ul>
          <li>Create short links like <code>anh.to/github</code></li>
          <li>Redirects are handled by the redirector worker</li>
          <li>Links are stored in Cloudflare KV</li>
          <li>This app is protected by Cloudflare Access</li>
        </ul>
      </div>
    </>
  );
}
