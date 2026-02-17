"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";

export default function CallbackPage() {
  const router = useRouter();
  const { fetchUser } = useAuth();

  useEffect(() => {
    fetchUser().then((success) => {
      if (success) {
        router.push("/");
      } else {
        router.push("/auth/signin");
      }
    });
  }, []);

  return <div>loading...</div>;
}