/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  // Only set if deploying under a project page (username.github.io/repo-name).
  // Leave unset for a user/org root site (username.github.io).
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || undefined,
};

module.exports = nextConfig;
