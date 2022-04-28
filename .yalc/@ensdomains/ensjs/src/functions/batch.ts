import { BatchFunctionResult, ENSArgs, RawFunction } from '..'

const raw = async (
  { multicallWrapper }: ENSArgs<'multicallWrapper'>,
  ...items: BatchFunctionResult<RawFunction>[]
) => {
  const rawDataArr: { to: string; data: string }[] = await Promise.all(
    items.map(({ args, raw }, i: number) => {
      if (!raw) {
        throw new Error(`Function ${i} is not batchable`)
      }
      return raw(...args)
    }),
  )
  return multicallWrapper.raw(rawDataArr)
}

const decode = async (
  { multicallWrapper }: ENSArgs<'multicallWrapper'>,
  data: string,
  ...items: BatchFunctionResult<RawFunction>[]
): Promise<any[] | null> => {
  const response = await multicallWrapper.decode(data)
  if (!response) return null

  return Promise.all(
    response.map((ret: any, i: number) =>
      items[i].decode(ret.returnData, ...items[i].args),
    ),
  )
}

export default {
  raw,
  decode,
}
