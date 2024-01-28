import { getChainContractAddress as _getChainContractAddress } from 'viem/utils'
import type { ChainWithEns } from './consts.js'

type ChainClient<TChain extends ChainWithEns> = {
  chain: TChain
}

export const getChainContractAddress = <
  TChain extends ChainWithEns,
  TClient extends ChainClient<TChain>,
>({
  blockNumber,
  client,
  contract,
}: {
  blockNumber?: bigint
  client: TClient
  contract: Extract<keyof TChain['contracts'], string>
}) => _getChainContractAddress({ blockNumber, chain: client.chain, contract })
