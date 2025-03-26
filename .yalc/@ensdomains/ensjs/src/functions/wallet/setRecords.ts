import {
  encodeFunctionData,
  type Account,
  type Address,
  type Hash,
  type SendTransactionParameters,
  type Transport,
} from 'viem'
import { sendTransaction } from 'viem/actions'
import type { ChainWithEns, ClientWithAccount } from '../../contracts/consts.js'
import { publicResolverMulticallSnippet } from '../../contracts/publicResolver.js'
import { NoRecordsSpecifiedError } from '../../errors/public.js'
import type {
  Prettify,
  SimpleTransactionRequest,
  WriteTransactionParameters,
} from '../../types.js'
import {
  generateRecordCallArray,
  type RecordOptions,
} from '../../utils/generateRecordCallArray.js'
import { namehash } from '../../utils/normalise.js'

export type SetRecordsDataParameters = {
  /** The name to set records for */
  name: string
  /** The resolver address to set records on */
  resolverAddress: Address
} & RecordOptions

export type SetRecordsDataReturnType = SimpleTransactionRequest

export type SetRecordsParameters<
  TChain extends ChainWithEns,
  TAccount extends Account | undefined,
  TChainOverride extends ChainWithEns | undefined,
> = Prettify<
  SetRecordsDataParameters &
    WriteTransactionParameters<TChain, TAccount, TChainOverride>
>

export type SetRecordsReturnType = Hash

export const makeFunctionData = <
  TChain extends ChainWithEns,
  TAccount extends Account | undefined,
>(
  _wallet: ClientWithAccount<Transport, TChain, TAccount>,
  { name, resolverAddress, ...records }: SetRecordsDataParameters,
): SetRecordsDataReturnType => {
  const callArray = generateRecordCallArray({
    namehash: namehash(name),
    ...records,
  })
  if (callArray.length === 0) throw new NoRecordsSpecifiedError()
  if (callArray.length === 1)
    return {
      to: resolverAddress,
      data: callArray[0],
    }
  return {
    to: resolverAddress,
    data: encodeFunctionData({
      abi: publicResolverMulticallSnippet,
      functionName: 'multicall',
      args: [callArray],
    }),
  }
}

/**
 * Sets multiple records for a name on a resolver.
 * @param wallet - {@link ClientWithAccount}
 * @param parameters - {@link SetRecordsParameters}
 * @returns Transaction hash. {@link SetRecordsReturnType}
 *
 * @example
 * import { createWalletClient, custom } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { addEnsContracts } from '@ensdomains/ensjs'
 * import { setRecords } from '@ensdomains/ensjs/wallet'
 *
 * const wallet = createWalletClient({
 *   chain: addEnsContracts(mainnet),
 *   transport: custom(window.ethereum),
 * })
 * const hash = await setRecords(wallet, {
 *   name: 'ens.eth',
 *   coins: [
 *     {
 *       coin: 'ETH',
 *       value: '0xFe89cc7aBB2C4183683ab71653C4cdc9B02D44b7',
 *     },
 *   ],
 *   texts: [{ key: 'foo', value: 'bar' }],
 *   resolverAddress: '0x4976fb03C32e5B8cfe2b6cCB31c09Ba78EBaBa41',
 * })
 * // 0x...
 */
async function setRecords<
  TChain extends ChainWithEns,
  TAccount extends Account | undefined,
  TChainOverride extends ChainWithEns | undefined = ChainWithEns,
>(
  wallet: ClientWithAccount<Transport, TChain, TAccount>,
  {
    name,
    resolverAddress,
    clearRecords,
    contentHash,
    texts,
    coins,
    abi,
    ...txArgs
  }: SetRecordsParameters<TChain, TAccount, TChainOverride>,
): Promise<SetRecordsReturnType> {
  const data = makeFunctionData(wallet, {
    name,
    resolverAddress,
    clearRecords,
    contentHash,
    texts,
    coins,
    abi,
  })
  const writeArgs = {
    ...data,
    ...txArgs,
  } as SendTransactionParameters<TChain, TAccount, TChainOverride>
  return sendTransaction(wallet, writeArgs)
}

setRecords.makeFunctionData = makeFunctionData

export default setRecords
