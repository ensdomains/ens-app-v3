// @ts-check
const { i18n } = require('./next-i18next.config')
const { withPlugins } = require('next-compose-plugins')
const withTM = require('next-transpile-modules')(['@ensdomains/ensjs'])
const path = require('path')

/**
 * @type {import('next').NextConfig}
 **/
let nextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  experimental: {
    // remove this once this PR is merged to main: https://github.com/vercel/next.js/pull/33236
    swcFileReading: false,
  },
  // change to true once infinite loop is fixed
  swcMinify: false,
  // @ts-ignore
  i18n,
  images: {
    domains: ['metadata.ens.domains'],
  },
  async rewrites() {
    return [
      {
        source: '/profile/:name',
        destination: '/profile?name=:name',
      },
    ]
  },
  webpack: (config, options) => {
    config.module.rules.push({
      test: /ens.+\.json$/,
      use: {
        loader: path.resolve(__dirname, './loaders/abi-loader.js'),
        options: {},
      },
    })
    config.module.rules.push({
      test: /\.svg$/,
      issuer: /\.tsx?$/,
      include: [options.dir],
      use: [
        'next-swc-loader',
        {
          loader: '@svgr/webpack',
          options: {
            babel: false,
          },
        },
      ],
    })

    return config
  },
}

let plugins = [[withTM]]

if (process.env.ANALYZE) {
  const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: true,
  })
  plugins.push([withBundleAnalyzer])
}

module.exports = withPlugins(plugins, nextConfig)
