import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Logto Demo — Next.js + NestJS",
  description: "Full-stack authentication demo with Logto OSS, email verification, Docker",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <nav className="navbar">
          <div className="nav-content">
            <a href="/" className="nav-logo">
              <span className="logo-icon">🔐</span>
              <span className="logo-text">Logto Demo</span>
            </a>
            <div className="nav-links">
              <a href="/" className="nav-link">Home</a>
              <a href="/protected" className="nav-link">Protected API</a>
            </div>
          </div>
        </nav>
        <main className="main-content">{children}</main>
        <footer className="footer">
          <p>
            Logto Demo • Next.js + NestJS •{" "}
            <a href="http://localhost:3002" target="_blank" rel="noopener noreferrer">
              Admin Console
            </a>{" "}
            •{" "}
            <a href="http://localhost:8025" target="_blank" rel="noopener noreferrer">
              Mailpit
            </a>
          </p>
        </footer>
      </body>
    </html>
  );
}
