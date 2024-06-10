import { connectorsForWallets, WalletList } from '@rainbow-me/rainbowkit'
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
} from '@rainbow-me/rainbowkit/wallets'

coinbaseWallet.preference = "all";

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
      ],
    },
  ]

  return connectorsForWallets(wallets, {
    appName,
    projectId,
  })
}
