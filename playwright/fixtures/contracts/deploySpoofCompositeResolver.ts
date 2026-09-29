/* eslint-disable import/no-extraneous-dependencies */
import { type Address, type Hex, encodeDeployData } from 'viem'

import { Accounts } from '../accounts'
import { waitForTransaction, walletClient } from './utils/addTestContracts'

const spoofCompositeResolverAbi = [
  {
    type: 'constructor',
    inputs: [{ name: 'officialResolver_', type: 'address' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'getResolver',
    inputs: [{ name: '', type: 'bytes' }],
    outputs: [
      { name: 'resolver_', type: 'address' },
      { name: 'offchain', type: 'bool' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'supportsInterface',
    inputs: [{ name: 'interfaceId', type: 'bytes4' }],
    outputs: [{ type: 'bool' }],
    stateMutability: 'pure',
  },
] as const

// Compiled from SpoofCompositeResolver.sol (solc 0.8.13, optimizer 200).
const spoofCompositeResolverBytecode =
  '0x60a060405234801561001057600080fd5b506040516102a33803806102a383398101604081905261002f91610040565b6001600160a01b0316608052610070565b60006020828403121561005257600080fd5b81516001600160a01b038116811461006957600080fd5b9392505050565b608051610213610090600039600081816073015260be01526102136000f3fe608060405234801561001057600080fd5b50600436106100415760003560e01c806301ffc9a714610046578063355ff0891461006e578063eea330f9146100ad575b600080fd5b61005961005436600461013a565b610103565b60405190151581526020015b60405180910390f35b6100957f000000000000000000000000000000000000000000000000000000000000000081565b6040516001600160a01b039091168152602001610065565b6100e46100bb36600461016b565b507f00000000000000000000000000000000000000000000000000000000000000009160009150565b604080516001600160a01b039093168352901515602083015201610065565b60006001600160e01b0319821663eea330f960e01b148061013457506001600160e01b031982166301ffc9a760e01b145b92915050565b60006020828403121561014c57600080fd5b81356001600160e01b03198116811461016457600080fd5b9392505050565b6000806020838503121561017e57600080fd5b823567ffffffffffffffff8082111561019657600080fd5b818501915085601f8301126101aa57600080fd5b8135818111156101b957600080fd5b8660208285010111156101cb57600080fd5b6020929092019691955090935050505056fea264697066735822122055006de3fa934a473b15db18ee69db7c0b3d2c6e7ec12d522f7126818027f07c64736f6c634300080d0033' as Hex

export const deploySpoofCompositeResolver = async ({
  accounts,
  officialResolver,
}: {
  accounts: Accounts
  officialResolver: Address
}): Promise<Address> => {
  const data = encodeDeployData({
    abi: spoofCompositeResolverAbi,
    bytecode: spoofCompositeResolverBytecode,
    args: [officialResolver],
  })
  const prepared = await walletClient.prepareTransactionRequest({
    data,
    account: accounts.getAccountForUser('user'),
    gas: 1_000_000n,
  })
  const hash = await walletClient.sendTransaction(prepared)
  const receipt = await waitForTransaction(hash)
  if (!receipt.contractAddress) {
    throw new Error('SpoofCompositeResolver deploy did not return a contract address')
  }
  return receipt.contractAddress
}
