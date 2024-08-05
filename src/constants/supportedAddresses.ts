export const supportedAddresses = ['eth', 'btc', 'sol', 'op', 'arb1', 'base', 'matic'] as const

export type SupportedAddress = (typeof supportedAddresses)[number]
