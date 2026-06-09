export const emptyAddress = '0x0000000000000000000000000000000000000000'

export const GRACE_PERIOD = 90 * 24 * 60 * 60 * 1000

export const MOONPAY_WORKER_URL: { [key: number]: string } = {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  1: 'https://moonpay-worker.ens-cf.workers.dev',
}

export const FAUCET_WORKER_URL = 'https://ens-faucet.ens-cf.workers.dev'

export const WC_PROJECT_ID = '9b14144d470af1e03ab9d88aaa127332'

// 102% of price as buffer for fluctuations
export const CURRENCY_FLUCTUATION_BUFFER_PERCENTAGE = 102n

export const OG_IMAGE_URL = 'https://ens-og-image.ens-cf.workers.dev'

export const IS_DEV_ENVIRONMENT =
  process.env.NEXT_PUBLIC_ENSJS_DEBUG ||
  process.env.NODE_ENV === 'development' ||
  process.env.NEXT_PUBLIC_PROVIDER

export const INVALID_NAME = '[Invalid ENS Name]'

// HOMEPAGE points at the Simplex Network Consortium — the foundation
// (https://simplexnetwork.org/), not Simplex Chat Ltd. Social accounts
// are SimpleX Chat's public presence (sourced from https://simplex.chat/);
// the consortium does not run its own social handles.
export const SIMPLEX_LINKS = {
  HOMEPAGE: 'https://simplexnetwork.org/',
  X: 'https://twitter.com/simplexchat',
  GITHUB: 'https://github.com/simplex-chat',
  MASTODON: 'https://mastodon.social/@simplex',
  REDDIT: 'https://www.reddit.com/r/SimpleXChat/',
  NOSTR:
    'https://primal.net/p/npub1exv22uulqnmlluszc4yk92jhs2e5ajcs6mu3t00a6avzjcalj9csm7d828',
  LEMMY: 'https://lemmy.ml/c/simplex',
  EMAIL: 'mailto:chat@simplex.chat',
}

export const DISCONNECTED_PLACEHOLDER_ADDRESS =
  '0x0000000000000000000000000000000000001234' as const
