import { ethers } from 'ethers'
import type { BaseRegistrarImplementation } from '../generated/BaseRegistrarImplementation'
import type { ENSRegistry } from '../generated/ENSRegistry'
import type { Multicall } from '../generated/Multicall'
import type { NameWrapper } from '../generated/NameWrapper'
import type { PublicResolver } from '../generated/PublicResolver'
import type { ReverseRegistrar } from '../generated/ReverseRegistrar'
import type { UniversalResolver } from '../generated/UniversalResolver'
import { ContractAddressFetch } from './getContractAddress'
import { ContractName } from './types'

export default class ContractManager {
  private provider: ethers.providers.Provider
  private fetchAddress: ContractAddressFetch

  constructor(
    provider: ethers.providers.Provider,
    fetchAddress: ContractAddressFetch,
  ) {
    this.provider = provider
    this.fetchAddress = fetchAddress
  }

  private generateContractGetter = <C>(path: string, name: ContractName) => {
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
        contract = imported(this.provider, this.fetchAddress(name)) as C
      }
      return contract as C
    }
  }

  public getPublicResolver = this.generateContractGetter<PublicResolver>(
    'publicResolver',
    'PublicResolver',
  )
  public getUniversalResolver = this.generateContractGetter<UniversalResolver>(
    'universalResolver',
    'UniversalResolver',
  )
  public getRegistry = this.generateContractGetter<ENSRegistry>(
    'registry',
    'ENSRegistryWithFallback',
  )
  public getReverseRegistrar = this.generateContractGetter<ReverseRegistrar>(
    'reverseRegistrar',
    'ReverseRegistrar',
  )
  public getNameWrapper = this.generateContractGetter<NameWrapper>(
    'nameWrapper',
    'NameWrapper',
  )
  public getBaseRegistrar =
    this.generateContractGetter<BaseRegistrarImplementation>(
      'baseRegistrar',
      'BaseRegistrarImplementation',
    )
  public getMulticall = this.generateContractGetter<Multicall>(
    'multicall',
    'Multicall',
  )
}
