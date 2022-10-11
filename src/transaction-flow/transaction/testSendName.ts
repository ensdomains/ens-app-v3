import type { JsonRpcSigner } from '@ethersproject/providers'
import { BigNumber } from 'ethers'
import type { TFunction } from 'react-i18next'

import { PublicENS, Transaction, TransactionDisplayItem } from '@app/types'

type Data = {}

const displayItems = (
  // eslint-disable-next-line no-empty-pattern
  {}: any,
  t: TFunction<'translation', undefined>,
): TransactionDisplayItem[] => [
  {
    label: 'action',
    value: t(`transaction.description.testSendName`),
  },
  {
    label: 'info',
    value: t(`transaction.info.testSendName`),
  },
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
  data: BigNumber.from('0').toHexString(),
})

export default { displayItems, transaction } as Transaction<Data>
