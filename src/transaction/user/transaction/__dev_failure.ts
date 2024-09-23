import { Transaction, TransactionDisplayItem, type TransactionFunctionParameters } from '@app/types'

type Data = {}

// eslint-disable-next-line no-empty-pattern
const displayItems = ({}: Data): TransactionDisplayItem[] => [
  {
    label: 'action',
    value: '__dev_failure',
  },
  {
    label: 'info',
    value: 'DO NOT USE',
  },
]

// eslint-disable-next-line no-empty-pattern
const transaction = async ({}: TransactionFunctionParameters<Data>) => {
  return {
    to: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
    data: '0x1231237123423423',
  } as const
}

export default { displayItems, transaction } satisfies Transaction<Data>
