export const supportedAddresses = [
  'eth',
  'btc',
  'sol',
  'op',
  'arb1',
  'base',
  'matic',
  'linea',
] as const

export type SupportedAddress = (typeof supportedAddresses)[number]
