"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { signIn } from "../lib/logto";

export default function SignInButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSignIn = () => {
    startTransition(async () => {
      const redirectUrl = await signIn();
      router.push(redirectUrl);
    });
  };

  return (
    <button
      onClick={handleSignIn}
      disabled={isPending}
      className="btn btn-primary"
    >
      {isPending ? "Redirecting..." : "Sign In / Sign Up"}
    </button>
  );
}
