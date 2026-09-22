import axios from "axios";

/**
 * Same-origin client: the /api/* rewrite in next.config.ts proxies to FastAPI, so
 * the httpOnly session cookie is first-party and the browser attaches it itself.
 * Nothing to store, nothing to refresh, no Authorization header to build.
 *
 * Prefer `useApi()` in components — it adds the 401 -> /login bounce.
 */
export const api = axios.create({ baseURL: "/api", withCredentials: true });

export type User = {
  id: number;
  discord_id: string;
  username: string;
  avatar_url: string | null;
};
