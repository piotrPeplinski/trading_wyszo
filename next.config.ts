import type { NextConfig } from "next";

// Proxying /api/* to FastAPI is what makes the auth design work: the browser only
// ever talks to this origin, so the backend's httpOnly session cookie is first-party
// (works in Safari/Firefox, unlike a cross-site SameSite=None cookie) and there is no
// CORS to configure. API_URL needs no NEXT_PUBLIC_ prefix — it's read server-side only.
//
// Caveat: `next build` bakes rewrites into a manifest, so changing API_URL on Vercel
// requires a redeploy, not just a restart.
const API_URL = process.env.API_URL ?? "http://localhost:8000";

const nextConfig: NextConfig = {
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${API_URL}/:path*` }];
  },
};

export default nextConfig;
