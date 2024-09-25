import { connectorsForWallets, type WalletList } from '@usecapsule/rainbowkit'
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
} from '@usecapsule/rainbowkit/wallets'

import { WC_PROJECT_ID } from '../constants'

export const rainbowKitWallets = [
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
] as const satisfies WalletList[number]['wallets']

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
