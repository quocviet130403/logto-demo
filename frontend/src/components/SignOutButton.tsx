"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { signOut } from "../lib/logto";

export default function SignOutButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSignOut = () => {
    startTransition(async () => {
      const redirectUrl = await signOut();
      router.push(redirectUrl);
    });
  };

  return (
    <button
      onClick={handleSignOut}
      disabled={isPending}
      className="btn btn-secondary"
    >
      {isPending ? "Signing out..." : "Sign Out"}
    </button>
  );
}
