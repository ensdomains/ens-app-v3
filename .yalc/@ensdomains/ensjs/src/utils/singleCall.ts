import type { Provider } from '@ethersproject/providers'

export default async (
  provider: Provider,
  ensData: any,
  func: {
    raw: (
      ...args: any[]
    ) => Promise<{ to: string; data: string; passthrough?: any }>
    decode: (...args: any[]) => Promise<any>
  },
  ...data: any[]
) => {
  const { passthrough, ...rawData } = await func.raw(ensData, ...data)
  const result = await provider
    .call({ ...rawData, ccipReadEnabled: true })
    .catch(() => null)
  if (!result) return
  if (passthrough) return func.decode(ensData, result, passthrough, ...data)
  return func.decode(ensData, result, ...data)
}
