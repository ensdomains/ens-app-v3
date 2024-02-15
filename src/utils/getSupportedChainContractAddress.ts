import { Client, getChainContractAddress, Transport } from 'viem'

import { SupportedChain } from '@app/constants/chains'

export const getSupportedChainContractAddress = <
  const TClient extends Client<Transport, SupportedChain>,
  TContract extends string = Extract<keyof TClient['chain']['contracts'], string>,
>({
  client,
  contract,
  blockNumber,
}: {
  client: TClient
  contract: TContract
  blockNumber?: bigint
}) =>
  getChainContractAddress({
    chain: client.chain,
    contract,
    blockNumber,
  })
