import type { TFunction } from 'i18next'
import { Address } from 'viem'

import { setTextRecord } from '@ensdomains/ensjs/wallet'

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

// TODO: Implement a function that identifies the url for the issuer and only updates that uri

const transaction = async ({ connectorClient, data }: TransactionFunctionParameters<Data>) => {
  const { name, resolverAddress, verifiedPresentationUri } = data

  return setTextRecord.makeFunctionData(connectorClient, {
    name,
    key: VERIFICATION_RECORD_KEY,
    value: JSON.stringify([verifiedPresentationUri]),
    resolverAddress,
  })
}
export default {
  displayItems,
  transaction,
} satisfies Transaction<Data>
