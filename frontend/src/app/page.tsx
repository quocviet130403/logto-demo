import { getLogtoContext } from "@/lib/logto";
import SignInButton from "@/components/SignInButton";
import SignOutButton from "@/components/SignOutButton";
import UserProfile from "@/components/UserProfile";

export default async function Home() {
  const context = await getLogtoContext();
  const isAuthenticated = context.isAuthenticated;

  return (
    <>
      {!isAuthenticated ? (
        <section className="hero">
          <h1>Logto Auth Demo</h1>
          <p>
            Full-stack authentication với Next.js, NestJS và Logto OSS.
            Đăng ký bằng email, xác thực bằng mã verification code.
          </p>
          <div className="btn-group">
            <SignInButton />
          </div>
          <div className="hero-links">
            <a href="http://localhost:3002" target="_blank" rel="noopener noreferrer" className="hero-link">
              🛠 Admin Console
            </a>
            <a href="http://localhost:8025" target="_blank" rel="noopener noreferrer" className="hero-link">
              📧 Mailpit (Email)
            </a>
            <a href="http://localhost:4000/api/health" target="_blank" rel="noopener noreferrer" className="hero-link">
              💚 Backend Health
            </a>
          </div>
        </section>
      ) : (
        <>
          <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <span className="status status-authenticated">● Authenticated</span>
            </div>
            <SignOutButton />
          </div>

          <div className="card">
            <UserProfile
              user={{
                sub: context.claims?.sub,
                email: context.userInfo?.email ?? context.claims?.email as string | undefined,
                email_verified: context.userInfo?.email_verified ?? context.claims?.email_verified as boolean | undefined,
                name: context.userInfo?.name ?? context.claims?.name as string | undefined,
                picture: context.userInfo?.picture ?? undefined,
                username: context.userInfo?.username ?? undefined,
              }}
            />
          </div>

          <div className="card">
            <h2>🔑 Access Token</h2>
            <p style={{ marginBottom: "16px" }}>Token dùng để gọi protected API trên NestJS backend.</p>
            <div className="api-response">
              <pre>
                {context.accessToken
                  ? `${context.accessToken.substring(0, 80)}...`
                  : "No access token available. Make sure API Resource is configured in Logto."}
              </pre>
            </div>
          </div>
        </>
      )}
    </>
  );
}
