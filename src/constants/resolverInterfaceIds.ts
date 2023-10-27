export const RESOLVER_INTERFACE_IDS = {
  AddressResolver: '0x3b3b57de',
  MultiCoinAddressResolver: '0xf1cb7e06',
  NameResolver: '0x691f3431',
  AbiResolver: '0x2203ab56',
  TextResolver: '0x59d1d43c',
  ContentHashResolver: '0xbc1c58d1',
  DnsRecordResolver: '0xa8fa5682',
  InterfaceResolver: '0x01ffc9a7',
  ExtendedResolver: '0x9061b923',
  VersionableResolver: '0xd700ff33',
} as const
export type ResolverInterfaceName = keyof typeof RESOLVER_INTERFACE_IDS
export type ResolverInterfaceId = (typeof RESOLVER_INTERFACE_IDS)[ResolverInterfaceName]
