import { ethers } from 'ethers'
import { ENSArgs, GenericGeneratedRawFunction } from '..'

export async function _batch(
  { contracts }: ENSArgs<'contracts'>,
  transactions: ethers.providers.TransactionRequest[],
  requireSuccess: boolean = false,
) {
  const multicall = await contracts?.getMulticall()!
  return multicall.callStatic.tryAggregate(
    requireSuccess,
    transactions.map((tx) => ({
      target: tx.to,
      callData: tx.data,
    })),
  )
}

type BatchItem = [GenericGeneratedRawFunction, ...any[]]

export async function batch(
  { contracts }: ENSArgs<'contracts'>,
  ...items: BatchItem[]
) {
  const rawDataArr: { to: string; data: string }[] = await Promise.all(
    items.map(([func, ...args]) => {
      if (!func.raw) {
        throw new Error(`${func.name} is not batchable`)
      }
      return func.raw(...args)
    }),
  )
  const response = await _batch({ contracts }, rawDataArr)
  return Promise.all(
    response.map((ret: any, i: number) =>
      items[i][0].decode(ret.returnData, ...items[i].slice(1)),
    ),
  )
}
