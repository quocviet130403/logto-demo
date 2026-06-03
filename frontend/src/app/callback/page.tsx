"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";
import { handleSignInCallback } from "@/lib/logto";

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isHandled = useRef(false);

  useEffect(() => {
    // Prevent double execution in React strict mode
    if (isHandled.current) return;
    isHandled.current = true;

    const handle = async () => {
      try {
        await handleSignInCallback(searchParams.toString());
        router.replace("/");
      } catch (error) {
        console.error("Sign-in callback error:", error);
        router.replace("/");
      }
    };

    handle();
  }, [router, searchParams]);

  return (
    <div className="loading">
      Completing sign-in...
    </div>
  );
}

export default function CallbackPage() {
  return (
    <Suspense fallback={<div className="loading">Loading...</div>}>
      <CallbackHandler />
    </Suspense>
  );
}
