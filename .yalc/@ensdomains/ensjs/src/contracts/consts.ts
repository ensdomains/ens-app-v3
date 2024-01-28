import type {
  Account,
  Address,
  Chain,
  Client,
  Transport,
  WalletClient,
} from 'viem'

type ChainContract = {
  address: Address
  blockCreated?: number
}

export const supportedChains = ['homestead', 'goerli', 'sepolia'] as const
export const supportedContracts = [
  'ensBaseRegistrarImplementation',
  'ensDnsRegistrar',
  'ensEthRegistrarController',
  'ensNameWrapper',
  'ensPublicResolver',
  'ensReverseRegistrar',
  'ensBulkRenewal',
  'ensDnssecImpl',
  'ensUniversalResolver',
  'ensRegistry',
] as const

export type SupportedChain = (typeof supportedChains)[number]
export type SupportedContract = (typeof supportedContracts)[number]

export const addresses = {
  homestead: {
    ensRegistry: {
      address: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
    },
    ensBaseRegistrarImplementation: {
      address: '0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85',
    },
    ensDnsRegistrar: {
      address: '0x58774Bb8acD458A640aF0B88238369A167546ef2',
    },
    ensEthRegistrarController: {
      address: '0x253553366Da8546fC250F225fe3d25d0C782303b',
    },
    ensNameWrapper: {
      address: '0xD4416b13d2b3a9aBae7AcD5D6C2BbDBE25686401',
    },
    ensPublicResolver: {
      address: '0x231b0Ee14048e9dCcD1d247744d114a4EB5E8E63',
    },
    ensReverseRegistrar: {
      address: '0xa58E81fe9b61B5c3fE2AFD33CF304c454AbFc7Cb',
    },
    ensBulkRenewal: {
      address: '0xa12159e5131b1eEf6B4857EEE3e1954744b5033A',
    },
    ensDnssecImpl: {
      address: '0x21745FF62108968fBf5aB1E07961CC0FCBeB2364',
    },
    ensUniversalResolver: {
      address: '0x8cab227b1162f03b8338331adaad7aadc83b895e',
    },
  },
  goerli: {
    ensRegistry: {
      address: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
    },
    ensBaseRegistrarImplementation: {
      address: '0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85',
    },
    ensDnsRegistrar: {
      address: '0x8edc487D26F6c8Fa76e032066A3D4F87E273515d',
    },
    ensEthRegistrarController: {
      address: '0xCc5e7dB10E65EED1BBD105359e7268aa660f6734',
    },
    ensNameWrapper: {
      address: '0x114D4603199df73e7D157787f8778E21fCd13066',
    },
    ensPublicResolver: {
      address: '0xd7a4F6473f32aC2Af804B3686AE8F1932bC35750',
    },
    ensReverseRegistrar: {
      address: '0x6d9F26FfBcF1c6f0bAe9F2C1f7fBe8eE6B1d8d4d',
    },
    ensBulkRenewal: {
      address: '0x6d9F26FfBcF1c6f0bAe9F2C1f7fBe8eE6B1d8d4d',
    },
    ensDnssecImpl: {
      address: '0xF427c4AdED8B6dfde604865c1a7E953B160C26f0',
    },
    ensUniversalResolver: {
      address: '0xfc4AC75C46C914aF5892d6d3eFFcebD7917293F1',
    },
  },
  sepolia: {
    ensRegistry: {
      address: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
    },
    ensBaseRegistrarImplementation: {
      address: '0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85',
    },
    ensDnsRegistrar: {
      address: '0x537625B0D7901FD20C57850d61580Bf1624Ef146',
    },
    ensEthRegistrarController: {
      address: '0xFED6a969AaA60E4961FCD3EBF1A2e8913ac65B72',
    },
    ensNameWrapper: {
      address: '0x0635513f179D50A207757E05759CbD106d7dFcE8',
    },
    ensPublicResolver: {
      address: '0x8FADE66B79cC9f707aB26799354482EB93a5B7dD',
    },
    ensReverseRegistrar: {
      address: '0xA0a1AbcDAe1a2a4A2EF8e9113Ff0e02DD81DC0C6',
    },
    ensBulkRenewal: {
      address: '0x4EF77b90762Eddb33C8Eba5B5a19558DaE53D7a1',
    },
    ensDnssecImpl: {
      address: '0x7b3ada1c8f012bae747cf99d6cbbf70d040b84cf',
    },
    ensUniversalResolver: {
      address: '0xBaBC7678D7A63104f1658c11D6AE9A21cdA09725',
    },
  },
} as const satisfies Record<
  SupportedChain,
  Record<SupportedContract, { address: Address }>
>

type Subgraphs = {
  ens: {
    url: string
  }
}

export const subgraphs = {
  homestead: {
    ens: {
      url: 'https://api.thegraph.com/subgraphs/name/ensdomains/ens',
    },
  },
  goerli: {
    ens: {
      url: 'https://api.thegraph.com/subgraphs/name/ensdomains/ensgoerli',
    },
  },
  sepolia: {
    ens: {
      url: 'https://api.studio.thegraph.com/query/49574/enssepolia/version/latest',
    },
  },
} as const satisfies Record<SupportedChain, Subgraphs>

type EnsChainContracts = {
  ensBaseRegistrarImplementation: ChainContract
  ensDnsRegistrar: ChainContract
  ensEthRegistrarController: ChainContract
  ensNameWrapper: ChainContract
  ensPublicResolver: ChainContract
  ensReverseRegistrar: ChainContract
  ensBulkRenewal: ChainContract
  ensDnssecImpl: ChainContract
}

type BaseChainContracts = {
  multicall3: ChainContract
  ensUniversalResolver: ChainContract
  ensRegistry: ChainContract
}

export type ChainWithEns<TChain extends Chain = Chain> = TChain & {
  contracts: BaseChainContracts & EnsChainContracts
  subgraphs: Subgraphs
}

export type CheckedChainWithEns<TChain extends Chain> =
  TChain['network'] extends SupportedChain
    ? TChain & {
        contracts: (typeof addresses)[TChain['network']]
        subgraphs: (typeof subgraphs)[TChain['network']]
      }
    : never

export type ClientWithEns<
  TTransport extends Transport = Transport,
  TChain extends ChainWithEns = ChainWithEns,
> = Client<TTransport, TChain>

export type WalletWithEns<
  TTransport extends Transport = Transport,
  TChain extends ChainWithEns = ChainWithEns,
  TAccount extends Account | undefined = Account | undefined,
> = WalletClient<TTransport, TChain, TAccount>
