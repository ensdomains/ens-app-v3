type ErrorName = 'ENSJSSubgraphIndexingError' | 'ENSJSUnknownError'

export class ENSJSError<T> extends Error {
  name: ErrorName

  data: T | undefined

  timestamp: number | undefined

  constructor({
    name,
    data,
    timestamp,
  }: {
    name: ErrorName
    data?: T
    timestamp?: number
  }) {
    super()
    this.name = name
    this.data = data
    this.timestamp = timestamp
  }
}

type Meta = {
  hasIndexingErrors: boolean
  block: {
    number: number
  }
}

export const returnOrThrow = async <T>(
  data: T,
  meta?: Meta,
  provider?: any,
) => {
  if (meta?.hasIndexingErrors && provider) {
    const blockNumber = meta.block?.number
    const block = await provider?.getBlock(blockNumber)
    const timestamp = block?.timestamp
    throw new ENSJSError({
      name: 'ENSJSSubgraphIndexingError',
      timestamp,
      data,
    })
  }
  return data
}
