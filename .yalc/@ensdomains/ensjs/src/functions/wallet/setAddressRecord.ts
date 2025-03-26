import type {
  Account,
  Address,
  Hash,
  SendTransactionParameters,
  Transport,
} from 'viem'
import { sendTransaction } from 'viem/actions'
import type { ChainWithEns, ClientWithAccount } from '../../contracts/consts.js'
import type {
  Prettify,
  SimpleTransactionRequest,
  WriteTransactionParameters,
} from '../../types.js'
import { encodeSetAddr } from '../../utils/encoders/encodeSetAddr.js'
import { namehash } from '../../utils/normalise.js'

export type SetAddressRecordDataParameters = {
  /** Name to set address record for */
  name: string
  /** Coin ticker or ID to set */
  coin: string | number
  /** Value to set, null if deleting */
  value: Address | string | null
  /** Resolver address to set address record on */
  resolverAddress: Address
}

export type SetAddressRecordDataReturnType = SimpleTransactionRequest

export type SetAddressRecordParameters<
  TChain extends ChainWithEns,
  TAccount extends Account | undefined,
  TChainOverride extends ChainWithEns | undefined,
> = Prettify<
  SetAddressRecordDataParameters &
    WriteTransactionParameters<TChain, TAccount, TChainOverride>
>

export type SetAddressRecordReturnType = Hash

export const makeFunctionData = <
  TChain extends ChainWithEns,
  TAccount extends Account | undefined,
>(
  _wallet: ClientWithAccount<Transport, TChain, TAccount>,
  { name, coin, value, resolverAddress }: SetAddressRecordDataParameters,
): SetAddressRecordDataReturnType => {
  return {
    to: resolverAddress,
    data: encodeSetAddr({ namehash: namehash(name), coin, value }),
  }
}

/**
 * Sets an address record for a name on a resolver.
 * @param wallet - {@link ClientWithAccount}
 * @param parameters - {@link SetAddressRecordParameters}
 * @returns Transaction hash. {@link SetAddressRecordReturnType}
 *
 * @example
 * import { createWalletClient, custom } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { addEnsContracts } from '@ensdomains/ensjs'
 * import { setAddressRecord } from '@ensdomains/ensjs/wallet'
 *
 * const wallet = createWalletClient({
 *   chain: addEnsContracts(mainnet),
 *   transport: custom(window.ethereum),
 * })
 * const hash = await setAddressRecord(wallet, {
 *   name: 'ens.eth',
 *   coin: 'ETH',
 *   value: '0xFe89cc7aBB2C4183683ab71653C4cdc9B02D44b7',
 *   resolverAddress: '0x4976fb03C32e5B8cfe2b6cCB31c09Ba78EBaBa41',
 * })
 * // 0x...
 */
async function setAddressRecord<
  TChain extends ChainWithEns,
  TAccount extends Account | undefined,
  TChainOverride extends ChainWithEns | undefined = ChainWithEns,
>(
  wallet: ClientWithAccount<Transport, TChain, TAccount>,
  {
    name,
    coin,
    value,
    resolverAddress,
    ...txArgs
  }: SetAddressRecordParameters<TChain, TAccount, TChainOverride>,
): Promise<SetAddressRecordReturnType> {
  const data = makeFunctionData(wallet, {
    name,
    coin,
    value,
    resolverAddress,
  })
  const writeArgs = {
    ...data,
    ...txArgs,
  } as SendTransactionParameters<TChain, TAccount, TChainOverride>
  return sendTransaction(wallet, writeArgs)
}

setAddressRecord.makeFunctionData = makeFunctionData

export default setAddressRecord
