/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Experimental features
  experimental: {
    // appDir removed - no longer needed in Next.js 14
  },

  // Webpack config for path aliases
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '~': path.join(__dirname, 'src'),
    }
    return config
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