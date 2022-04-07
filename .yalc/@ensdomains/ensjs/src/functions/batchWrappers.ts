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
      return null
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
      data: publicResolver.interface.encodeFunctionData('multicall(bytes[])', [
        formattedDataArr,
      ]),
    }
  },
  decode: async ({ contracts }: ENSArgs<'contracts'>, data: string) => {
    const publicResolver = await contracts?.getPublicResolver()!
    const response = publicResolver.interface.decodeFunctionResult(
      'multicall(bytes[])',
      data,
    )
    if (!response) {
      return null
    }
    return response
  },
}
