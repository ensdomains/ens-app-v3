import { connectorsForWallets, type WalletList } from '@getpara/rainbowkit'
import {
  argentWallet,
  braveWallet,
  coinbaseWallet,
  injectedWallet,
  ledgerWallet,
  metaMaskWallet,
  phantomWallet,
  rainbowWallet,
  safeWallet,
  walletConnectWallet,
} from '@getpara/rainbowkit/wallets'
import type { Address } from 'viem'

import { WC_PROJECT_ID } from '../constants'
import { isInsideSafe } from '../safe'
import { DEFAULT_MOCK_ACCOUNT, isMockWalletEnabled, mockWallet } from './mockWallet'

// Test-only: when enabled, a "Mock Wallet" is added to the connect modal (and the
// wagmi connectors array) so automated/manual testing can connect without MetaMask.
// Never set this in production builds.
const mockAccount = (process.env.NEXT_PUBLIC_MOCK_ACCOUNT as Address) || DEFAULT_MOCK_ACCOUNT

const standardWallets = isInsideSafe()
  ? [safeWallet]
  : ([
      // injected / not always shown
      injectedWallet,
      safeWallet,
      braveWallet,
      () => ({
        ...phantomWallet(),
        iconUrl: async () => (await import('../../assets/PhantomWallet')).default,
        iconBackground: '#9A8AEE',
        downloadUrls: {},
      }),
      // always shown
      walletConnectWallet,
      rainbowWallet,
      coinbaseWallet,
      metaMaskWallet,
      ledgerWallet,
      argentWallet,
    ] as const satisfies WalletList[number]['wallets'])

export const rainbowKitWallets = (
  isMockWalletEnabled ? [() => mockWallet([mockAccount]), ...standardWallets] : standardWallets
) as WalletList[number]['wallets']

export const rainbowKitConnectors = connectorsForWallets(
  [
    {
      groupName: 'Popular',
      wallets: rainbowKitWallets,
    },
  ],
  {
    appName: 'ENS',
    projectId: WC_PROJECT_ID,
  },
)
