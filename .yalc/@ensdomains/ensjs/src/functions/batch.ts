import { TransactionRequest } from '@ethersproject/abstract-provider'
import { BatchFunctionResult, ENSArgs, RawFunction } from '..'
import { ENSJSError, ENSJSErrorName } from '../utils/errors'

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
    error?: string
    timestamp?: number
    data: any[]
  }>(
    (acc, result) => {
      if (result.status === 'fulfilled') {
        return { ...acc, data: [...acc.data, result.value] }
      }
      const error = result.reason as ENSJSError<any>
      if (error instanceof ENSJSError) {
        return {
          error: error.name,
          timestamp: error.timestamp,
          data: [...acc.data, error.data],
        }
      }
      return {
        error: acc.error || 'ENSJSUnknownError',
        data: [...acc.data, undefined],
      }
    },
    { data: [] },
  )
  if (reducedResults.error)
    throw new ENSJSError({
      name: reducedResults.error as ENSJSErrorName,
      timestamp: reducedResults.timestamp,
      data: reducedResults.data,
    })
  return reducedResults.data
}

export default {
  raw,
  decode,
}
