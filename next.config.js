/** @type {import('next').NextConfig} */
const { i18n } = require("./next-i18next.config");
const { withPlugins } = require("next-compose-plugins");
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

let nextConfig = {
  reactStrictMode: true,
  experimental: {
    styledComponents: true,
    // remove this once this PR is merged to main: https://github.com/vercel/next.js/pull/33236
    swcFileReading: false,
  },
  swcMinify: true,
  i18n,
  images: {
    domains: ["metadata.ens.domains"],
  },
  async rewrites() {
    return [
      {
        source: "/profile/:name",
        destination: "/profile?name=:name",
      },
    ];
  },
  webpack: (config, options) => {
    config.module.rules.push({
      test: /\.svg$/,
      issuer: /\.tsx?$/,
      include: [options.dir],
      use: [
        "next-swc-loader",
        {
          loader: "@svgr/webpack",
          options: {
            babel: false,
          },
        },
      ],
    });

    return config;
  },
};

let plugins = [[withBundleAnalyzer]];

module.exports = withPlugins(plugins, nextConfig);
