import { connectorsForWallets, type WalletList } from '@getpara/rainbowkit'
import {
  braveWallet,
  injectedWallet,
  ledgerWallet,
  safeWallet,
  walletConnectWallet,
} from '@getpara/rainbowkit/wallets'

import { WC_PROJECT_ID } from '../constants'
import { isInsideSafe } from '../safe'

export const rainbowKitWallets = isInsideSafe()
  ? [safeWallet]
  : ([
      injectedWallet,
      safeWallet,
      braveWallet,
      walletConnectWallet,
      ledgerWallet,
    ] as const satisfies WalletList[number]['wallets'])

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
