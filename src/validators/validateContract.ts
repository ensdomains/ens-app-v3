import { isAddress } from '@ethersproject/address'
import { Contract } from '@ethersproject/contracts'

const supportsInterfaceAbi = [
  {
    inputs: [
      {
        internalType: 'bytes4',
        name: 'interfaceID',
        type: 'bytes4',
      },
    ],
    name: 'supportsInterface',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
]

export const CONTRACT_INTERFACES = {
  IAddrResolver: {
    interfaceId: '0x3b3b57de',
    error: 'address interface not supported',
  },
  IAddressResolver: {
    interfaceId: '0xf1cb7e06',
    error: 'address interface not supported',
  },
  INameResolver: {
    interfaceId: '0x691f3431',
    error: 'name interface not supported',
  },
  IABIResolver: {
    interfaceId: '0x2203ab56',
    error: 'abi interface not supported',
  },
  IPubkeyResolver: {
    interfaceId: '0xc8690233',
    error: 'public key interface not supported',
  },
  ITextResolver: {
    interfaceId: '0x59d1d43c',
    error: 'text interface not supported',
  },
  IContentHashResolver: {
    interfaceId: '0xbc1c58d1',
    error: 'contentHash interface not supported',
  },
  IDNSRecordResolver: {
    interfaceId: '0xa8fa5682',
    error: 'idns record interface not supported',
  },
  IDNSZoneResolver: {
    interfaceId: '0x5c47637c',
    error: 'idns zone interface not supported',
  },
  IInterfaceResolver: {
    interfaceId: '0x01ffc9a7',
    error: 'interface interface not supported',
  },
}

export type ContractInterface = keyof typeof CONTRACT_INTERFACES

const validateContract = async (
  interfaces: ContractInterface[],
  address: string,
  provider: any,
) => {
  if (!isAddress(address)) {
    return ['Address is not a valid address']
  }

  const maybeContract = new Contract(address, supportsInterfaceAbi, provider)
  let results
  try {
    results = await Promise.all(
      interfaces.map((interfaceKey: ContractInterface) =>
        maybeContract.supportsInterface(CONTRACT_INTERFACES[interfaceKey].interfaceId),
      ),
    )
    return results
      .map((result, idx) => {
        if (result) return undefined
        const interfaceKey = interfaces[idx]
        return CONTRACT_INTERFACES[interfaceKey].error
      })
      .filter((x) => x)
  } catch (error: any) {
    if (typeof error === 'string') return [error]
    if (error.method === 'supportsInterface(bytes4)') {
      return ['Cannot determine if address supports required interfaces']
    }
    if (error.message) return [error.message]
    return ['An error occurred while validating contract']
  }
}

export default validateContract
