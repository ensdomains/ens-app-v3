import { ENSArgs, GenericGeneratedRawFunction } from '..'

type BatchItem = [GenericGeneratedRawFunction, ...any[]]

const raw = async (
  { multicallWrapper }: ENSArgs<'multicallWrapper'>,
  ...items: BatchItem[]
) => {
  const rawDataArr: { to: string; data: string }[] = await Promise.all(
    items.map(([func, ...args]) => {
      if (!func.raw) {
        throw new Error(`${func.name} is not batchable`)
      }
      return func.raw(...args)
    }),
  )
  return multicallWrapper.raw(rawDataArr)
}

const decode = async (
  { multicallWrapper }: ENSArgs<'multicallWrapper'>,
  data: string,
  ...items: BatchItem[]
) => {
  const response = await multicallWrapper.decode(data)
  if (!response) return null

  return Promise.all(
    response.map((ret: any, i: number) =>
      items[i][0].decode(ret.returnData, ...items[i].slice(1)),
    ),
  )
}

export default {
  raw,
  decode,
}
