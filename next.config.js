// @ts-check
const { i18n } = require('./next-i18next.config')
const { withPlugins } = require('next-compose-plugins')
const path = require('path')
const StylelintPlugin = require('stylelint-webpack-plugin')
const { withSentryConfig } = require('@sentry/nextjs')

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
  images: {
    domains: ['metadata.ens.domains'],
  },
  async rewrites() {
    return [
      {
        source: '/my/profile',
        destination: '/profile?connected=true',
      },
      {
        source: '/names/:address',
        destination: '/my/names?address=:address',
      },
      {
        source: '/profile/:name/details',
        destination: '/profile/details?name=:name',
      },
      {
        source: '/profile/:name',
        destination: '/profile?name=:name',
      },
      {
        source: '/address/:address',
        destination: '/address?address=:address',
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
            svgoConfig: {
              plugins: [{
                name: 'removeViewBox',
                active: false,
              }]              
            },
            babel: false,
          },
        },
      ],
    })
    config.plugins.push(
      new StylelintPlugin({
        files: './src/**/*.tsx',
        extensions: ['tsx'],
        failOnError: process.env.NODE_ENV !== 'development',
        cache: false,
      }),
    )

    return config
  },
}

let plugins = []

if (process.env.ANALYZE) {
  const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: true,
  })
  plugins.push([withBundleAnalyzer])
}

const withSentry = (config) => {
  const sentryWebpackPluginOptions = {
    // Additional config options for the Sentry Webpack plugin. Keep in mind that
    // the following options are set automatically, and overriding them is not
    // recommended:
    //   release, url, org, project, authToken, configFile, stripPrefix,
    //   urlPrefix, include, ignore
    silent: true, // Suppresses all logs
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options.
  }
  if (process.env.NODE_ENV === 'production')
    return withSentryConfig(config, sentryWebpackPluginOptions)
  return config
}

module.exports = withSentry(withPlugins(plugins, nextConfig))
