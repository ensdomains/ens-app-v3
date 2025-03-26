import type { Account, Address, Chain, Client, Transport } from 'viem'
import type { Assign, Prettify } from '../types.js'

type ChainContract = {
  address: Address
  blockCreated?: number
}

export const supportedChains = [1, 5, 17000, 11155111] as const
export const supportedContracts = [
  'ensBaseRegistrarImplementation',
  'ensBulkRenewal',
  'ensDnsRegistrar',
  'ensDnssecImpl',
  'ensEthRegistrarController',
  'ensNameWrapper',
  'ensPublicResolver',
  'ensRegistry',
  'ensReverseRegistrar',
  'ensUniversalResolver',
  'legacyEthRegistrarController',
  'legacyPublicResolver',
] as const

export type SupportedChain = (typeof supportedChains)[number]
export type SupportedContract = (typeof supportedContracts)[number]

export const addresses = {
  1: {
    ensBaseRegistrarImplementation: {
      address: '0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85',
    },
    ensBulkRenewal: {
      address: '0xa12159e5131b1eEf6B4857EEE3e1954744b5033A',
    },
    ensDnsRegistrar: {
      address: '0xB32cB5677a7C971689228EC835800432B339bA2B',
    },
    ensDnssecImpl: {
      address: '0x0fc3152971714E5ed7723FAFa650F86A4BaF30C5',
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
    ensRegistry: {
      address: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
    },
    ensReverseRegistrar: {
      address: '0xa58E81fe9b61B5c3fE2AFD33CF304c454AbFc7Cb',
    },
    ensUniversalResolver: {
      address: '0x50Eb7A57C17e0E97EaC1B366b1Ea673Ec2BbDa61',
    },
    legacyEthRegistrarController: {
      address: '0x283Af0B28c62C092C9727F1Ee09c02CA627EB7F5',
    },
    legacyPublicResolver: {
      address: '0x4976fb03C32e5B8cfe2b6cCB31c09Ba78EBaBa41',
    },
  },
  5: {
    ensBaseRegistrarImplementation: {
      address: '0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85',
    },
    ensBulkRenewal: {
      address: '0x6d9F26FfBcF1c6f0bAe9F2C1f7fBe8eE6B1d8d4d',
    },
    ensDnsRegistrar: {
      address: '0x8edc487D26F6c8Fa76e032066A3D4F87E273515d',
    },
    ensDnssecImpl: {
      address: '0xF427c4AdED8B6dfde604865c1a7E953B160C26f0',
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
    ensRegistry: {
      address: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
    },
    ensReverseRegistrar: {
      address: '0x6d9F26FfBcF1c6f0bAe9F2C1f7fBe8eE6B1d8d4d',
    },
    ensUniversalResolver: {
      address: '0x898A1182F3C2BBBF0b16b4DfEf63E9c3e9eB4821',
    },
    legacyEthRegistrarController: {
      address: '0x283Af0B28c62C092C9727F1Ee09c02CA627EB7F5',
    },
    legacyPublicResolver: {
      address: '0xDaaF96c344f63131acadD0Ea35170E7892d3dfBA',
    },
  },
  17000: {
    ensBaseRegistrarImplementation: {
      address: '0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85',
    },
    ensBulkRenewal: {
      address: '0xbc4cfB363F948E64Cd73Da6438F64CB37E2e33d1',
    },
    ensDnsRegistrar: {
      address: '0x458d278AEd4cE82BAeC384170f39198b01B8351c',
    },
    ensDnssecImpl: {
      address: '0x283af0b28c62c092c9727f1ee09c02ca627eb7f5',
    },
    ensEthRegistrarController: {
      address: '0xF404D2F84BC1735f7D9948F032D61F5fFfD9D3C3',
    },
    ensNameWrapper: {
      address: '0xab50971078225D365994dc1Edcb9b7FD72Bb4862',
    },
    ensPublicResolver: {
      address: '0x5a692ffe769A9B3D0e61F7446F5cAED650044C36',
    },
    ensRegistry: {
      address: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
    },
    ensReverseRegistrar: {
      address: '0x65EE0b0B030a76c95a7ff046C0e0c8f7A2d1B004',
    },
    ensUniversalResolver: {
      address: '0x4be8eaE8d104125ECdCAD406bD370d69479d497e',
    },
    legacyEthRegistrarController: {
      address: '0xf13fC748601fDc5afA255e9D9166EB43f603a903',
    },
    legacyPublicResolver: {
      address: '0xc5e43b622b5e6C379a984E9BdB34E9A545564fA5',
    },
  },
  11155111: {
    ensBaseRegistrarImplementation: {
      address: '0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85',
    },
    ensBulkRenewal: {
      address: '0x4EF77b90762Eddb33C8Eba5B5a19558DaE53D7a1',
    },
    ensDnsRegistrar: {
      address: '0x5a07C75Ae469Bf3ee2657B588e8E6ABAC6741b4f',
    },
    ensDnssecImpl: {
      address: '0xe62E4b6cE018Ad6e916fcC24545e20a33b9d8653',
    },
    ensEthRegistrarController: {
      address: '0x4477cAc137F3353Ca35060E01E5aEb777a1Ca01B',
    },
    ensNameWrapper: {
      address: '0x0635513f179D50A207757E05759CbD106d7dFcE8',
    },
    ensPublicResolver: {
      address: '0x8948458626811dd0c23EB25Cc74291247077cC51',
    },
    ensRegistry: {
      address: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
    },
    ensReverseRegistrar: {
      address: '0xCF75B92126B02C9811d8c632144288a3eb84afC8',
    },
    ensUniversalResolver: {
      address: '0xC087fF4e7D743c3ae6673FF5d42391b741369169',
    },
    legacyEthRegistrarController: {
      address: '0x7e02892cfc2Bfd53a75275451d73cF620e793fc0',
    },
    legacyPublicResolver: {
      address: '0x0CeEC524b2807841739D3B5E161F5bf1430FFA48',
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
  1: {
    ens: {
      url: 'https://api.thegraph.com/subgraphs/name/ensdomains/ens',
    },
  },
  5: {
    ens: {
      url: 'https://api.thegraph.com/subgraphs/name/ensdomains/ensgoerli',
    },
  },
  17000: {
    ens: {
      url: 'https://api.studio.thegraph.com/query/49574/ensholesky/version/latest',
    },
  },
  11155111: {
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
  legacyEthRegistrarController: ChainContract
  legacyPublicResolver: ChainContract
}

type BaseChainContracts = {
  multicall3: ChainContract
  ensUniversalResolver: ChainContract
  ensRegistry: ChainContract
}

export type ChainWithEns<TChain extends Chain = Chain> = Omit<
  TChain,
  'contracts'
> & {
  contracts: BaseChainContracts & EnsChainContracts
  subgraphs: Subgraphs
}

export type ChainWithBaseContracts = Assign<
  Omit<Chain, 'contracts'>,
  {
    contracts: BaseChainContracts
  }
>

export type CheckedChainWithEns<TChain extends Chain> =
  TChain['id'] extends SupportedChain
    ? TChain['contracts'] extends BaseChainContracts
      ? TChain & {
          contracts: Prettify<(typeof addresses)[TChain['id']]>
          subgraphs: (typeof subgraphs)[TChain['id']]
        }
      : never
    : never

export type ClientWithEns<
  TTransport extends Transport = Transport,
  TChain extends ChainWithEns = ChainWithEns,
> = Client<TTransport, TChain>

export type ClientWithAccount<
  TTransport extends Transport = Transport,
  TChain extends ChainWithEns = ChainWithEns,
  TAccount extends Account | undefined = Account | undefined,
> = Client<TTransport, TChain, TAccount>
