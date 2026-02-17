"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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
  isLoading: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  const fetchUser = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile`, {
        credentials: 'include', // 쿠키 전송
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        return true;
      } else {
        setUser(null);
        return false;
      }
    } catch (error) {
      setUser(null);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/signout`, {
      method: 'POST',
      credentials: 'include',
    });
    setUser(null);
    router.push("/");
  };

  useEffect(() => {
    setIsMounted(true);
    fetchUser();
  }, []);

  if (!isMounted) return <>{children}</>;

  return (
    <AuthContext.Provider value={{ user, fetchUser, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);