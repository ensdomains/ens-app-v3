import type { TFunction } from 'react-i18next'

import type { Transaction, TransactionDisplayItem, TransactionFunctionParameters } from '@app/types'

type Data = {}

const displayItems = (
  _: Data,
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
const transaction = async (_: TransactionFunctionParameters<Data>) =>
  ({
    to: '0x0000000000000000000000000000000000000000',
    data: '0x',
  }) as const

export default { displayItems, transaction } satisfies Transaction<Data>
