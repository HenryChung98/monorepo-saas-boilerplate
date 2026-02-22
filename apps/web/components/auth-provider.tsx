"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@workspace/ui/components/spinner";

type User = { userId: string; email: string; name: string } | null;

const AuthContext = createContext<{
  user: User;
  fetchUser: () => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}>({
  user: null,
  fetchUser: async () => false,
  logout: () => {},
  isLoading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchUser = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        // data가 null인 경우는 로그인이 안 된 상태이므로 user를 null로 설정
        if (!data) {
          setUser(null);
          return false;
        }
        setUser(data);
        return true;
      } else {
        setUser(null);
        return false;
      }
    } catch {
      setUser(null);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/signout`, {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
    router.push("/");
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, fetchUser, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
