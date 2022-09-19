import type { JsonRpcSigner } from '@ethersproject/providers'
import { BigNumber } from 'ethers'
import { TFunction } from 'react-i18next'

import { HelperProps, PublicENS, Transaction, TransactionDisplayItem } from '@app/types'
import { yearsToSeconds } from '@app/utils/utils'

type Data = {
  names: string[]
  years: number
  rentPrice: BigNumber
}

const displayItems = (
  { names, rentPrice }: Data,
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
    value: t('unit.years', { count: names.length }),
  },
  {
    label: 'cost',
    value: t('transaction.extendNames.costValue', {
      ns: 'transactionFlow',
      value: rentPrice.toString(),
    }),
  },
]

const helper = (data: Data, t: TFunction<'translation', undefined>): HelperProps => {
  return {
    type: 'warning',
    children: t('transaction.extendNames.warning', { ns: 'transactionFlow' }),
  }
}

const transaction = async (signer: JsonRpcSigner, ens: PublicENS, data: Data) => {
  const { names, years } = data
  const duration = yearsToSeconds(years)
  const labels = names.map((name) => name.replace('.eth', ''))

  console.log(labels)

  const br = await ens.contracts?.getBulkRenewal()
  console.log('br', br)

  const p = await br!.rentPrice(names, duration)
  console.log('p', p)

  // br!.connect(signer).renewAll(labels, duration, { value: p?.base })

  const price = await ens.getPrice(labels, duration, true)
  console.log('price', price, years, duration)
  const value = price?.base
  console.log('base', value?.toNumber())

  if (!value) throw new Error('No price found')
  return ens.renewNames.populateTransaction(names, {
    duration,
    value,
    signer,
  })
}

export default { transaction, displayItems, helper } as Transaction<Data>
