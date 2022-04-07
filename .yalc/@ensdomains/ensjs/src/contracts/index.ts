import { ethers } from 'ethers'

export default class ContractManager {
  private provider: ethers.providers.Provider

  constructor(provider: ethers.providers.Provider) {
    this.provider = provider
  }

  private generateContractGetter = (path: string) => {
    let imported: any
    let contract: ethers.Contract
    return async (
      passedProvider?: any,
      address?: string,
    ): Promise<ethers.Contract> => {
      if (!imported) {
        imported = (
          await import(
            /* webpackMode: "lazy", webpackChunkName: "[request]", webpackPreload: true */
            `./${path}`
          )
        ).default
      }
      if (passedProvider) {
        return imported(passedProvider, address) as ethers.Contract
      }
      if (!contract) {
        contract = imported(this.provider) as ethers.Contract
      }
      return contract as ethers.Contract
    }
  }

  public getPublicResolver = this.generateContractGetter('publicResolver')
  public getUniversalResolver = this.generateContractGetter('universalResolver')
  public getRegistry = this.generateContractGetter('registry')
  public getReverseRegistrar = this.generateContractGetter('reverseRegistrar')
  public getDNCOCURP = this.generateContractGetter('DNCOCURP')
  public getNameWrapper = this.generateContractGetter('nameWrapper')
  public getBaseRegistrar = this.generateContractGetter('baseRegistrar')
  public getMulticall = this.generateContractGetter('multicall')
}
