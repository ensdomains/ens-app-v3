import type { Wallet } from '@getpara/rainbowkit'
import { mock } from '@wagmi/core'
import type { Address } from 'viem'
import { createConnector } from 'wagmi'

/**
 * Mock wallet connector for automated/manual testing.
 *
 * Wraps wagmi's `mock` connector (https://wagmi.sh/core/api/connectors/mock) as a
 * RainbowKit wallet so it can be selected from the connect modal by a browser-driving
 * agent, and is also available for programmatic `connect({ connector })` in Playwright.
 *
 * This is ONLY included in the wagmi config when `NEXT_PUBLIC_USE_MOCK_WALLET === 'true'`
 * (see `wallets.ts`). It must never be enabled in production.
 *
 * Requests are forwarded to the active chain's transport, so against a local dev node
 * (Anvil/Hardhat via `pnpm dev:glocal`) `eth_sendTransaction` is signed by the node's
 * unlocked account — no MetaMask popup, no signing UI.
 */

/**
 * First account of the well-known test mnemonic
 * ("test test test test test test test test test test test junk"),
 * which local dev nodes unlock by default. Override with `NEXT_PUBLIC_MOCK_ACCOUNT`.
 */
export const DEFAULT_MOCK_ACCOUNT: Address = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'

/** Whether the mock wallet is enabled. Build-time flag; never set in production. */
export const isMockWalletEnabled = process.env.NEXT_PUBLIC_USE_MOCK_WALLET === 'true'

/** Connector id used by the mock wallet (matches wagmi's `mock` connector id). */
export const MOCK_CONNECTOR_ID = 'mock'

// Inline icon so we don't ship an extra asset for a test-only wallet.
const mockWalletIcon =
  "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='28' height='28'>" +
  "<rect width='28' height='28' rx='6' fill='%235298FF'/>" +
  "<text x='14' y='19' font-size='14' font-family='sans-serif' fill='white' " +
  "text-anchor='middle'>M</text></svg>"

export const mockWallet = (accounts: readonly [Address, ...Address[]]): Wallet => ({
  id: 'mock',
  name: 'Mock Wallet',
  iconUrl: mockWalletIcon,
  iconBackground: '#5298FF',
  createConnector: (walletDetails) =>
    createConnector((config) => ({
      ...mock({ accounts, features: { reconnect: true } })(config),
      ...walletDetails,
    })),
})
