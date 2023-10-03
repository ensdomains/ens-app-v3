import type { TFunction } from 'react-i18next'

import { getPrice } from '@ensdomains/ensjs/public'
import { RegistrationParameters } from '@ensdomains/ensjs/utils'
import { registerName } from '@ensdomains/ensjs/wallet'

import { Transaction, TransactionDisplayItem, TransactionFunctionParameters } from '@app/types'
import { calculateValueWithBuffer, secondsToYears } from '@app/utils/utils'

type Data = RegistrationParameters

const displayItems = (
  { name, duration }: Data,
  t: TFunction<'translation', undefined>,
): TransactionDisplayItem[] => [
  {
    label: 'name',
    value: name,
    type: 'name',
  },
  {
    label: 'action',
    value: t('transaction.description.registerName'),
  },
  {
    label: 'duration',
    value: t(secondsToYears(duration) > 1 ? 'unit.years_other' : 'unit.years_one', {
      count: secondsToYears(duration),
    }),
  },
]

const transaction = async ({
  publicClient,
  walletClient,
  data,
}: TransactionFunctionParameters<Data>) => {
  const price = await getPrice(publicClient, { nameOrNames: data.name, duration: data.duration })
  const value = price.base + price.premium
  const valueWithBuffer = calculateValueWithBuffer(value)

  return registerName.makeFunctionData(walletClient, {
    ...data,
    value: valueWithBuffer,
  })
}

export default { displayItems, transaction } satisfies Transaction<Data>
