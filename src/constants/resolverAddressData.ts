/* eslint-disable @typescript-eslint/naming-convention */
import { Address } from 'viem'

import { deploymentAddresses } from './chains'
import { RESOLVER_INTERFACE_IDS, ResolverInterfaceId } from './resolverInterfaceIds'

type KnownResolverItem = {
  address: Address
  deployer: string
  tag: 'latest' | 'outdated' | null
  isNameWrapperAware: boolean
  supportedInterfaces: ResolverInterfaceId[]
}

type KnownResolverData = {
  [chainId: string]: KnownResolverItem[] | undefined
}

export const OFFCHAIN_DNS_RESOLVER_MAP = {
  '1': '0xF142B308cF687d4358410a4cB885513b30A42025',
  '17000': '0x7CF33078a37Cee425F1ad149875eE1e4Bdf0aD9B',
  '11155111': '0x179Be112b24Ad4cFC392eF8924DfA08C20Ad8583',
  '1337': deploymentAddresses.OffchainDNSResolver,
} as Record<string, Address | undefined>

export const EXTENDED_DNS_RESOLVER_MAP = {
  '1': '0x238A8F792dFA6033814B18618aD4100654aeef01',
  '17000': '0xB0c003d54e7c5a30C0dF72c0D43Df5876d457618',
  '11155111': '0x0EF1aF80c24B681991d675176D9c07d8C9236B9a',
  '1337': deploymentAddresses.ExtendedDNSResolver,
} as Record<string, Address | undefined>

// ordered by recency
export const KNOWN_RESOLVER_DATA: KnownResolverData = {
  '1': [
    {
      address: '0x231b0Ee14048e9dCcD1d247744d114a4EB5E8E63',
      deployer: 'ENS Labs',
      tag: 'latest',
      isNameWrapperAware: true,
      supportedInterfaces: [
        RESOLVER_INTERFACE_IDS.AddressResolver,
        RESOLVER_INTERFACE_IDS.MultiCoinAddressResolver,
        RESOLVER_INTERFACE_IDS.NameResolver,
        RESOLVER_INTERFACE_IDS.AbiResolver,
        RESOLVER_INTERFACE_IDS.TextResolver,
        RESOLVER_INTERFACE_IDS.ContentHashResolver,
        RESOLVER_INTERFACE_IDS.DnsRecordResolver,
        RESOLVER_INTERFACE_IDS.InterfaceResolver,
        RESOLVER_INTERFACE_IDS.VersionableResolver,
      ],
    },
    {
      address: '0x4976fb03C32e5B8cfe2b6cCB31c09Ba78EBaBa41',
      deployer: 'ENS Labs',
      tag: null,
      isNameWrapperAware: false,
      supportedInterfaces: [
        RESOLVER_INTERFACE_IDS.AddressResolver,
        RESOLVER_INTERFACE_IDS.MultiCoinAddressResolver,
        RESOLVER_INTERFACE_IDS.NameResolver,
        RESOLVER_INTERFACE_IDS.AbiResolver,
        RESOLVER_INTERFACE_IDS.TextResolver,
        RESOLVER_INTERFACE_IDS.ContentHashResolver,
        RESOLVER_INTERFACE_IDS.DnsRecordResolver,
        RESOLVER_INTERFACE_IDS.InterfaceResolver,
      ],
    },
    {
      address: '0xDaaF96c344f63131acadD0Ea35170E7892d3dfBA',
      deployer: 'ENS Labs',
      tag: null,
      isNameWrapperAware: false,
      supportedInterfaces: [
        RESOLVER_INTERFACE_IDS.AddressResolver,
        RESOLVER_INTERFACE_IDS.MultiCoinAddressResolver,
        RESOLVER_INTERFACE_IDS.NameResolver,
        RESOLVER_INTERFACE_IDS.AbiResolver,
        RESOLVER_INTERFACE_IDS.TextResolver,
        RESOLVER_INTERFACE_IDS.ContentHashResolver,
        RESOLVER_INTERFACE_IDS.DnsRecordResolver,
        RESOLVER_INTERFACE_IDS.InterfaceResolver,
      ],
    },
    {
      address: '0x226159d592E2b063810a10Ebf6dcbADA94Ed68b8',
      deployer: 'ENS Labs',
      tag: 'outdated',
      isNameWrapperAware: false,
      supportedInterfaces: [
        RESOLVER_INTERFACE_IDS.AddressResolver,
        RESOLVER_INTERFACE_IDS.MultiCoinAddressResolver,
        RESOLVER_INTERFACE_IDS.NameResolver,
        RESOLVER_INTERFACE_IDS.AbiResolver,
        RESOLVER_INTERFACE_IDS.TextResolver,
        RESOLVER_INTERFACE_IDS.ContentHashResolver,
        RESOLVER_INTERFACE_IDS.InterfaceResolver,
      ],
    },
    {
      address: '0x5FfC014343cd971B7eb70732021E26C35B744cc4',
      deployer: 'ENS Labs',
      tag: 'outdated',
      isNameWrapperAware: false,
      supportedInterfaces: [
        RESOLVER_INTERFACE_IDS.AddressResolver,
        RESOLVER_INTERFACE_IDS.NameResolver,
        RESOLVER_INTERFACE_IDS.AbiResolver,
        RESOLVER_INTERFACE_IDS.TextResolver,
        RESOLVER_INTERFACE_IDS.InterfaceResolver,
      ],
    },
    {
      address: '0x1da022710dF5002339274AaDEe8D58218e9D6AB5',
      deployer: 'ENS Labs',
      tag: 'outdated',
      isNameWrapperAware: false,
      supportedInterfaces: [
        RESOLVER_INTERFACE_IDS.AddressResolver,
        RESOLVER_INTERFACE_IDS.NameResolver,
        RESOLVER_INTERFACE_IDS.AbiResolver,
        RESOLVER_INTERFACE_IDS.InterfaceResolver,
      ],
    },
  ],
  '5': [
    {
      address: '0xd7a4F6473f32aC2Af804B3686AE8F1932bC35750',
      deployer: 'ENS Labs',
      tag: 'latest',
      isNameWrapperAware: true,
      supportedInterfaces: [
        RESOLVER_INTERFACE_IDS.AddressResolver,
        RESOLVER_INTERFACE_IDS.MultiCoinAddressResolver,
        RESOLVER_INTERFACE_IDS.NameResolver,
        RESOLVER_INTERFACE_IDS.AbiResolver,
        RESOLVER_INTERFACE_IDS.TextResolver,
        RESOLVER_INTERFACE_IDS.ContentHashResolver,
        RESOLVER_INTERFACE_IDS.DnsRecordResolver,
        RESOLVER_INTERFACE_IDS.InterfaceResolver,
        RESOLVER_INTERFACE_IDS.VersionableResolver,
      ],
    },
    {
      address: '0x342cf18D3e41DE491aa1a3067574C849AdA6a2Ad',
      deployer: 'ENS Labs',
      tag: null,
      isNameWrapperAware: false,
      supportedInterfaces: [
        RESOLVER_INTERFACE_IDS.AddressResolver,
        RESOLVER_INTERFACE_IDS.MultiCoinAddressResolver,
        RESOLVER_INTERFACE_IDS.NameResolver,
        RESOLVER_INTERFACE_IDS.AbiResolver,
        RESOLVER_INTERFACE_IDS.TextResolver,
        RESOLVER_INTERFACE_IDS.ContentHashResolver,
        RESOLVER_INTERFACE_IDS.DnsRecordResolver,
        RESOLVER_INTERFACE_IDS.InterfaceResolver,
        RESOLVER_INTERFACE_IDS.VersionableResolver,
      ],
    },
    {
      address: '0x19c2d5D0f035563344dBB7bE5fD09c8dad62b001',
      deployer: 'ENS Labs',
      tag: null,
      isNameWrapperAware: false,
      supportedInterfaces: [
        RESOLVER_INTERFACE_IDS.AddressResolver,
        RESOLVER_INTERFACE_IDS.MultiCoinAddressResolver,
        RESOLVER_INTERFACE_IDS.NameResolver,
        RESOLVER_INTERFACE_IDS.AbiResolver,
        RESOLVER_INTERFACE_IDS.TextResolver,
        RESOLVER_INTERFACE_IDS.ContentHashResolver,
        RESOLVER_INTERFACE_IDS.DnsRecordResolver,
        RESOLVER_INTERFACE_IDS.InterfaceResolver,
        RESOLVER_INTERFACE_IDS.VersionableResolver,
      ],
    },
    {
      address: '0x2800Ec5BAB9CE9226d19E0ad5BC607e3cfC4347E',
      deployer: 'ENS Labs',
      tag: null,
      isNameWrapperAware: false,
      supportedInterfaces: [
        RESOLVER_INTERFACE_IDS.AddressResolver,
        RESOLVER_INTERFACE_IDS.MultiCoinAddressResolver,
        RESOLVER_INTERFACE_IDS.NameResolver,
        RESOLVER_INTERFACE_IDS.AbiResolver,
        RESOLVER_INTERFACE_IDS.TextResolver,
        RESOLVER_INTERFACE_IDS.ContentHashResolver,
        RESOLVER_INTERFACE_IDS.DnsRecordResolver,
        RESOLVER_INTERFACE_IDS.InterfaceResolver,
        RESOLVER_INTERFACE_IDS.VersionableResolver,
      ],
    },
    {
      address: '0x121304143ea8101E69335F309e2062d299A234B5',
      deployer: 'ENS Labs',
      tag: null,
      isNameWrapperAware: false,
      supportedInterfaces: [
        RESOLVER_INTERFACE_IDS.AddressResolver,
        RESOLVER_INTERFACE_IDS.MultiCoinAddressResolver,
        RESOLVER_INTERFACE_IDS.NameResolver,
        RESOLVER_INTERFACE_IDS.AbiResolver,
        RESOLVER_INTERFACE_IDS.TextResolver,
        RESOLVER_INTERFACE_IDS.ContentHashResolver,
        RESOLVER_INTERFACE_IDS.DnsRecordResolver,
        RESOLVER_INTERFACE_IDS.InterfaceResolver,
      ],
    },
    {
      address: '0x4B1488B7a6B320d2D721406204aBc3eeAa9AD329',
      deployer: 'ENS Labs',
      tag: null,
      isNameWrapperAware: false,
      supportedInterfaces: [
        RESOLVER_INTERFACE_IDS.AddressResolver,
        RESOLVER_INTERFACE_IDS.MultiCoinAddressResolver,
        RESOLVER_INTERFACE_IDS.NameResolver,
        RESOLVER_INTERFACE_IDS.AbiResolver,
        RESOLVER_INTERFACE_IDS.TextResolver,
        RESOLVER_INTERFACE_IDS.ContentHashResolver,
        RESOLVER_INTERFACE_IDS.DnsRecordResolver,
        RESOLVER_INTERFACE_IDS.InterfaceResolver,
      ],
    },
    {
      address: '0xfF77b96d6bafCec0D684bB528b22e0Ab09C70663',
      deployer: 'ENS Labs',
      tag: null,
      isNameWrapperAware: false,
      supportedInterfaces: [
        RESOLVER_INTERFACE_IDS.AddressResolver,
        RESOLVER_INTERFACE_IDS.MultiCoinAddressResolver,
        RESOLVER_INTERFACE_IDS.NameResolver,
        RESOLVER_INTERFACE_IDS.AbiResolver,
        RESOLVER_INTERFACE_IDS.TextResolver,
        RESOLVER_INTERFACE_IDS.ContentHashResolver,
        RESOLVER_INTERFACE_IDS.DnsRecordResolver,
        RESOLVER_INTERFACE_IDS.InterfaceResolver,
      ],
    },
    {
      address: '0x6e1b40ed2d626b97A43d2c12e48a6De49A03c7A4',
      deployer: 'ENS Labs',
      tag: null,
      isNameWrapperAware: false,
      supportedInterfaces: [
        RESOLVER_INTERFACE_IDS.AddressResolver,
        RESOLVER_INTERFACE_IDS.MultiCoinAddressResolver,
        RESOLVER_INTERFACE_IDS.NameResolver,
        RESOLVER_INTERFACE_IDS.AbiResolver,
        RESOLVER_INTERFACE_IDS.TextResolver,
        RESOLVER_INTERFACE_IDS.ContentHashResolver,
        RESOLVER_INTERFACE_IDS.InterfaceResolver,
      ],
    },
    {
      address: '0xc1EA41786094D1fBE5aded033B5370d51F7a3F96',
      deployer: 'ENS Labs',
      tag: 'outdated',
      isNameWrapperAware: false,
      supportedInterfaces: [
        RESOLVER_INTERFACE_IDS.AddressResolver,
        RESOLVER_INTERFACE_IDS.NameResolver,
        RESOLVER_INTERFACE_IDS.AbiResolver,
        RESOLVER_INTERFACE_IDS.TextResolver,
        RESOLVER_INTERFACE_IDS.ContentHashResolver,
        RESOLVER_INTERFACE_IDS.InterfaceResolver,
      ],
    },
    {
      address: '0xBbe3fD189D18C8b73BA54e9dD01F89E6b3Ee71f0',
      deployer: 'ENS Labs',
      tag: 'outdated',
      isNameWrapperAware: false,
      supportedInterfaces: [
        RESOLVER_INTERFACE_IDS.AddressResolver,
        RESOLVER_INTERFACE_IDS.NameResolver,
        RESOLVER_INTERFACE_IDS.AbiResolver,
        RESOLVER_INTERFACE_IDS.TextResolver,
        RESOLVER_INTERFACE_IDS.ContentHashResolver,
        RESOLVER_INTERFACE_IDS.InterfaceResolver,
      ],
    },
    {
      address: '0x4B1488B7a6B320d2D721406204aBc3eeAa9AD329',
      deployer: 'ENS Labs',
      tag: 'outdated',
      isNameWrapperAware: false,
      supportedInterfaces: [
        RESOLVER_INTERFACE_IDS.AddressResolver,
        RESOLVER_INTERFACE_IDS.NameResolver,
        RESOLVER_INTERFACE_IDS.AbiResolver,
        RESOLVER_INTERFACE_IDS.TextResolver,
        RESOLVER_INTERFACE_IDS.ContentHashResolver,
        RESOLVER_INTERFACE_IDS.DnsRecordResolver,
        RESOLVER_INTERFACE_IDS.InterfaceResolver,
        RESOLVER_INTERFACE_IDS.MultiCoinAddressResolver,
      ],
    },
  ],
  '11155111': [
    {
      address: '0x8948458626811dd0c23EB25Cc74291247077cC51',
      deployer: 'ENS Labs',
      tag: 'latest',
      isNameWrapperAware: true,
      supportedInterfaces: [
        RESOLVER_INTERFACE_IDS.AddressResolver,
        RESOLVER_INTERFACE_IDS.MultiCoinAddressResolver,
        RESOLVER_INTERFACE_IDS.NameResolver,
        RESOLVER_INTERFACE_IDS.AbiResolver,
        RESOLVER_INTERFACE_IDS.TextResolver,
        RESOLVER_INTERFACE_IDS.ContentHashResolver,
        RESOLVER_INTERFACE_IDS.DnsRecordResolver,
        RESOLVER_INTERFACE_IDS.InterfaceResolver,
        RESOLVER_INTERFACE_IDS.VersionableResolver,
      ],
    },
    {
      address: '0x8FADE66B79cC9f707aB26799354482EB93a5B7dD',
      deployer: 'ENS Labs',
      tag: null,
      isNameWrapperAware: true,
      supportedInterfaces: [
        RESOLVER_INTERFACE_IDS.AddressResolver,
        RESOLVER_INTERFACE_IDS.MultiCoinAddressResolver,
        RESOLVER_INTERFACE_IDS.NameResolver,
        RESOLVER_INTERFACE_IDS.AbiResolver,
        RESOLVER_INTERFACE_IDS.TextResolver,
        RESOLVER_INTERFACE_IDS.ContentHashResolver,
        RESOLVER_INTERFACE_IDS.DnsRecordResolver,
        RESOLVER_INTERFACE_IDS.InterfaceResolver,
        RESOLVER_INTERFACE_IDS.VersionableResolver,
      ],
    },
    {
      address: '0x0CeEC524b2807841739D3B5E161F5bf1430FFA48',
      deployer: 'ENS Labs',
      tag: null,
      isNameWrapperAware: false,
      supportedInterfaces: [
        RESOLVER_INTERFACE_IDS.AddressResolver,
        RESOLVER_INTERFACE_IDS.MultiCoinAddressResolver,
        RESOLVER_INTERFACE_IDS.NameResolver,
        RESOLVER_INTERFACE_IDS.AbiResolver,
        RESOLVER_INTERFACE_IDS.TextResolver,
        RESOLVER_INTERFACE_IDS.ContentHashResolver,
        RESOLVER_INTERFACE_IDS.DnsRecordResolver,
        RESOLVER_INTERFACE_IDS.InterfaceResolver,
      ],
    },
  ],
  '17000': [
    {
      address: '0x9010A27463717360cAD99CEA8bD39b8705CCA238',
      deployer: 'ENS Labs',
      tag: 'latest',
      isNameWrapperAware: true,
      supportedInterfaces: [
        RESOLVER_INTERFACE_IDS.AddressResolver,
        RESOLVER_INTERFACE_IDS.MultiCoinAddressResolver,
        RESOLVER_INTERFACE_IDS.NameResolver,
        RESOLVER_INTERFACE_IDS.AbiResolver,
        RESOLVER_INTERFACE_IDS.TextResolver,
        RESOLVER_INTERFACE_IDS.ContentHashResolver,
        RESOLVER_INTERFACE_IDS.DnsRecordResolver,
        RESOLVER_INTERFACE_IDS.InterfaceResolver,
        RESOLVER_INTERFACE_IDS.VersionableResolver,
      ],
    },
    {
      address: '0xc5e43b622b5e6C379a984E9BdB34E9A545564fA5',
      deployer: 'ENS Labs',
      tag: null,
      isNameWrapperAware: false,
      supportedInterfaces: [
        RESOLVER_INTERFACE_IDS.AddressResolver,
        RESOLVER_INTERFACE_IDS.MultiCoinAddressResolver,
        RESOLVER_INTERFACE_IDS.NameResolver,
        RESOLVER_INTERFACE_IDS.AbiResolver,
        RESOLVER_INTERFACE_IDS.TextResolver,
        RESOLVER_INTERFACE_IDS.ContentHashResolver,
        RESOLVER_INTERFACE_IDS.DnsRecordResolver,
        RESOLVER_INTERFACE_IDS.InterfaceResolver,
      ],
    },
  ],
  ...(process.env.NEXT_PUBLIC_ETH_NODE === 'anvil'
    ? {
        '1337': [
          {
            address: deploymentAddresses.PublicResolver,
            deployer: 'ENS Labs',
            tag: 'latest',
            isNameWrapperAware: true,
            supportedInterfaces: [
              RESOLVER_INTERFACE_IDS.AddressResolver,
              RESOLVER_INTERFACE_IDS.MultiCoinAddressResolver,
              RESOLVER_INTERFACE_IDS.NameResolver,
              RESOLVER_INTERFACE_IDS.AbiResolver,
              RESOLVER_INTERFACE_IDS.TextResolver,
              RESOLVER_INTERFACE_IDS.ContentHashResolver,
              RESOLVER_INTERFACE_IDS.DnsRecordResolver,
              RESOLVER_INTERFACE_IDS.InterfaceResolver,
              RESOLVER_INTERFACE_IDS.VersionableResolver,
            ],
          },
          {
            address: '0xd7a4F6473f32aC2Af804B3686AE8F1932bC35750',
            deployer: 'dummy',
            tag: null,
            isNameWrapperAware: false,
            supportedInterfaces: [],
          },
          {
            address: deploymentAddresses.LegacyPublicResolver,
            deployer: 'ENS Labs',
            tag: null,
            isNameWrapperAware: false,
            supportedInterfaces: [
              RESOLVER_INTERFACE_IDS.AddressResolver,
              RESOLVER_INTERFACE_IDS.MultiCoinAddressResolver,
              RESOLVER_INTERFACE_IDS.NameResolver,
              RESOLVER_INTERFACE_IDS.AbiResolver,
              RESOLVER_INTERFACE_IDS.TextResolver,
              RESOLVER_INTERFACE_IDS.ContentHashResolver,
              RESOLVER_INTERFACE_IDS.DnsRecordResolver,
              RESOLVER_INTERFACE_IDS.InterfaceResolver,
            ],
          },
        ],
      }
    : {}),
}

export const getKnownResolverData = ({
  chainId,
  resolverAddress,
}: {
  chainId: number
  resolverAddress: string
}): KnownResolverItem | undefined =>
  KNOWN_RESOLVER_DATA[chainId]?.find((data) => data.address === resolverAddress)
