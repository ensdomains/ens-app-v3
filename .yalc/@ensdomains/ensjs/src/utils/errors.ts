export type ENSJSErrorName =
  | 'ENSJSSubgraphIndexingError'
  | 'ENSJSUnknownError'
  | 'ENSJSNetworkLatencyError'

export class ENSJSError<T> extends Error {
  name: ENSJSErrorName

  data: T | undefined

  timestamp: number | undefined

  constructor({
    name,
    data,
    timestamp,
  }: {
    name: ENSJSErrorName
    data?: T
    timestamp?: number
  }) {
    super()
    this.name = name
    this.data = data
    this.timestamp = timestamp
  }
}

export type GraphMeta = {
  hasIndexingErrors: boolean
  block: {
    number: number
  }
}

const debugFlow = async <T>(data: T, meta?: GraphMeta, provider?: any) => {
  // If meta is undefined, then subgraph was not called and we dont need to simulate an error
  if (!meta) return

  const testName = (localStorage.getItem('ensjs-debug') || '') as ENSJSErrorName
  if (testName === 'ENSJSSubgraphIndexingError') {
    const blockNumber = meta?.block?.number
    const block = blockNumber
      ? await provider?.getBlock(blockNumber - 1)
      : undefined
    const timestamp = block?.timestamp
    throw new ENSJSError<T>({
      name: 'ENSJSSubgraphIndexingError',
      data,
      timestamp,
    })
  }

  if (testName === 'ENSJSUnknownError') {
    throw new ENSJSError<T>({
      name: 'ENSJSUnknownError',
    })
  }

  if (testName === 'ENSJSNetworkLatencyError') {
    await new Promise((resolve) => {
      setTimeout(() => resolve(true), 10000)
    })
  }
}

export const returnOrThrow = async <T>(
  data: T,
  meta?: GraphMeta,
  provider?: any,
) => {
  if (process.env.NODE_ENV === 'development') {
    await debugFlow<T>(data, meta, provider)
  }
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
