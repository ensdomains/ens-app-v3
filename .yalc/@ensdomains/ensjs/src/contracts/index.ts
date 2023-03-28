import type { Interface } from '@ethersproject/abi'
import type { Signer } from '@ethersproject/abstract-signer'
import type { BaseContract } from '@ethersproject/contracts'
import type { Provider } from '@ethersproject/providers'
import type { BaseRegistrarImplementation } from '../generated/BaseRegistrarImplementation'
import type { BulkRenewal } from '../generated/BulkRenewal'
import type { DNSRegistrar } from '../generated/DNSRegistrar'
import type { ENSRegistry } from '../generated/ENSRegistry'
import type { ETHRegistrarController } from '../generated/ETHRegistrarController'
import type { Multicall } from '../generated/Multicall'
import type { NameWrapper } from '../generated/NameWrapper'
import type { PublicResolver } from '../generated/PublicResolver'
import type { ReverseRegistrar } from '../generated/ReverseRegistrar'
import type { UniversalResolver } from '../generated/UniversalResolver'
import { ContractAddressFetch } from './getContractAddress'
import { ContractName } from './types'

type BaseFactory = {
  readonly abi: object
  createInterface(): Interface
  connect(address: string, signerOrProvider: Signer | Provider): BaseContract
}

export default class ContractManager {
  private provider: Provider

  private fetchAddress: ContractAddressFetch

  // eslint-disable-next-line class-methods-use-this
  protected getModule = async (name: string) => {
    const mod = await import(
      /* webpackMode: "lazy", webpackChunkName: "[request]", webpackPreload: true, webpackExclude: /.*\.ts$/ */
      `../generated/factories/${name}__factory`
    )
    return mod[`${name}__factory`] as BaseFactory
  }

  constructor(
    provider: Provider,
    fetchAddress: ContractAddressFetch,
    getModule?: (name: string) => Promise<BaseFactory>,
  ) {
    this.provider = provider
    this.fetchAddress = fetchAddress
    if (getModule) {
      this.getModule = getModule
    }
  }

  private generateContractGetter = <C extends BaseContract>(
    name: ContractName,
  ): ((passedProvider?: any, address?: string) => Promise<C>) => {
    return async (passedProvider, address) => {
      const mod = await this.getModule(name)
      const inputAddress = address || this.fetchAddress(name)
      const provider = passedProvider || this.provider
      return mod.connect(inputAddress, provider) as C
    }
  }

  public getPublicResolver =
    this.generateContractGetter<PublicResolver>('PublicResolver')

  public getUniversalResolver =
    this.generateContractGetter<UniversalResolver>('UniversalResolver')

  public getRegistry = this.generateContractGetter<ENSRegistry>('ENSRegistry')

  public getReverseRegistrar =
    this.generateContractGetter<ReverseRegistrar>('ReverseRegistrar')

  public getNameWrapper =
    this.generateContractGetter<NameWrapper>('NameWrapper')

  public getDNSRegistrar =
    this.generateContractGetter<DNSRegistrar>('DNSRegistrar')

  public getBaseRegistrar =
    this.generateContractGetter<BaseRegistrarImplementation>(
      'BaseRegistrarImplementation',
    )

  public getEthRegistrarController =
    this.generateContractGetter<ETHRegistrarController>(
      'ETHRegistrarController',
    )

  public getMulticall = this.generateContractGetter<Multicall>('Multicall')

  public getBulkRenewal =
    this.generateContractGetter<BulkRenewal>('BulkRenewal')
}
