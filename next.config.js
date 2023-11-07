const { withPlugins } = require('next-compose-plugins')
const path = require('path')
const StylelintPlugin = require('stylelint-webpack-plugin')
const { withSentryConfig } = require('@sentry/nextjs')
const { execSync } = require('child_process')
const {
  createVanillaExtractPlugin
} = require('@vanilla-extract/next-plugin');
const withVanillaExtract = createVanillaExtractPlugin();

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
  // change to true once infinite loop is fixed
  swcMinify: false,
  // @ts-ignore
  images: {
    domains: ['metadata.ens.domains'],
  },
  transpilePackages: ['multiformats'],
  async rewrites() {
    return [
      {
        source: '/legacyFavourites',
        destination: '/legacyfavourites',
      },
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
        source: '/:name/expired-profile',
        destination: '/profile?name=:name&expired=true',
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
        source: '/tld/:tld/expired-profile',
        destination: '/profile?name=:tld&expired=true',
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
                return true // TODO: Ask what this is about
              }
              if (/\.yalc\/@ensdomains\/ensjs/.test(excludePath)) {
                return true
              }
              return /node_modules/.test(excludePath)
            }
          }
        }
      }
    }

    // Grab the existing rule that handles SVG imports
    // @ts-ignore - rules is a private property that is not typed
    const fileLoaderRule = config.module.rules.find((rule) => rule.test?.test?.('.svg'))

    config.module.rules.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      // Convert all other *.svg imports to React components
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] }, // exclude if *.svg?url
        use: ['@svgr/webpack'],
      },
    )

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i

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

    if (!options.isServer && !options.dev) {
      const originalEntry = config.entry
      config.entry = async (...args) => {
        const entryConfig = await originalEntry(...args)
        return {
          ...entryConfig,
          firefoxMetamask: {
            import: [
              './src/utils/metamask/firefox.ts',
              '@metamask/inpage-provider',
              '@metamask/post-message-stream',
            ],
            filename: 'static/chunks/initialise-metamask.js',
            chunkLoading: false,
          },
        }
      }

      const originalSplitChunks = config.optimization.splitChunks
      config.optimization.splitChunks = {
        ...originalSplitChunks,
        chunks: (chunk) => !/^(firefoxMetamask|polyfills|main|pages\/_app)$/.test(chunk.name),
      }
    }

    return config
  },
  eslint: {
    // next lint will ignore presets if not stated
    dirs: ['src', 'src/components', 'src/pages', 'src/layouts', 'playwright', 'e2e'],
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
    silent: false, // Suppresses all logs
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options.
  }
  if (process.env.NODE_ENV === 'production' && !process.env.NEXT_PUBLIC_IPFS)
    return withSentryConfig(config, sentryWebpackPluginOptions)
  return config
}

module.exports = withSentry(withPlugins(plugins, withVanillaExtract(nextConfig)))
