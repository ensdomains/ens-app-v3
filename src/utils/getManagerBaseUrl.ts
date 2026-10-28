export const MAINNET_MANAGER_BASE_URL = 'https://app.ens.domains'
export const TESTNET_MANAGER_BASE_URL = 'https://sepolia.app.ens.domains'

/**
 * The new Manager app lives at app.ens.domains on mainnet, and at sepolia.app.ens.domains
 * for testnets (e.g. Sepolia, where the ENS v2 beta is deployed).
 */
export const getManagerBaseUrl = (chainName: string) =>
  chainName === 'mainnet' ? MAINNET_MANAGER_BASE_URL : TESTNET_MANAGER_BASE_URL
