import type { TFunction } from 'react-i18next'

import { getPrice } from '@ensdomains/ensjs/public'
import { RegistrationParameters } from '@ensdomains/ensjs/utils'
import { legacyRegisterName, registerName } from '@ensdomains/ensjs/wallet'

import { Transaction, TransactionDisplayItem, TransactionFunctionParameters } from '@app/types'
import { isLegacyRegistration } from '@app/utils/registration/isLegacyRegistration'
import { calculateValueWithBuffer, formatDurationOfDates } from '@app/utils/utils'

import { makeLegacyRegistrationParams } from '../../utils/registration/makeLegacyRegistrationParams'

type Data = RegistrationParameters
const now = Math.floor(Date.now())
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
    value: formatDurationOfDates({
      startDate: new Date(),
      endDate: new Date(now + duration * 1000),
      t,
    }),
  },
]

const transaction = async ({
  client,
  connectorClient,
  data,
}: TransactionFunctionParameters<Data>) => {
  const price = await getPrice(client, { nameOrNames: data.name, duration: data.duration })
  const value = price.base + price.premium
  const valueWithBuffer = calculateValueWithBuffer(value)

  if (isLegacyRegistration(data))
    return legacyRegisterName.makeFunctionData(connectorClient, {
      ...makeLegacyRegistrationParams(data),
      value: valueWithBuffer,
    })
  return registerName.makeFunctionData(connectorClient, {
    ...data,
    value: valueWithBuffer,
  })
}

export default { displayItems, transaction } satisfies Transaction<Data>
