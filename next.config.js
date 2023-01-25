// @ts-check
const { i18n } = require('./next-i18next.config')
const { withPlugins } = require('next-compose-plugins')
const path = require('path')
const StylelintPlugin = require('stylelint-webpack-plugin')
const { withSentryConfig } = require('@sentry/nextjs')
const { execSync } = require('child_process')

const babelIncludeRegexes = [
  /next[\\/]dist[\\/]shared[\\/]lib/,
  /next[\\/]dist[\\/]client/,
  /next[\\/]dist[\\/]pages/,
  /[\\/](strip-ansi|ansi-regex)[\\/]/,
]

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
        source: '/:address(0x[a-fA-F0-9]{40}$)',
        destination: '/address?address=:address',
      },
      {
        source: '/:name',
        destination: '/profile?name=:name',
      },
      {
        source: '/:name/register',
        destination: '/register?name=:name',
      },
      {
        source: '/:name/import',
        destination: '/import?name=:name',
      },
      {
        source: '/tld/:tld',
        destination: '/profile?name=:tld',
      },
      {
        source: '/tld/:tld/register',
        destination: '/register?name=:tld',
      },
      {
        source: '/tld/:tld/import',
        destination: '/import?name=:tld',
      },
    ]
  },
  generateBuildId: () => {
    const hash = execSync('git rev-parse HEAD').toString().trim()
    return hash
  },
  webpack: (config, options) => {
    for (const rule of config.module.rules) {
      if (rule.oneOf && rule.oneOf.length > 5) {
        for (const item of rule.oneOf) {
          if (typeof item.exclude === 'function' && item.test.toString().includes('js')) {
            item.exclude = (excludePath) => {
              if (babelIncludeRegexes.some((r) => r.test(excludePath))) {
                return false
              }
              if (/\.yalc\/@ensdomains\/thorin/.test(excludePath)) {
                return true
              }
              return /node_modules/.test(excludePath)
            }
          }
        }
      }
    }
    config.module.rules.push({
      // test for .js or .mjs
      test: /(?<!@ethersproject\/.*)\.m?js$/,
      use: {
        loader: path.resolve(__dirname, './loaders/ethers-loader.js'),
        options: {},
      },
    })
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
              plugins: [
                {
                  name: 'removeViewBox',
                  active: false,
                },
              ],
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
    config.plugins.push(
      new options.webpack.DefinePlugin({
        'process.env.CONFIG_BUILD_ID': JSON.stringify(options.buildId),
      }),
    )
    if (process.env.NEXT_PUBLIC_IPFS) {
      config.resolve.alias['../styles.css'] = path.resolve(__dirname, 'src/stub.css')
    }

    config.resolve.alias['@ethersproject/strings/lib/idna.js'] = path.resolve(
      __dirname,
      'src/stub.js',
    )

    return config
  },
  ...(process.env.NEXT_PUBLIC_IPFS
    ? {
        trailingSlash: true,
        assetPrefix: './',
      }
    : {}),
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
  if (process.env.NODE_ENV === 'production' && !process.env.NEXT_PUBLIC_IPFS)
    return withSentryConfig(config, sentryWebpackPluginOptions)
  return config
}

module.exports = withSentry(withPlugins(plugins, nextConfig))
