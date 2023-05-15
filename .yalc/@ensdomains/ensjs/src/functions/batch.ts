import { TransactionRequest } from '@ethersproject/abstract-provider'
import { BatchFunctionResult, ENSArgs, RawFunction } from '..'
import { ENSJSError } from '../utils/errors'

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

  const results = await Promise.allSettled(
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

  const reducedResults = results.reduce<{
    errors: any[]
    data: any[]
  }>(
    (acc, result) => {
      if (result.status === 'fulfilled') {
        return { ...acc, data: [...acc.data, result.value] }
      }
      const error =
        result.reason instanceof ENSJSError
          ? (result.reason as ENSJSError<any>)
          : undefined
      const itemData = error?.data
      const itemErrors = error?.errors || [{ message: 'unknown_error' }]
      return {
        errors: [...acc.errors, ...itemErrors],
        data: [...acc.data, itemData],
      }
    },
    { data: [], errors: [] },
  )

  if (reducedResults.errors.length)
    throw new ENSJSError({
      data: reducedResults.data,
      errors: reducedResults.errors,
    })
  return reducedResults.data
}

export default {
  raw,
  decode,
}
