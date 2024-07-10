export const emptyAddress = '0x0000000000000000000000000000000000000000'

export const GRACE_PERIOD = 90 * 24 * 60 * 60 * 1000

export const MOONPAY_WORKER_URL: { [key: number]: string } = {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  1: 'https://moonpay-worker.ens-cf.workers.dev',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  5: 'https://moonpay-worker-goerli.ens-cf.workers.dev',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  1337: 'https://moonpay-goerli.ens-cf.workers.dev',
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

export const INVALID_NAME = '[Invalid UNS Name]'
