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
  private provider: ethers.providers.Provider

  constructor(provider: ethers.providers.Provider) {
    this.provider = provider
  }

  private generateContractGetter = <C>(path: string) => {
    let imported: any
    let contract: C
    return async (passedProvider?: any, address?: string): Promise<C> => {
      if (!imported) {
        imported = (
          await import(
            /* webpackMode: "lazy", webpackChunkName: "[request]", webpackPreload: true */
            `./${path}`
          )
        ).default
      }
      if (passedProvider) {
        return imported(passedProvider, address) as C
      }
      if (!contract) {
        contract = imported(this.provider) as C
      }
      return contract as C
    }
  }

  public getPublicResolver =
    this.generateContractGetter<PublicResolver>('publicResolver')
  public getUniversalResolver =
    this.generateContractGetter<UniversalResolver>('universalResolver')
  public getRegistry = this.generateContractGetter<ENSRegistry>('registry')
  public getReverseRegistrar =
    this.generateContractGetter<ReverseRegistrar>('reverseRegistrar')
  public getDNCOCURP =
    this.generateContractGetter<DoNotCallOnChainUniversalResolverProxy>(
      'doNotCallOnChainUniversalResolverProxy',
    )
  public getNameWrapper =
    this.generateContractGetter<NameWrapper>('nameWrapper')
  public getBaseRegistrar =
    this.generateContractGetter<BaseRegistrarImplementation>('baseRegistrar')
  public getMulticall = this.generateContractGetter<Multicall>('multicall')
}
