import type { TransactionRequest } from '@ethersproject/providers'
import { ENSArgs } from '..'
import ccipLookup from '../utils/ccip'
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
      data: universalResolver.interface.encodeFunctionData(
        'resolve(bytes,bytes)',
        [hexEncodeName(name), data],
      ),
    }
  },
  decode: async ({ contracts }: ENSArgs<'contracts'>, data: string) => {
    const universalResolver = await contracts?.getUniversalResolver()!
    const response = universalResolver.interface.decodeFunctionResult(
      'resolve(bytes,bytes)',
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
  async raw(
    { contracts }: ENSArgs<'contracts'>,
    transactions: TransactionRequest[],
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
  async decode(
    { contracts, provider }: ENSArgs<'contracts' | 'provider'>,
    data: string,
    transactions: TransactionRequest[],
  ) {
    if (!data) return
    const multicall = await contracts?.getMulticall()!
    try {
      const [result] = multicall.interface.decodeFunctionResult(
        'tryAggregate',
        data,
      )
      const ccipChecked = await Promise.all(
        (result as [boolean, string][]).map(
          async ([success, returnData], i) => {
            let newArr: [boolean, string] = [success, returnData]
            // OffchainLookup(address,string[],bytes,bytes4,bytes)
            if (!success && returnData.startsWith('0x556f1830')) {
              try {
                const newData = await ccipLookup(
                  provider!,
                  transactions[i],
                  returnData,
                )
                if (newData) {
                  newArr = [true, newData]
                }
              } catch {}
            }
            return {
              ...newArr,
              success: newArr[0],
              returnData: newArr[1],
            }
          },
        ),
      )
      return ccipChecked
    } catch (e: any) {
      console.error(e)
      return
    }
  },
}
