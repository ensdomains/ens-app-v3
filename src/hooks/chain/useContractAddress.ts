import { useClient } from 'wagmi'

import { ClientWithEns } from '@app/types'
import { getSupportedChainContractAddress } from '@app/utils/getSupportedChainContractAddress'

export const useContractAddress = <
  TContractName extends Extract<keyof ClientWithEns['chain']['contracts'], string>,
>({
  contract,
  blockNumber,
}: {
  contract: TContractName
  blockNumber?: bigint
}) => {
  const client = useClient()

  return getSupportedChainContractAddress({
    client,
    contract,
    blockNumber,
  })
}
