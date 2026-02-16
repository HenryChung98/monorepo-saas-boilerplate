"use client";

import Link from "next/link";
import { Button } from "@workspace/ui/components/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/components/auth-provider";

export default function HomeClient() {
  const { user, isLoading, logout } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {user ? (
        <>
          <h1>Welcome back, {user.email}</h1>
          <Button>
            <Link href="/profile">Profile</Link>
          </Button>
          <Button onClick={() => logout()}>Sign Out</Button>
        </>
      ) : (
        <h1>Welcome to our site</h1>
      )}
      <Button>
        <Link href="/zod-demo">Zod Demo</Link>
      </Button>
      <Button>
        <Link href="/auth/signin">Sign In</Link>
      </Button>
      <Button>
        <Link href="/auth/signup">Sign Up</Link>
      </Button>
      <ThemeToggle />
    </div>
  );
}
