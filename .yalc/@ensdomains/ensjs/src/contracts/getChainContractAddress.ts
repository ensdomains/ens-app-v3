import type { Address, Chain } from 'viem'
import { getChainContractAddress as _getChainContractAddress } from 'viem/utils'

type ExtractContract<TClient> = TClient extends {
  chain: { contracts: infer C }
}
  ? C extends Record<string, { address: string }>
    ? C
    : never
  : never

export const getChainContractAddress = <
  const TClient extends { chain: Chain },
  TContracts extends ExtractContract<TClient> = ExtractContract<TClient>,
  TContractName extends keyof TContracts = keyof TContracts,
  TContract extends TContracts[TContractName] = TContracts[TContractName],
>({
  blockNumber,
  client,
  contract,
}: {
  blockNumber?: bigint
  client: TClient
  contract: TContractName
}) =>
  _getChainContractAddress({
    blockNumber,
    chain: client.chain,
    contract: contract as string,
  }) as TContract extends { address: infer A }
    ? A extends Address
      ? A
      : never
    : Address
