import { ethers } from 'ethers'

export default async (
  provider: ethers.providers.Provider,
  ensData: any,
  func: {
    raw: (...args: any[]) => Promise<{ to: string; data: string }>
    decode: (...args: any[]) => Promise<any>
  },
  ...data: any[]
) =>
  func
    .raw(ensData, ...data)
    .then((rawData) => provider.call(rawData))
    .catch(() => null)
    .then((ret) => func.decode(ensData, ret, ...data))
