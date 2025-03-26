import {
  encodeFunctionData,
  labelhash,
  type Account,
  type Hash,
  type SendTransactionParameters,
  type Transport,
} from 'viem'
import { sendTransaction } from 'viem/actions'
import type { ChainWithEns, ClientWithAccount } from '../../contracts/consts.js'
import { getChainContractAddress } from '../../contracts/getChainContractAddress.js'
import { nameWrapperSetChildFusesSnippet } from '../../contracts/nameWrapper.js'
import type {
  Prettify,
  SimpleTransactionRequest,
  WriteTransactionParameters,
} from '../../types.js'
import { encodeFuses, type EncodeFusesInputObject } from '../../utils/fuses.js'
import { namehash } from '../../utils/normalise.js'

export type SetChildFusesDataParameters = {
  /** Name to set child fuses for */
  name: string
  /** Fuse object or number value to set to */
  fuses: EncodeFusesInputObject
  /** Expiry to set for fuses */
  expiry?: number | bigint
}

export type SetChildFusesDataReturnType = SimpleTransactionRequest

export type SetChildFusesParameters<
  TChain extends ChainWithEns,
  TAccount extends Account | undefined,
  TChainOverride extends ChainWithEns | undefined,
> = Prettify<
  SetChildFusesDataParameters &
    WriteTransactionParameters<TChain, TAccount, TChainOverride>
>

export type SetChildFusesReturnType = Hash

export const makeFunctionData = <
  TChain extends ChainWithEns,
  TAccount extends Account | undefined,
>(
  wallet: ClientWithAccount<Transport, TChain, TAccount>,
  { name, fuses, expiry }: SetChildFusesDataParameters,
): SetChildFusesDataReturnType => {
  const encodedFuses = encodeFuses({ input: fuses })
  const labels = name.split('.')
  const labelHash = labelhash(labels.shift()!)
  const parentNode = namehash(labels.join('.'))
  return {
    to: getChainContractAddress({ client: wallet, contract: 'ensNameWrapper' }),
    data: encodeFunctionData({
      abi: nameWrapperSetChildFusesSnippet,
      functionName: 'setChildFuses',
      args: [parentNode, labelHash, encodedFuses, BigInt(expiry ?? 0)],
    }),
  }
}

/**
 * Sets the fuses for a name as the parent.
 * @param wallet - {@link ClientWithAccount}
 * @param parameters - {@link SetChildFusesParameters}
 * @returns Transaction hash. {@link SetChildFusesReturnType}
 *
 * @example
 * import { createWalletClient, custom } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { addEnsContracts } from '@ensdomains/ensjs'
 * import { setChildFuses } from '@ensdomains/ensjs/wallet'
 *
 * const wallet = createWalletClient({
 *   chain: addEnsContracts(mainnet),
 *   transport: custom(window.ethereum),
 * })
 * const hash = await setChildFuses(wallet, {
 *   name: 'sub.ens.eth',
 *   fuses: {
 *     parent: {
 *       named: ['PARENT_CANNOT_CONTROl'],
 *     },
 *   },
 * })
 * // 0x...
 */
async function setChildFuses<
  TChain extends ChainWithEns,
  TAccount extends Account | undefined,
  TChainOverride extends ChainWithEns | undefined = ChainWithEns,
>(
  wallet: ClientWithAccount<Transport, TChain, TAccount>,
  {
    name,
    fuses,
    expiry,
    ...txArgs
  }: SetChildFusesParameters<TChain, TAccount, TChainOverride>,
): Promise<SetChildFusesReturnType> {
  const data = makeFunctionData(wallet, { name, fuses, expiry })
  const writeArgs = {
    ...data,
    ...txArgs,
  } as SendTransactionParameters<TChain, TAccount, TChainOverride>
  return sendTransaction(wallet, writeArgs)
}

setChildFuses.makeFunctionData = makeFunctionData

export default setChildFuses
