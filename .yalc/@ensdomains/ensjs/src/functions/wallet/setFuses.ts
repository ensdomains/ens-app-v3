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
import { nameWrapperSetFusesSnippet } from '../../contracts/nameWrapper.js'
import type {
  Prettify,
  SimpleTransactionRequest,
  WriteTransactionParameters,
} from '../../types.js'
import {
  encodeFuses,
  type EncodeChildFusesInputObject,
} from '../../utils/fuses.js'
import { namehash } from '../../utils/normalise.js'

export type SetFusesDataParameters = {
  /** Name to set fuses for */
  name: string
  /** Fuse object to set to */
  fuses: EncodeChildFusesInputObject
}

export type SetFusesDataReturnType = SimpleTransactionRequest

export type SetFusesParameters<
  TChain extends ChainWithEns,
  TAccount extends Account | undefined,
  TChainOverride extends ChainWithEns | undefined,
> = Prettify<
  SetFusesDataParameters &
    WriteTransactionParameters<TChain, TAccount, TChainOverride>
>

export type SetFusesReturnType = Hash

export const makeFunctionData = <
  TChain extends ChainWithEns,
  TAccount extends Account | undefined,
>(
  wallet: ClientWithAccount<Transport, TChain, TAccount>,
  { name, fuses }: SetFusesDataParameters,
): SetFusesDataReturnType => {
  const encodedFuses = encodeFuses({ restriction: 'child', input: fuses })
  return {
    to: getChainContractAddress({ client: wallet, contract: 'ensNameWrapper' }),
    data: encodeFunctionData({
      abi: nameWrapperSetFusesSnippet,
      functionName: 'setFuses',
      args: [namehash(name), encodedFuses],
    }),
  }
}

/**
 * Sets the fuses for a name.
 * @param wallet - {@link ClientWithAccount}
 * @param parameters - {@link SetFusesParameters}
 * @returns Transaction hash. {@link SetFusesReturnType}
 *
 * @example
 * import { createWalletClient, custom } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { addEnsContracts } from '@ensdomains/ensjs'
 * import { setFuses } from '@ensdomains/ensjs/wallet'
 *
 * const wallet = createWalletClient({
 *   chain: addEnsContracts(mainnet),
 *   transport: custom(window.ethereum),
 * })
 * const hash = await setFuses(wallet, {
 *   name: 'sub.ens.eth',
 *   fuses: {
 *     named: ['CANNOT_TRANSFER'],
 *   },
 * })
 * // 0x...
 */
async function setFuses<
  TChain extends ChainWithEns,
  TAccount extends Account | undefined,
  TChainOverride extends ChainWithEns | undefined = ChainWithEns,
>(
  wallet: ClientWithAccount<Transport, TChain, TAccount>,
  {
    name,
    fuses,
    ...txArgs
  }: SetFusesParameters<TChain, TAccount, TChainOverride>,
): Promise<SetFusesReturnType> {
  const data = makeFunctionData(wallet, { name, fuses })
  const writeArgs = {
    ...data,
    ...txArgs,
  } as SendTransactionParameters<TChain, TAccount, TChainOverride>
  return sendTransaction(wallet, writeArgs)
}

setFuses.makeFunctionData = makeFunctionData

export default setFuses
