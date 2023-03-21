import { TransactionRequest } from '@ethersproject/abstract-provider'
import { BatchFunctionResult, ENSArgs, RawFunction } from '..'

const raw = async (
  { multicallWrapper }: ENSArgs<'multicallWrapper'>,
  ...items: BatchFunctionResult<RawFunction>[]
) => {
  const rawDataArr: { to: string; data: string }[] = await Promise.all(
    items.map(({ args, raw: rawRef }, i: number) => {
      if (!rawRef) {
        throw new Error(`Function ${i} is not batchable`)
      }
      return rawRef(...args)
    }),
  )
  const response = await multicallWrapper.raw(rawDataArr)
  return { ...response, passthrough: rawDataArr }
}

const decode = async (
  { multicallWrapper }: ENSArgs<'multicallWrapper'>,
  data: string,
  passthrough: TransactionRequest & { passthrough?: any }[],
  ...items: BatchFunctionResult<RawFunction>[]
): Promise<any[] | undefined> => {
  const response = await multicallWrapper.decode(data, passthrough)
  if (!response) return

  return Promise.all(
    response.map((ret: any, i: number) => {
      if (passthrough[i].passthrough) {
        return items[i].decode(
          ret.returnData,
          passthrough[i].passthrough,
          ...items[i].args,
        )
      }
      return items[i].decode(ret.returnData, ...items[i].args)
    }),
  )
}

export default {
  raw,
  decode,
}
