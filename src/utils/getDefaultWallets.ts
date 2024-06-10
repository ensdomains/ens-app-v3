import { connectorsForWallets, WalletList } from '@usecapsule/rainbowkit'
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

import { capsuleWallet } from './capsuleWallet'

export const getDefaultWallets = ({
  appName,
  projectId,
}: {
  appName: string
  projectId: string
}) => {
  const wallets: WalletList = [
    {
      groupName: 'Popular',
      wallets: [
        // injected / not always shown
        injectedWallet,
        safeWallet,
        braveWallet,
        () => ({
          ...phantomWallet(),
          iconUrl: async () => (await import('../assets/PhantomWallet')).default,
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
        capsuleWallet,
      ],
    },
  ]

  return connectorsForWallets(wallets, {
    appName,
    projectId,
  })
}
