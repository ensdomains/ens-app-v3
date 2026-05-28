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
  try {
    return await client.request<{
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
  } catch (e: any) {
    const msg = String(e?.message || '') + String(e?.details || '') + String(e?.shortMessage || '')
    if (e?.code === -32004 || /not supported|not implemented|trailing characters/i.test(msg)) {
      return { accessList: [], gasUsed: '0x0' }
    }
    throw e
  }
}
