import { ethers } from 'ethers'
import type { BaseRegistrarImplementation } from '../generated/BaseRegistrarImplementation'
import type { DoNotCallOnChainUniversalResolverProxy } from '../generated/DoNotCallOnChainUniversalResolverProxy'
import type { ENSRegistry } from '../generated/ENSRegistry'
import type { Multicall } from '../generated/Multicall'
import type { NameWrapper } from '../generated/NameWrapper'
import type { PublicResolver } from '../generated/PublicResolver'
import type { ReverseRegistrar } from '../generated/ReverseRegistrar'
import type { UniversalResolver } from '../generated/UniversalResolver'
export default class ContractManager {
  private provider
  constructor(provider: ethers.providers.Provider)
  private generateContractGetter
  getPublicResolver: (
    passedProvider?: any,
    address?: string | undefined,
  ) => Promise<PublicResolver>
  getUniversalResolver: (
    passedProvider?: any,
    address?: string | undefined,
  ) => Promise<UniversalResolver>
  getRegistry: (
    passedProvider?: any,
    address?: string | undefined,
  ) => Promise<ENSRegistry>
  getReverseRegistrar: (
    passedProvider?: any,
    address?: string | undefined,
  ) => Promise<ReverseRegistrar>
  getDNCOCURP: (
    passedProvider?: any,
    address?: string | undefined,
  ) => Promise<DoNotCallOnChainUniversalResolverProxy>
  getNameWrapper: (
    passedProvider?: any,
    address?: string | undefined,
  ) => Promise<NameWrapper>
  getBaseRegistrar: (
    passedProvider?: any,
    address?: string | undefined,
  ) => Promise<BaseRegistrarImplementation>
  getMulticall: (
    passedProvider?: any,
    address?: string | undefined,
  ) => Promise<Multicall>
}
