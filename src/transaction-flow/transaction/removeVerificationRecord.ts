import type { TFunction } from 'i18next'
import { Address } from 'viem'

import { setRecords } from '@ensdomains/ensjs/wallet'

import { VERIFICATION_RECORD_KEY } from '@app/constants/verification'
import { Transaction, TransactionDisplayItem, TransactionFunctionParameters } from '@app/types'
import { labelForVerificationProtocol } from '@app/utils/verification/labelForVerificationProtocol'

import type { VerificationProtocol } from '../input/VerifyProfile/VerifyProfile-flow'

type Data = {
  name: string
  resolverAddress: Address
  verifier: VerificationProtocol
}

const displayItems = ({ name, verifier }: Data, t: TFunction): TransactionDisplayItem[] => {
  return [
    {
      label: 'name',
      value: name,
      type: 'name',
    },
    {
      label: 'action',
      value: t('transaction.description.removeRecord'),
    },
    {
      label: 'record',
      value: labelForVerificationProtocol(verifier),
    },
  ]
}

const transaction = async ({ connectorClient, data }: TransactionFunctionParameters<Data>) => {
  const { name, resolverAddress } = data

  return setRecords.makeFunctionData(connectorClient, {
    name,
    resolverAddress,
    texts: [{ key: VERIFICATION_RECORD_KEY, value: '' }],
    clearRecords: false,
  })
}
export default {
  displayItems,
  transaction,
  backToInput: true,
} satisfies Transaction<Data>
