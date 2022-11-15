// This file configures the initialization of Sentry on the browser.
// The config you add here will be used whenever a page is visited.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs'

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN

// Sentry.init({
//   dsn: SENTRY_DSN || 'https://fb6bbd7fecf34741b400eda3d2790369@o1010257.ingest.sentry.io/6524751',
//   // Adjust this value in production, or use tracesSampler for greater control
//   tracesSampleRate: 1.0,
//   enabled: !(process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_PROVIDER),
//   // ...
//   // Note: if you want to override the automatic release value, do not set a
//   // `release` value here - use the environment variable `SENTRY_RELEASE`, so
//   // that it will also get attached to your source maps
// })

Sentry.init({
    dsn: "https://ac0e3d960b024c0ca609bd495d863f17@o4504159096733696.ingest.sentry.io/4504159539625984", 
     
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
    enabled: !(process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_PROVIDER),
  });
