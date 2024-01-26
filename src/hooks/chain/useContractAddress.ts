import { Address, Client, Transport } from 'viem'

import { SupportedChain } from '@app/constants/chains'
import { getSupportedChainContractAddress } from '@app/utils/getSupportedChainContractAddress'

import { usePublicClient } from '../usePublicClient'

export const useContractAddress = <
  TContracts extends Client<Transport, SupportedChain>['chain']['contracts'],
  TContractName extends Extract<keyof TContracts, string>,
  TContract extends TContracts[TContractName] = TContracts[TContractName],
>({
  contract,
  blockNumber,
}: {
  contract: TContractName
  blockNumber?: bigint
}) => {
  const publicClient = usePublicClient()

  return getSupportedChainContractAddress<typeof publicClient, TContractName>({
    client: publicClient,
    contract,
    blockNumber,
  }) as TContract extends { address: infer A } ? (A extends Address ? A : never) : Address
}
