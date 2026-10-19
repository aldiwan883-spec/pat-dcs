import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const config: NextConfig = {
  poweredByHeader: false,
  // The proxy strips trailing slashes itself, after answering legacy 410s directly.
  skipTrailingSlashRedirect: true,
  reactStrictMode: true,
  images: { formats: ["image/avif", "image/webp"] },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async redirects() {
    return [
      // Old WordPress page that no longer exists on its own.
      { source: "/our-team", destination: "/about-us", permanent: true },
      { source: "/ar/our-team", destination: "/ar/about-us", permanent: true },
      // English is served from the root; /en/* is only an internal route.
      { source: "/en", destination: "/", permanent: true },
      { source: "/en/:path*", destination: "/:path*", permanent: true },
    ];
  },
};

export default config;
