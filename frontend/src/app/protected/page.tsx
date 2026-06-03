import { getLogtoContext } from "@/lib/logto";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const context = await getLogtoContext();

  if (!context.isAuthenticated) {
    redirect("/");
  }

  // Call the NestJS backend protected endpoint
  let apiData: any = null;
  let apiError: string | null = null;

  if (context.accessToken) {
    try {
      const response = await fetch("http://localhost:4000/api/user/profile", {
        headers: {
          Authorization: `Bearer ${context.accessToken}`,
        },
        cache: "no-store",
      });

      if (response.ok) {
        apiData = await response.json();
      } else {
        const errorBody = await response.text();
        apiError = `${response.status} ${response.statusText}: ${errorBody}`;
      }
    } catch (error) {
      apiError = `Connection error: ${error instanceof Error ? error.message : "Unknown"}`;
    }
  } else {
    apiError = "No access token. Make sure API Resource is configured in Logto Console.";
  }

  return (
    <>
      <div className="page-header">
        <h1>🛡️ Protected API</h1>
        <p>
          This page calls the NestJS backend API with the Logto access token.
          The backend validates the JWT and returns the user claims.
        </p>
      </div>

      <div className="card">
        <h2>Request</h2>
        <p style={{ marginBottom: "16px" }}>
          <code>GET http://localhost:4000/api/user/profile</code>
        </p>
        <div className="api-response">
          <h3>Authorization Header</h3>
          <pre>
            Bearer {context.accessToken ? `${context.accessToken.substring(0, 60)}...` : "N/A"}
          </pre>
        </div>
      </div>

      <div className="card">
        <h2>Response</h2>
        <div className="api-response">
          {apiData ? (
            <>
              <h3>✅ Success (200 OK)</h3>
              <pre>{JSON.stringify(apiData, null, 2)}</pre>
            </>
          ) : (
            <>
              <h3>❌ Error</h3>
              <pre className="error">{apiError}</pre>
            </>
          )}
        </div>
      </div>
    </>
  );
}
