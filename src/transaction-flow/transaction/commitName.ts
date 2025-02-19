import type { TFunction } from 'react-i18next'

import { RegistrationParameters } from '@ensdomains/ensjs/utils'
import { commitName, legacyCommitName } from '@ensdomains/ensjs/wallet'

import { Transaction, TransactionDisplayItem, TransactionFunctionParameters } from '@app/types'
import { isLegacyRegistration } from '@app/utils/registration/isLegacyRegistration'
import { makeLegacyRegistrationParams } from '@app/utils/registration/makeLegacyRegistrationParams'

type Data = RegistrationParameters & { name: string }

const displayItems = (
  { name }: Data,
  t: TFunction<'translation', undefined>,
): TransactionDisplayItem[] => [
  {
    label: 'name',
    value: name,
    type: 'name',
  },
  {
    label: 'action',
    value: t('transaction.description.commitName'),
  },
  {
    label: 'info',
    value: t('transaction.info.commitName'),
  },
]

const transaction = async ({ connectorClient, data }: TransactionFunctionParameters<Data>) => {
  if (isLegacyRegistration(data))
    return legacyCommitName.makeFunctionData(connectorClient, makeLegacyRegistrationParams(data))
  return commitName.makeFunctionData(connectorClient, data)
}

export default { displayItems, transaction } satisfies Transaction<Data>
