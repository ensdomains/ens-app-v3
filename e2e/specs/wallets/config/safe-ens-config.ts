import * as path from 'path'

import * as dotenv from 'dotenv'

// Load environment variables from .env
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

export const SafeEnsConfig = {
  // Wallet configuration
  SEED_PHRASE:
    process.env.SECRET_WORDS || 'test test test test test test test test test test test junk',
  WALLET_PASSWORD: process.env.PASSWORD || 'TestMetaMask',

  // Network configuration - force sepolia for testing
  NETWORK: 'sepolia',

  // URLs
  SAFE_URL: process.env.SAFE_URL || 'https://app.safe.global',
  ENS_APP_URL: process.env.CI
    ? 'https://127.0.0.1:8788'
    : process.env.ENS_APP_URL || 'http://localhost:3000',

  // Safe addresses for different networks
  SAFE_ADDRESSES: {
    sepolia: 'sep:0x7894BFD6441B2e9a22358F8F71FdF9B2AC817ef8',
    holesky: 'hol:0x4caeA72C02d06edF1788B743554a94a076CBdBB0', // Example
    mainnet: 'eth:0x4caeA72C02d06edF1788B743554a94a076CBdBB0', // Example
  } as const,

  // Browser configuration
  BROWSER: {
    HEADLESS: false, // MetaMask requires headed mode
    SLOW_MO: process.env.CI ? 0 : 100,
    TIMEOUT: 120000,
  },

  // MetaMask configuration
  METAMASK: {
    VERSION: '12.23.0', // Use recommended dappwright version
    SETUP_TIMEOUT: 30000,
    TRANSACTION_TIMEOUT: 60000,
  },
} as const

export type Network = keyof typeof SafeEnsConfig.SAFE_ADDRESSES

// Helper function to get Safe address for current network
export function getSafeAddress(network: string = SafeEnsConfig.NETWORK): string {
  const networkKey = network as Network
  return SafeEnsConfig.SAFE_ADDRESSES[networkKey] || SafeEnsConfig.SAFE_ADDRESSES.sepolia
}

// Log test configuration
export function logTestConfig(): void {
  console.log('Safe-ENS Test Configuration:')
  console.log(`Network: ${SafeEnsConfig.NETWORK}`)
  console.log(`Safe URL: ${SafeEnsConfig.SAFE_URL}`)
  console.log(`ENS App URL: ${SafeEnsConfig.ENS_APP_URL}`)
  console.log(`Safe Address: ${getSafeAddress()}`)
  console.log(`MetaMask Version: ${SafeEnsConfig.METAMASK.VERSION}`)
  console.log(`Headless: ${SafeEnsConfig.BROWSER.HEADLESS}`)
  console.log(
    `   Using Custom Seed: ${
      SafeEnsConfig.SEED_PHRASE !== 'test test test test test test test test test test test junk'
        ? '✓'
        : '✗'
    }`,
  )
}
