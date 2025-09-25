export const supportedAddresses = [
  'default',
  'eth',
  'btc',
  'sol',
  'op',
  'arb1',
  'base',
  'matic',
  'linea',
  'scr',
] as const

export type SupportedAddress = (typeof supportedAddresses)[number]
