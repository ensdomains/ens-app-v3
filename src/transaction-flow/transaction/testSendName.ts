import { PublicENS, TransactionDisplayItem } from '@app/types'
import type { JsonRpcSigner } from '@ethersproject/providers'
import { BigNumber } from 'ethers'

type Data = {}

const displayItems = (): TransactionDisplayItem[] => [
  {
    label: 'to',
    value: '0x3F45BcB2DFBdF0AD173A9DfEe3b932aa2a31CeB3',
    type: 'address',
  },
  {
    label: 'name',
    value: 'taytems.eth',
    type: 'name',
  },
]

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const transaction = async (_signer: JsonRpcSigner, _ens: PublicENS, _data: Data) => ({
  to: '0x0000000000000000000000000000000000000000',
  value: BigNumber.from('0'),
})

export default { displayItems, transaction }
