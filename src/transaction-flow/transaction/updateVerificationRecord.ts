import type { TFunction } from 'i18next'
import { Address } from 'viem'

import { getRecords, getTextRecord } from '@ensdomains/ensjs/public'
import { setRecords } from '@ensdomains/ensjs/wallet'

import { VERIFICATION_RECORD_KEY } from '@app/constants/verification'
import { Transaction, TransactionDisplayItem, TransactionFunctionParameters } from '@app/types'
import { labelForVerificationProtocol } from '@app/utils/verification/labelForVerificationProtocol'

import type { VerificationProtocol } from '../input/VerifyProfile/VerifyProfile-flow'

type Data = {
  name: string
  resolverAddress: Address
  verifier: VerificationProtocol
  verifiedPresentationUri: string
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
      value: t('transaction.description.updateRecord'),
    },
    {
      label: 'record',
      value: labelForVerificationProtocol(verifier),
    },
  ]
}

const transaction = async ({ connectorClient, data }: TransactionFunctionParameters<Data>) => {
  const { name, resolverAddress, verifiedPresentationUri } = data

  // TODO: fix this
  const currentRecords = await getTextRecord(connectorClient, {
    name,
    key: VERIFICATION_RECORD_KEY,
  })

  const records = await getRecords(connectorClient, {
    name,
    texts: [VERIFICATION_RECORD_KEY],
    resolver: { address: resolverAddress, fallbackOnly: false },
  })

  console.log('currentRecord', currentRecords, records)
  // TODO: Support multiple verifiers
  return setRecords.makeFunctionData(connectorClient, {
    name,
    resolverAddress,
    texts: [{ key: VERIFICATION_RECORD_KEY, value: JSON.stringify([verifiedPresentationUri]) }],
    clearRecords: false,
  })
}
export default {
  displayItems,
  transaction,
} satisfies Transaction<Data>
