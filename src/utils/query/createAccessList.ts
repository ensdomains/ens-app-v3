import { Address, BlockTag, Hex, TransactionRequest, type Client } from 'viem'

type AccessListResponse = {
  accessList: {
    address: Address
    storageKeys: Hex[]
  }[]
  gasUsed: Hex
}

export const createAccessList = async (
  client: Client,
  tx: TransactionRequest<Hex> & {
    blockTag?: BlockTag
  },
): Promise<AccessListResponse> => {
  const blockTag = tx.blockTag ?? 'pending'
  const accessListResponse = await client.request<{
    Method: 'eth_createAccessList'
    Parameters: [tx: TransactionRequest<Hex>, blockTag: BlockTag]
    ReturnType: AccessListResponse
  }>({
    method: 'eth_createAccessList',
    params: [
      {
        to: tx.to,
        data: tx.data,
        from: tx.from,
        value: tx.value,
      },
      blockTag,
    ],
  })

  return accessListResponse
}
