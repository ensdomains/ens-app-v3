import { FallbackTransport, HttpTransport } from 'viem'
import { createConfig, fallback, http } from 'wagmi'
import { goerli, holesky, localhost, mainnet, sepolia } from 'wagmi/chains'

import {
  goerliWithEns,
  holeskyWithEns,
  localhostWithEns,
  mainnetWithEns,
  sepoliaWithEns,
} from '@app/constants/chains'

import { WC_PROJECT_ID } from '../constants'
import { getDefaultWallets } from '../getDefaultWallets'

const isLocalProvider = !!process.env.NEXT_PUBLIC_PROVIDER

const connectors = getDefaultWallets({
  appName: 'ENS',
  projectId: WC_PROJECT_ID,
})

const infuraKey = process.env.NEXT_PUBLIC_INFURA_KEY || 'cfa6ae2501cc4354a74e20432507317c'
const tenderlyKey = process.env.NEXT_PUBLIC_TENDERLY_KEY || '4imxc4hQfRjxrVB2kWKvTo'

const infuraUrl = (chainName: string) => `https://${chainName}.infura.io/v3/${infuraKey}`
const cloudflareUrl = (chainName: string) => `https://web3.ens.domains/v1/${chainName}`
const tenderlyUrl = (chainName: string) => `https://${chainName}.gateway.tenderly.co/${tenderlyKey}`

type SupportedUrlFunc = typeof infuraUrl | typeof cloudflareUrl | typeof tenderlyUrl

const initialiseTransports = <const UrlFuncArray extends SupportedUrlFunc[]>(
  chainName: string,
  urlFuncArray: UrlFuncArray,
) => {
  const transportArray: HttpTransport[] = []

  for (const urlFunc of urlFuncArray) {
    // eslint-disable-next-line no-continue
    if (urlFunc === infuraUrl && process.env.NEXT_PUBLIC_IPFS) continue
    transportArray.push(http(urlFunc(chainName)))
  }

  return fallback(transportArray)
}

const wagmiConfig_ = createConfig({
  connectors,
  ssr: true,
  multiInjectedProviderDiscovery: true,
  chains: [
    ...(isLocalProvider ? ([localhostWithEns] as const) : ([] as const)),
    mainnetWithEns,
    goerliWithEns,
    sepoliaWithEns,
    holeskyWithEns,
  ],
  transports: {
    ...(isLocalProvider
      ? ({
          [localhost.id]: http(process.env.NEXT_PUBLIC_PROVIDER!) as unknown as FallbackTransport,
        } as const)
      : ({} as unknown as {
          // this is a hack to make the types happy, dont remove pls
          [localhost.id]: HttpTransport
        })),
    [mainnet.id]: initialiseTransports('mainnet', [infuraUrl, cloudflareUrl, tenderlyUrl]),
    [sepolia.id]: initialiseTransports('sepolia', [infuraUrl, cloudflareUrl, tenderlyUrl]),
    [goerli.id]: initialiseTransports('goerli', [infuraUrl, cloudflareUrl, tenderlyUrl]),
    [holesky.id]: initialiseTransports('holesky', [tenderlyUrl]),
  },
})

export const wagmiConfig = wagmiConfig_ as typeof wagmiConfig_ & {
  _isEns: true
}

declare module 'wagmi' {
  interface Register {
    config: typeof wagmiConfig
  }
}
