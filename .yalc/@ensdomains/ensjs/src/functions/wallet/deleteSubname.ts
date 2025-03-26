import {
  encodeFunctionData,
  type Account,
  type Hash,
  type SendTransactionParameters,
  type Transport,
} from 'viem'
import { sendTransaction } from 'viem/actions'
import type { ChainWithEns, ClientWithAccount } from '../../contracts/consts.js'
import { getChainContractAddress } from '../../contracts/getChainContractAddress.js'
import {
  nameWrapperSetRecordSnippet,
  nameWrapperSetSubnodeRecordSnippet,
} from '../../contracts/nameWrapper.js'
import {
  registrySetRecordSnippet,
  registrySetSubnodeRecordSnippet,
} from '../../contracts/registry.js'
import {
  InvalidContractTypeError,
  UnsupportedNameTypeError,
} from '../../errors/general.js'
import type {
  Prettify,
  SimpleTransactionRequest,
  WriteTransactionParameters,
} from '../../types.js'
import { EMPTY_ADDRESS } from '../../utils/consts.js'
import { getNameType } from '../../utils/getNameType.js'
import { makeLabelNodeAndParent } from '../../utils/makeLabelNodeAndParent.js'
import { namehash } from '../../utils/normalise.js'

export type DeleteSubnameDataParameters = {
  /** Subname to delete */
  name: string
  /** Contract to delete subname on */
  contract: 'registry' | 'nameWrapper'
  /** If true, deletes via owner methods, otherwise will delete via parent owner methods */
  asOwner?: boolean
}

export type DeleteSubnameDataReturnType = SimpleTransactionRequest

export type DeleteSubnameParameters<
  TChain extends ChainWithEns,
  TAccount extends Account | undefined,
  TChainOverride extends ChainWithEns | undefined,
> = Prettify<
  DeleteSubnameDataParameters &
    WriteTransactionParameters<TChain, TAccount, TChainOverride>
>

export type DeleteSubnameReturnType = Hash

export const makeFunctionData = <
  TChain extends ChainWithEns,
  TAccount extends Account | undefined,
>(
  wallet: ClientWithAccount<Transport, TChain, TAccount>,
  { name, contract, asOwner }: DeleteSubnameDataParameters,
): DeleteSubnameDataReturnType => {
  const nameType = getNameType(name)
  if (nameType !== 'eth-subname' && nameType !== 'other-subname')
    throw new UnsupportedNameTypeError({
      nameType,
      supportedNameTypes: ['eth-subname', 'other-subname'],
      details: 'Cannot delete a name that is not a subname',
    })

  switch (contract) {
    case 'registry': {
      const registryAddress = getChainContractAddress({
        client: wallet,
        contract: 'ensRegistry',
      })
      if (asOwner)
        return {
          to: registryAddress,
          data: encodeFunctionData({
            abi: registrySetRecordSnippet,
            functionName: 'setRecord',
            args: [namehash(name), EMPTY_ADDRESS, EMPTY_ADDRESS, BigInt(0)],
          }),
        }

      const { labelhash, parentNode } = makeLabelNodeAndParent(name)
      return {
        to: registryAddress,
        data: encodeFunctionData({
          abi: registrySetSubnodeRecordSnippet,
          functionName: 'setSubnodeRecord',
          args: [
            parentNode,
            labelhash,
            EMPTY_ADDRESS,
            EMPTY_ADDRESS,
            BigInt(0),
          ],
        }),
      }
    }
    case 'nameWrapper': {
      const nameWrapperAddress = getChainContractAddress({
        client: wallet,
        contract: 'ensNameWrapper',
      })
      if (asOwner)
        return {
          to: nameWrapperAddress,
          data: encodeFunctionData({
            abi: nameWrapperSetRecordSnippet,
            functionName: 'setRecord',
            args: [namehash(name), EMPTY_ADDRESS, EMPTY_ADDRESS, BigInt(0)],
          }),
        }

      const { label, parentNode } = makeLabelNodeAndParent(name)
      return {
        to: nameWrapperAddress,
        data: encodeFunctionData({
          abi: nameWrapperSetSubnodeRecordSnippet,
          functionName: 'setSubnodeRecord',
          args: [
            parentNode,
            label,
            EMPTY_ADDRESS,
            EMPTY_ADDRESS,
            BigInt(0),
            0,
            BigInt(0),
          ],
        }),
      }
    }
    default:
      throw new InvalidContractTypeError({
        contractType: contract,
        supportedContractTypes: ['registry', 'nameWrapper'],
      })
  }
}

/**
 * Deletes a subname
 * @param wallet - {@link ClientWithAccount}
 * @param parameters - {@link DeleteSubnameParameters}
 * @returns Transaction hash. {@link DeleteSubnameReturnType}
 *
 * @example
 * import { createWalletClient, custom } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { addEnsContracts } from '@ensdomains/ensjs'
 * import { deleteSubname } from '@ensdomains/ensjs/wallet'
 *
 * const wallet = createWalletClient({
 *   chain: mainnetWithEns,
 *   transport: custom(window.ethereum),
 * })
 * const hash = await deleteSubname(wallet, {
 *   name: 'sub.ens.eth',
 *   contract: 'registry',
 * })
 * // 0x...
 */
async function deleteSubname<
  TChain extends ChainWithEns,
  TAccount extends Account | undefined,
  TChainOverride extends ChainWithEns | undefined = ChainWithEns,
>(
  wallet: ClientWithAccount<Transport, TChain, TAccount>,
  {
    name,
    contract,
    asOwner,
    ...txArgs
  }: DeleteSubnameParameters<TChain, TAccount, TChainOverride>,
): Promise<DeleteSubnameReturnType> {
  const data = makeFunctionData(wallet, {
    name,
    contract,
    asOwner,
  } as DeleteSubnameDataParameters)
  const writeArgs = {
    ...data,
    ...txArgs,
  } as SendTransactionParameters<TChain, TAccount, TChainOverride>
  return sendTransaction(wallet, writeArgs)
}

deleteSubname.makeFunctionData = makeFunctionData

export default deleteSubname
