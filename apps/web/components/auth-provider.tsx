"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@workspace/ui/components/spinner";

type User = { userId: string; email: string; name: string } | null;

const API_BASE = `${process.env.NEXT_PUBLIC_API_URL}/api`;

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
      let response = await fetch(`${API_BASE}/auth/me`, {
        credentials: "include",
      });

      // accessToken 만료 시 → refresh 시도
      if (response.status === 401) {
        const refreshRes = await fetch(`${API_BASE}/auth/refresh`, {
          method: "POST",
          credentials: "include",
        });

        if (!refreshRes.ok) {
          setUser(null);
          return false;
        }

        // 새 accessToken으로 재시도
        response = await fetch(`${API_BASE}/auth/me`, {
          credentials: "include",
        });
      }

      if (response.ok) {
        const data = await response.json();
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
    await fetch(`${API_BASE}/auth/signout`, {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
    router.push("/auth/signin");
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
