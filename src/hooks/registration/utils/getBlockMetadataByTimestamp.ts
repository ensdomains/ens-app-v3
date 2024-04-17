import { Hash } from 'viem'

import { ClientWithEns } from '@app/types'

type GetBlockMetadataByTimestampParameters = {
  timestamp: bigint
}

type FoundBlockReturnType = {
  hash: Hash
  number: number
  timestamp: number
  parentHash: Hash
}

type BlockErrorReturnType = {
  error: string
}

type GetBlockMetadataByTimestampReturnType =
  | {
      ok: true
      data: FoundBlockReturnType
    }
  | {
      ok: false
      data: BlockErrorReturnType
    }

export const getBlockMetadataByTimestamp = async (
  client: ClientWithEns,
  { timestamp }: GetBlockMetadataByTimestampParameters,
): Promise<GetBlockMetadataByTimestampReturnType> => {
  const data = await fetch(
    `https://api.findblock.xyz/v1/chain/${client.chain.id}/block/after/${timestamp}?inclusive=true`,
  ).then((res) => res.json())
  if ('error' in data)
    return {
      ok: false,
      data,
    }

  return {
    ok: true,
    data,
  }
}
