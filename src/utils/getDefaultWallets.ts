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
        walletConnectWallet({ chains: [chains[0]], projectId }),
        rainbowWallet({ chains: [chains[0]], projectId }),
        coinbaseWallet({ appName, chains }),
        metaMaskWallet({ chains, projectId }),
        ledgerWallet({ chains: [chains[0]], projectId }),
        argentWallet({ chains: [chains[0]], projectId }),
      ],
    },
    {
      groupName: 'Testnet',
      wallets: [
        {
          ...walletConnectWallet({ chains: [chains[1]], projectId }),
          id: 'goerli-wallet-connect',
          name: 'Goerli',
        },
        {
          ...walletConnectWallet({ chains: [chains[2]], projectId }),
          id: 'sepolia-wallet-connect',
          name: 'Sepolia',
        },
      ],
    },
  ]

  return connectorsForWallets(wallets)
}
