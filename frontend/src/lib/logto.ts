"use server";

import LogtoClient from "@logto/next/server-actions";

const logtoClient = new LogtoClient({
  appId: process.env.LOGTO_APP_ID!,
  appSecret: process.env.LOGTO_APP_SECRET!,
  endpoint: process.env.LOGTO_ENDPOINT || "http://localhost:3001",
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  cookieSecret: process.env.LOGTO_COOKIE_SECRET || "complex_password_at_least_32_characters_long_change_me_now!!",
  cookieSecure: process.env.NODE_ENV === "production",
  resources: [process.env.LOGTO_API_RESOURCE || "http://localhost:4000/api"],
  scopes: ["email", "profile"],
});

export async function signIn() {
  const { url, newCookie } = await logtoClient.handleSignIn(
    `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/callback`
  );
  return url;
}

export async function handleSignInCallback(searchParams: string) {
  await logtoClient.handleSignInCallback(
    `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/callback?${searchParams}`
  );
}

export async function signOut() {
  const url = await logtoClient.handleSignOut(
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  );
  return url;
}

export async function getLogtoContext() {
  return await logtoClient.getLogtoContext({
    getAccessToken: true,
    resource: process.env.LOGTO_API_RESOURCE || "http://localhost:4000/api",
    fetchUserInfo: true,
  });
}
