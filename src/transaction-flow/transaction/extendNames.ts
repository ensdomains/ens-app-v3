import type { TFunction } from 'react-i18next'

import { getPrice } from '@ensdomains/ensjs/public'
import { renewNames } from '@ensdomains/ensjs/wallet'

import { Transaction, TransactionDisplayItem, TransactionFunctionParameters } from '@app/types'

import { calculateValueWithBuffer, formatDuration } from '../../utils/utils'

type Data = {
  names: string[]
  duration: number
  displayPrice?: string
}

const displayItems = (
  { names, duration, displayPrice }: Data,
  t: TFunction<'translation', undefined>,
): TransactionDisplayItem[] => {
  return [
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
      type: 'duration',
      label: 'duration',
      value: formatDuration(duration, t),
    },
    {
      label: 'cost',
      value: t('transaction.extendNames.costValue', {
        ns: 'transactionFlow',
        value: displayPrice,
      }),
    },
  ]
}

const transaction = async ({
  client,
  connectorClient,
  data,
}: TransactionFunctionParameters<Data>) => {
  const { names, duration } = data
  const price = await getPrice(client, {
    nameOrNames: names,
    duration,
  })
  if (!price) throw new Error('No price found')

  const priceWithBuffer = calculateValueWithBuffer(price.base)
  return renewNames.makeFunctionData(connectorClient, {
    nameOrNames: names,
    duration,
    value: priceWithBuffer,
  })
}
export default { transaction, displayItems } satisfies Transaction<Data>
