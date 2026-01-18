import "./Layout.css";

import logoUrl from "../assets/logo.svg";
import { Link } from "../components/Link";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        maxWidth: 1400,
        margin: "auto",
      }}
    >
      <Sidebar>
        <Logo />
        <Link href="/">Home</Link>
        <Link href="/links">Link Manager</Link>
        <div style={{ marginTop: 'auto', paddingTop: '2rem', fontSize: '0.875rem', color: '#666' }}>
          <p>Protected by<br/>Cloudflare Access</p>
        </div>
      </Sidebar>
      <Content>{children}</Content>
    </div>
  );
}

function Sidebar({ children }: { children: React.ReactNode }) {
  return (
    <div
      id="sidebar"
      style={{
        padding: 20,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        lineHeight: "1.8em",
        borderRight: "2px solid #eee",
        minHeight: "100vh",
      }}
    >
      {children}
    </div>
  );
}

function Content({ children }: { children: React.ReactNode }) {
  return (
    <div id="page-container" style={{ flex: 1 }}>
      <div
        id="page-content"
        style={{
          padding: 20,
          paddingBottom: 50,
          minHeight: "100vh",
        }}
      >
        {children}
      </div>
    </div>
  );
}

function Logo() {
  return (
    <div
      style={{
        marginTop: 20,
        marginBottom: 10,
      }}
    >
      <a href="/">
        <img src={logoUrl} height={64} width={64} alt="logo" />
      </a>
      <div style={{ marginTop: '0.5rem', fontWeight: 600, fontSize: '1.2rem' }}>
        anh.to
      </div>
    </div>
  );
}
