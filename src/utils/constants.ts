export const emptyAddress = '0x0000000000000000000000000000000000000000'

export const networkName = {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  '1': 'mainnet',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  '5': 'goerli',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  '4': 'rinkeby',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  '3': 'ropsten',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  '1337': 'local',
}

export const GRACE_PERIOD = 90 * 24 * 60 * 60 * 1000

export const MOONPAY_WORKER_URL: { [key: number]: string } = {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  1: 'https://moonpay-worker.ens-cf.workers.dev',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  5: 'https://moonpay-worker-goerli.ens-cf.workers.dev',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  1337: 'https://moonpay-goerli.ens-cf.workers.dev',
}

export const WC_PROJECT_ID = '9b14144d470af1e03ab9d88aaa127332'

// 102% of price as buffer for fluctuations
export const CURRENCY_FLUCTUATION_BUFFER_PERCENTAGE = 102
