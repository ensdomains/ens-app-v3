import { encodeFunctionData, labelhash, type Hex } from 'viem'
import { baseRegistrarOwnerOfSnippet } from '../contracts/baseRegistrar.js'
import type { ClientWithEns } from '../contracts/consts.js'
import { getChainContractAddress } from '../contracts/getChainContractAddress.js'
import { nameWrapperOwnerOfSnippet } from '../contracts/nameWrapper.js'
import { registryOwnerSnippet } from '../contracts/registry.js'
import { InvalidContractTypeError } from '../errors/general.js'

export type OwnerContract = 'nameWrapper' | 'registry' | 'registrar'

export type OwnerFromContractArgs = {
  client: ClientWithEns
  contract: OwnerContract
  namehash?: Hex
  labels?: string[]
} & (
  | {
      contract: Exclude<OwnerContract, 'registrar'>
      namehash: Hex
    }
  | {
      contract: 'registrar'
      labels: string[]
    }
)

export const ownerFromContract = ({
  client,
  contract,
  namehash,
  labels,
}: OwnerFromContractArgs) => {
  switch (contract) {
    case 'nameWrapper':
      return {
        to: getChainContractAddress({ client, contract: 'ensNameWrapper' }),
        data: encodeFunctionData({
          abi: nameWrapperOwnerOfSnippet,
          functionName: 'ownerOf',
          args: [BigInt(namehash)],
        }),
      }
    case 'registry':
      return {
        to: getChainContractAddress({ client, contract: 'ensRegistry' }),
        data: encodeFunctionData({
          abi: registryOwnerSnippet,
          functionName: 'owner',
          args: [namehash],
        }),
      }
    case 'registrar':
      return {
        to: getChainContractAddress({
          client,
          contract: 'ensBaseRegistrarImplementation',
        }),
        data: encodeFunctionData({
          abi: baseRegistrarOwnerOfSnippet,
          functionName: 'ownerOf',
          args: [BigInt(labelhash(labels[0]))],
        }),
      }
    default:
      throw new InvalidContractTypeError({
        contractType: contract,
        supportedContractTypes: ['nameWrapper', 'registry', 'registrar'],
      })
  }
}
