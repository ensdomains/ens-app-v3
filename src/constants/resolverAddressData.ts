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

// ordered by recency
export const KNOWN_RESOLVER_DATA: KnownResolverData = {
  /* eslint-disable @typescript-eslint/naming-convention */
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
      address: '0xdaaf96c344f63131acadd0ea35170e7892d3dfba',
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
      address: '0x226159d592e2b063810a10ebf6dcbada94ed68b8',
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
      address: '0x1da022710df5002339274aadee8d58218e9d6ab5',
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
      address: '0x121304143ea8101e69335f309e2062d299a234b5',
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
      address: '0xff77b96d6bafcec0d684bb528b22e0ab09c70663',
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
      address: '0x6e1b40ed2d626b97a43d2c12e48a6de49a03c7a4',
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
      address: '0xc1ea41786094d1fbe5aded033b5370d51f7a3f96',
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
      address: '0xbbe3fd189d18c8b73ba54e9dd01f89e6b3ee71f0',
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
  ],
  '11155111': [
    {
      address: '0x8FADE66B79cC9f707aB26799354482EB93a5B7dD',
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
  ],
  ...(process.env.NODE_ENV === 'development'
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
  /* eslint-enable @typescript-eslint/naming-convention */
}

export const getKnownResolverData = ({
  chainId,
  resolverAddress,
}: {
  chainId: number
  resolverAddress: string
}): KnownResolverItem | undefined =>
  KNOWN_RESOLVER_DATA[chainId]?.find((data) => data.address === resolverAddress)
