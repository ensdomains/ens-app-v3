import type { TFunction } from 'react-i18next'

import { HelperProps, Transaction, TransactionDisplayItem, TransactionFunctionParameters } from '@app/types'
import { makeDisplay } from '@app/utils/currency'

import { getPrice } from '@ensdomains/ensjs/public'
import { renewNames } from '@ensdomains/ensjs/wallet'
import { calculateValueWithBuffer, secondsToYears } from '../../utils/utils'

type Data = {
  names: string[]
  duration: number
  rentPrice: bigint
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
      value: makeDisplay({
        value: calculateValueWithBuffer(rentPrice),
        symbol: 'ETH',
      }),
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

const transaction = async ({ publicClient, walletClient, data }: TransactionFunctionParameters<Data>) => {
  const { names, duration } = data
  const price = await getPrice(publicClient, {
    nameOrNames: names,
    duration,
  })
  if (!price) throw new Error('No price found')

  const priceWithBuffer = calculateValueWithBuffer(price.base)
  return renewNames.makeFunctionData(walletClient, {
    nameOrNames: names,
    duration,
    value: priceWithBuffer,
  })
}
export default { transaction, displayItems, helper } satisfies Transaction<Data>
