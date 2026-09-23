"use client";

import { createContext } from "react";

import type { User } from "@/utils/api";

export type AuthState = {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthState | null>(null);
