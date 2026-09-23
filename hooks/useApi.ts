"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { api } from "@/utils/api";

/**
 * The authenticated axios client. Use it for every call to the backend:
 *
 *   const api = useApi();
 *   await api.post("/trades", trade);
 *   const { data } = await api.get<Trade[]>("/trades");
 *
 * An expired or missing session (401) bounces the user to /login.
 */
export const useApi = () => {
  const router = useRouter();

  useEffect(() => {
    const id = api.interceptors.response.use(undefined, (error: unknown) => {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        router.replace("/login");
      }
      return Promise.reject(error);
    });
    // Eject on unmount, or interceptors stack up on every mount and a single
    // 401 fires N redirects.
    return () => api.interceptors.response.eject(id);
  }, [router]);

  return api;
};
