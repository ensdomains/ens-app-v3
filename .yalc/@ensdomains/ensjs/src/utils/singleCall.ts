import type { Provider } from '@ethersproject/providers'

export default async (
  provider: Provider,
  ensData: any,
  func: {
    raw: (...args: any[]) => Promise<{ to: string; data: string }>
    decode: (...args: any[]) => Promise<any>
  },
  ...data: any[]
) =>
  func
    .raw(ensData, ...data)
    .then((rawData) => provider.call({ ...rawData, ccipReadEnabled: true }))
    .catch(() => null)
    .then((ret) => func.decode(ensData, ret, ...data))
