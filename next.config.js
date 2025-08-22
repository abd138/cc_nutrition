/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  swcMinify: true,
  
  // PWA Configuration
  experimental: {
    appDir: true,
  },
  
  // For PWA support
  async headers() {
    return [
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
    ];
  },

  // Image optimization for food photos
  images: {
    domains: ['images.unsplash.com', 'api.nal.usda.gov'],
  },

  // I18n support for global deployment
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
};

export default config;