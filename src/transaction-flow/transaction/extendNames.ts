import type { BigNumber } from '@ethersproject/bignumber/lib/bignumber'
import type { JsonRpcSigner } from '@ethersproject/providers'
import type { TFunction } from 'react-i18next'

import { HelperProps, PublicENS, Transaction, TransactionDisplayItem } from '@app/types'
import { makeDisplay } from '@app/utils/currency'

import { secondsToYears } from '../../utils/utils'

type Data = {
  names: string[]
  duration: number
  rentPrice: BigNumber
  isSelf?: boolean
}

const toSingleDecimal = (duration: number) => parseFloat(secondsToYears(duration).toFixed(1))

const displayItems = (
  { names, rentPrice, duration }: Data,
  t: TFunction<'translation', undefined>,
): TransactionDisplayItem[] => [
  {
    label: 'name',
    value: names.length > 1 ? `${names.length} names` : names[0],
    type: names.length > 1 ? undefined : 'name',
  },
  {
    label: 'action',
    value: t('transaction.extendNames.actionValue', { ns: 'transactionFlow' }),
  },
  {
    label: 'duration',
    value: t('unit.years', { count: toSingleDecimal(duration) }),
  },
  {
    label: 'cost',
    value: t('transaction.extendNames.costValue', {
      ns: 'transactionFlow',
      value: makeDisplay(rentPrice, 5, 'eth'),
    }),
  },
]

const helper = (data: Data, t: TFunction<'translation', undefined>): HelperProps | undefined => {
  if (data.isSelf) return
  return {
    type: 'warning',
    children: t('transaction.extendNames.warning', { ns: 'transactionFlow' }),
  }
}

const transaction = async (signer: JsonRpcSigner, ens: PublicENS, data: Data) => {
  const { names, duration } = data
  const labels = names.map((name) => {
    const parts = name.split('.')
    if (parts.length > 2) throw new Error('Currently only supports 1st level names')
    if (parts[1] !== 'eth') throw new Error('Currently only supports .eth names')
    return parts[0]
  })

  const price = await ens.getPrice(labels, duration, true)
  const priceWithBuffer = price?.base.mul(110).div(100)

  if (!priceWithBuffer) throw new Error('No price found')
  return ens.renewNames.populateTransaction(names, {
    duration,
    value: priceWithBuffer,
    signer,
  })
}
export default { transaction, displayItems, helper } as Transaction<Data>
