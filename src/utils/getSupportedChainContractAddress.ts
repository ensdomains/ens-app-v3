import { Client, getChainContractAddress, Transport } from 'viem'

import { SupportedChain } from '@app/constants/chains'

export const getSupportedChainContractAddress = <
  const TClient extends Client<Transport, SupportedChain>,
  TContract extends Extract<keyof TClient['chain']['contracts'], string>,
>({
  client,
  contract,
}: {
  client: TClient
  contract: TContract
}) =>
  getChainContractAddress({
    chain: client.chain,
    contract,
  })
