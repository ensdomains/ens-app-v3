export const supportedAddresses = [
  'default',
  'eth',
  'btc',
  // SNRC additions: surface Monero and Polkadot on the profile so users
  // can advertise wallets there alongside the ENS-standard set. The
  // @ensdomains/address-encoder lib already ships SLIP-44 coders for
  // both (xmr=128, dot=354) — no additional UI work needed for display.
  'xmr',
  'dot',
  'sol',
  'op',
  'arb1',
  'base',
  'matic',
  'linea',
  'scr',
  'celo',
] as const

export type SupportedAddress = (typeof supportedAddresses)[number]
