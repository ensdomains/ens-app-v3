import { ethers } from 'ethers'
import getBaseRegistrar from './baseRegistrar'
import getEthRegistrarController from './ethRegistrarController'
import { ContractAddressFetch } from './getContractAddress'
import getMulticall from './multicall'
import getNameWrapper from './nameWrapper'
import getPublicResolver from './publicResolver'
import getRegistry from './registry'
import getReverseRegistrar from './reverseRegistrar'
import { ContractName } from './types'
import getUniversalResolver from './universalResolver'

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

  private generateContractGetter = <C extends (...args: any) => any>(
    name: ContractName,
    func: C,
  ) => {
    return async (
      passedProvider?: any,
      address?: string,
    ): Promise<ReturnType<C>> => {
      const inputAddress = address || this.fetchAddress(name)
      const provider = passedProvider || this.provider
      return func(provider, inputAddress)
    }
  }

  public getPublicResolver = this.generateContractGetter(
    'PublicResolver',
    getPublicResolver,
  )
  public getUniversalResolver = this.generateContractGetter(
    'UniversalResolver',
    getUniversalResolver,
  )
  public getRegistry = this.generateContractGetter(
    'ENSRegistryWithFallback',
    getRegistry,
  )
  public getReverseRegistrar = this.generateContractGetter(
    'ReverseRegistrar',
    getReverseRegistrar,
  )
  public getNameWrapper = this.generateContractGetter(
    'NameWrapper',
    getNameWrapper,
  )
  public getBaseRegistrar = this.generateContractGetter(
    'BaseRegistrarImplementation',
    getBaseRegistrar,
  )
  public getEthRegistrarController = this.generateContractGetter(
    'ETHRegistrarController',
    getEthRegistrarController,
  )
  public getMulticall = this.generateContractGetter('Multicall', getMulticall)
}
