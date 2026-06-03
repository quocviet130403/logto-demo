"use server";

import LogtoClient from "@logto/next/server-actions";

const logtoClient = new LogtoClient({
  appId: process.env.LOGTO_APP_ID!,
  appSecret: process.env.LOGTO_APP_SECRET!,
  endpoint: process.env.LOGTO_ENDPOINT || "https://logto-demo-auth.minproxy.io",
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || "https://logto-demo.minproxy.io",
  cookieSecret: process.env.LOGTO_COOKIE_SECRET || "complex_password_at_least_32_characters_long_change_me_now!!",
  cookieSecure: process.env.NODE_ENV === "production",
  resources: [process.env.LOGTO_API_RESOURCE || "https://logto-demo.minproxy.io/api"],
  scopes: ["email", "profile"],
});

export async function signIn() {
  const { url, newCookie } = await logtoClient.handleSignIn(
    `${process.env.NEXT_PUBLIC_BASE_URL || "https://logto-demo.minproxy.io"}/callback`
  );
  return url;
}

export async function handleSignInCallback(searchParams: string) {
  await logtoClient.handleSignInCallback(
    `${process.env.NEXT_PUBLIC_BASE_URL || "https://logto-demo.minproxy.io"}/callback?${searchParams}`
  );
}

export async function signOut() {
  const url = await logtoClient.handleSignOut(
    process.env.NEXT_PUBLIC_BASE_URL || "https://logto-demo.minproxy.io"
  );
  return url;
}

export async function getLogtoContext() {
  return await logtoClient.getLogtoContext({
    getAccessToken: true,
    resource: process.env.LOGTO_API_RESOURCE || "https://logto-demo.minproxy.io/api",
    fetchUserInfo: true,
  });
}
