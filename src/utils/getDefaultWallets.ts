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
        // TODO: Double check phantom wallet
        phantomWallet,
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
