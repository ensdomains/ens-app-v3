import type { Hex } from 'viem'
import type { ClientWithEns } from '../../contracts/consts.js'
import { FunctionNotBatchableError } from '../../errors/public.js'
import type {
  SimpleTransactionRequest,
  TransactionRequestWithPassthrough,
} from '../../types.js'
import {
  generateFunction,
  type BatchFunctionResult,
  type GeneratedFunction,
} from '../../utils/generateFunction.js'
import multicallWrapper from './multicallWrapper.js'

type ExtractResult<TFunction extends BatchFunctionResult> = TFunction extends {
  decode: (...args: any[]) => Promise<infer U>
}
  ? U
  : never

export type BatchParameters = BatchFunctionResult[]

export type BatchReturnType<TFunctions extends BatchFunctionResult[]> = {
  [TFunctionName in keyof TFunctions]: ExtractResult<TFunctions[TFunctionName]>
}

const encode = (
  client: ClientWithEns,
  ...items: BatchFunctionResult[]
): TransactionRequestWithPassthrough => {
  const rawDataArr: SimpleTransactionRequest[] = items.map(
    ({ args, encode: encodeRef }, i: number) => {
      if (!encodeRef) throw new FunctionNotBatchableError({ functionIndex: i })
      return encodeRef(client, ...args)
    },
  )
  const response = multicallWrapper.encode(client, {
    transactions: rawDataArr,
  })
  return { ...response, passthrough: rawDataArr }
}

const decode = async <I extends BatchFunctionResult[]>(
  client: ClientWithEns,
  data: Hex,
  passthrough: TransactionRequestWithPassthrough[],
  ...items: I
): Promise<BatchReturnType<I>> => {
  const response = await multicallWrapper.decode(client, data, passthrough)
  if (!response) throw new Error('No response from multicall')

  return Promise.all(
    response.map((ret, i: number) => {
      if (passthrough[i].passthrough) {
        return items[i].decode(
          client,
          ret.returnData,
          passthrough[i].passthrough,
          ...items[i].args,
        )
      }
      return items[i].decode(client, ret.returnData, ...items[i].args)
    }),
  ) as Promise<BatchReturnType<I>>
}

type BatchableFunctionObject = GeneratedFunction<typeof encode, typeof decode>

/**
 * Batches multiple read functions into a single call.
 * @param client - {@link ClientWithEns}
 * @param ...parameters - Array of {@link BatchFunctionResult} objects
 * @returns Array of return values from each function
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { addEnsContracts } from '@ensdomains/ensjs'
 * import { batch, getTextRecord, getAddressRecord } from '@ensdomains/ensjs/public'
 *
 * const client = createPublicClient({
 *   chain: addEnsContracts(mainnet),
 *   transport: http(),
 * })
 * const result = await batch(
 *   client,
 *   getTextRecord.batch({ name: 'ens.eth', key: 'com.twitter' }),
 *   getAddressRecord.batch({ name: 'ens.eth', coin: 'ETH' }),
 * )
 * // ['ensdomains', { id: 60, name: 'ETH', value: '0xFe89cc7aBB2C4183683ab71653C4cdc9B02D44b7 }]
 */
const batch = generateFunction({
  encode,
  decode,
}) as (<I extends BatchFunctionResult[]>(
  client: ClientWithEns,
  ...args: I
) => Promise<BatchReturnType<I>>) &
  BatchableFunctionObject

export default batch
