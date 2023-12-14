import { Chain, WalletList, connectorsForWallets } from '@rainbow-me/rainbowkit'
import {
  argentWallet,
  braveWallet,
  coinbaseWallet,
  injectedWallet,
  metaMaskWallet,
  phantomWallet,
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
        // This is to ensure wallet can be seen on mobile when the user is using that wallet's app
        injectedWallet({ chains }),
        safeWallet({ chains }),
        braveWallet({ chains }),
        {
          ...phantomWallet({ chains }),
          iconUrl: async () => (await import('../assets/PhantomWallet')).default,
          iconBackground: '#9A8AEE',
          downloadUrls: {},
        },
        // always shown
        walletConnectWallet({ chains, projectId }),
        rainbowWallet({ chains, projectId }),
        coinbaseWallet({ appName, chains }),
        metaMaskWallet({ chains, projectId }),
        // ledgerWallet({ chains, projectId }),
        argentWallet({ chains, projectId }),
      ],
    },
  ]

  return connectorsForWallets(wallets)
}
