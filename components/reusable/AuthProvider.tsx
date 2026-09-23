"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { AuthContext } from "@/components/reusable/AuthContext";
import { api, type User } from "@/utils/api";

type AuthProviderProps = {
  children: React.ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Deliberately the bare `api`, not useApi(): a 401 here is the normal
    // cold-start "not logged in yet" case, and routing it through the
    // redirecting interceptor would loop on /login.
    api
      .get<User>("/auth/me")
      .then((res) => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const logout = async () => {
    await api.post("/auth/logout");
    setUser(null);
    router.replace("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
