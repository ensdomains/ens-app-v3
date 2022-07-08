import { ethers } from 'ethers'
import { ENSArgs } from '..'
import { hexEncodeName } from '../utils/hexEncodedName'

export const universalWrapper = {
  raw: async (
    { contracts }: ENSArgs<'contracts'>,
    name: string,
    data: string,
  ) => {
    const universalResolver = await contracts?.getUniversalResolver()!
    return {
      to: universalResolver.address,
      data: universalResolver.interface.encodeFunctionData('resolve', [
        hexEncodeName(name),
        data,
      ]),
    }
  },
  decode: async ({ contracts }: ENSArgs<'contracts'>, data: string) => {
    const universalResolver = await contracts?.getUniversalResolver()!
    const response = universalResolver.interface.decodeFunctionResult(
      'resolve',
      data,
    )
    if (!response || !response[0]) {
      return
    }
    return { data: response[0], resolver: response[1] }
  },
}

export const resolverMulticallWrapper = {
  raw: async (
    { contracts }: ENSArgs<'contracts'>,
    data: { to: string; data: string }[],
  ) => {
    const publicResolver = await contracts?.getPublicResolver()!
    const formattedDataArr = data.map((item) => (item as any).data)
    return {
      to: publicResolver.address,
      data: publicResolver.interface.encodeFunctionData('multicall', [
        formattedDataArr,
      ]),
    }
  },
  decode: async ({ contracts }: ENSArgs<'contracts'>, data: string) => {
    const publicResolver = await contracts?.getPublicResolver()!
    const response = publicResolver.interface.decodeFunctionResult(
      'multicall',
      data,
    )
    if (!response) {
      return
    }
    return response
  },
}

export const multicallWrapper = {
  raw: async function (
    { contracts }: ENSArgs<'contracts'>,
    transactions: ethers.providers.TransactionRequest[],
    requireSuccess: boolean = false,
  ) {
    const multicall = await contracts?.getMulticall()!
    return {
      to: multicall.address,
      data: multicall.interface.encodeFunctionData('tryAggregate', [
        requireSuccess,
        transactions.map((tx) => ({
          target: tx.to!,
          callData: tx.data!,
        })),
      ]),
    }
  },
  decode: async function ({ contracts }: ENSArgs<'contracts'>, data: string) {
    if (!data) return
    const multicall = await contracts?.getMulticall()!
    try {
      const [result] = multicall.interface.decodeFunctionResult(
        'tryAggregate',
        data,
      )
      return result
    } catch {
      return
    }
  },
}
