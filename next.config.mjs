// @ts-check

/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-param-reassign */
import { execSync } from 'child_process'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'

import StylelintPlugin from 'stylelint-webpack-plugin'

const __dirname = dirname(fileURLToPath(import.meta.url))

const babelIncludeRegexes = [
  /next[\\/]dist[\\/]shared[\\/]lib/,
  /next[\\/]dist[\\/]client/,
  /next[\\/]dist[\\/]pages/,
  /[\\/](strip-ansi|ansi-regex)[\\/]/,
]

/**
 * @type {import('next').NextConfig}
 * */
const nextConfig = {
  transpilePackages: [
    '@getpara/rainbowkit',
    '@getpara/rainbowkit-wallet',
    '@getpara/core-components',
    '@getpara/react-components',
    '@getpara/react-sdk',
    '@getpara/core-sdk',
    '@getpara/web-sdk',
    '@getpara/wagmi-v2-integration',
    '@getpara/viem-v2-integration',
  ],
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  // change to true once infinite loop is fixed
  swcMinify: true,
  images: {
    domains: ['metadata.ens.domains'],
  },
  async headers() {
    // keep this in case we need to debug Safe in the future
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          source: '/manifest.json',
          headers: [
            {
              key: 'Access-Control-Allow-Origin',
              value: '*',
            },
            {
              key: 'Access-Control-Allow-Methods',
              value: 'GET, OPTIONS',
            },
            {
              key: 'Access-Control-Allow-Headers',
              value: 'X-Requested-With, content-type, Authorization',
            },
          ],
        },
        {
          source: '/(.*)',
          headers: [
            {
              key: 'Content-Security-Policy',
              value: "frame-ancestors 'self' https://app.safe.global;",
            },
          ],
        },
      ]
    }
    return []
  },
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
        source: '/:name/dotbox',
        destination: '/dotbox?name=:name',
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
            /**
             * @param {string} excludePath
             * @returns {boolean}
             */
            item.exclude = (excludePath) => {
              if (babelIncludeRegexes.some((r) => r.test(excludePath))) {
                return false
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

    config.resolve.mainFields = ['browser', 'module', 'main']

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

    if (!options.isServer && !options.dev) {
      const originalEntry = config.entry
      /**
       * @param  {...any} args
       */
      config.entry = async (...args) => {
        const entryConfig = await originalEntry(...args)
        return {
          ...entryConfig,
          firefoxMetamask: {
            import: [
              './src/utils/metamask/firefox.ts',
              '@metamask/providers',
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
        /**
         * @param {{ name: string }} chunk
         * @returns {boolean}
         */
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

/**
 * @type {((config: import('next').NextConfig) => import('next').NextConfig)[]}
 */
const plugins = []

if (process.env.ANALYZE) {
  const withBundleAnalyzer = await import('@next/bundle-analyzer').then((n) => n.default)
  plugins.push(withBundleAnalyzer({ enabled: true }))
}

export default plugins.reduce((acc, next) => next(acc), nextConfig)
