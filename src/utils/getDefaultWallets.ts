import { Chain, WalletList, connectorsForWallets } from '@rainbow-me/rainbowkit'
import {
  argentWallet,
  braveWallet,
  coinbaseWallet,
  injectedWallet,
  ledgerWallet,
  metaMaskWallet,
  rainbowWallet,
  safeWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets'

export const getDefaultWallets = ({
  appName,
  projectId,
  chains,
}: {
  appName: string
  projectId: string
  chains: Chain[]
}) => {
  const wallets: WalletList = [
    {
      groupName: 'Popular',
      wallets: [
        // injected / not always shown
        injectedWallet({ chains }),
        safeWallet({ chains }),
        braveWallet({ chains }),
        // always shown
        walletConnectWallet({ chains, projectId }),
        rainbowWallet({ chains, projectId }),
        coinbaseWallet({ appName, chains }),
        metaMaskWallet({ chains, projectId }),
        ledgerWallet({ chains, projectId }),
        argentWallet({ chains, projectId }),
      ],
    },
  ]

  return connectorsForWallets(wallets)
}
