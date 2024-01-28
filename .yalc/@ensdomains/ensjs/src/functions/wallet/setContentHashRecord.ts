import type {
  Account,
  Address,
  Hash,
  SendTransactionParameters,
  Transport,
} from 'viem'
import type { ChainWithEns, WalletWithEns } from '../../contracts/consts.js'
import type {
  Prettify,
  SimpleTransactionRequest,
  WriteTransactionParameters,
} from '../../types.js'
import { encodeSetContentHash } from '../../utils/encoders/encodeSetContentHash.js'
import { namehash } from '../../utils/normalise.js'

export type SetContentHashRecordDataParameters = {
  /** Name to set content hash for */
  name: string
  /** Content hash value */
  contentHash: string | null
  /** Resolver address to set content hash on */
  resolverAddress: Address
}

export type SetContentHashRecordDataReturnType = SimpleTransactionRequest

export type SetContentHashRecordParameters<
  TChain extends ChainWithEns,
  TAccount extends Account | undefined,
  TChainOverride extends ChainWithEns | undefined,
> = Prettify<
  SetContentHashRecordDataParameters &
    WriteTransactionParameters<TChain, TAccount, TChainOverride>
>

export type SetContentHashRecordReturnType = Hash

export const makeFunctionData = <
  TChain extends ChainWithEns,
  TAccount extends Account | undefined,
>(
  _wallet: WalletWithEns<Transport, TChain, TAccount>,
  { name, contentHash, resolverAddress }: SetContentHashRecordDataParameters,
): SetContentHashRecordDataReturnType => {
  return {
    to: resolverAddress,
    data: encodeSetContentHash({ namehash: namehash(name), contentHash }),
  }
}

/**
 * Sets the content hash record for a name on a resolver.
 * @param wallet - {@link WalletWithEns}
 * @param parameters - {@link SetContentHashRecordParameters}
 * @returns Transaction hash. {@link SetContentHashRecordReturnType}
 *
 * @example
 * import { createWalletClient, custom } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { addEnsContracts } from '@ensdomains/ensjs'
 * import { setContentHashRecord } from '@ensdomains/ensjs/wallet'
 *
 * const wallet = createWalletClient({
 *   chain: addEnsContracts(mainnet),
 *   transport: custom(window.ethereum),
 * })
 * const hash = await setContentHashRecord(wallet, {
 *   name: 'ens.eth',
 *   value: 'ipns://k51qzi5uqu5djdczd6zw0grmo23j2vkj9uzvujencg15s5rlkq0ss4ivll8wqw',
 *   resolverAddress: '0x4976fb03C32e5B8cfe2b6cCB31c09Ba78EBaBa41',
 * })
 * // 0x...
 */
async function setContentHashRecord<
  TChain extends ChainWithEns,
  TAccount extends Account | undefined,
  TChainOverride extends ChainWithEns | undefined = ChainWithEns,
>(
  wallet: WalletWithEns<Transport, TChain, TAccount>,
  {
    name,
    contentHash,
    resolverAddress,
    ...txArgs
  }: SetContentHashRecordParameters<TChain, TAccount, TChainOverride>,
): Promise<SetContentHashRecordReturnType> {
  const data = makeFunctionData(wallet, {
    name,
    contentHash,
    resolverAddress,
  })
  const writeArgs = {
    ...data,
    ...txArgs,
  } as SendTransactionParameters<TChain, TAccount, TChainOverride>
  return wallet.sendTransaction(writeArgs)
}

setContentHashRecord.makeFunctionData = makeFunctionData

export default setContentHashRecord
