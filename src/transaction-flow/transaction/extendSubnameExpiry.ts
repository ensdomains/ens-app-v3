import type { TFunction } from 'react-i18next'
import { encodeFunctionData, labelhash, namehash } from 'viem'

import { getChainContractAddress } from '@ensdomains/ensjs/contracts'

import type { Transaction, TransactionDisplayItem, TransactionFunctionParameters } from '@app/types'
import { parentName } from '@app/utils/name'
import { formatDurationOfDates, formatExpiry } from '@app/utils/utils'

const nameWrapperExtendExpirySnippet = [
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'parentNode',
        type: 'bytes32',
      },
      {
        internalType: 'bytes32',
        name: 'labelhash',
        type: 'bytes32',
      },
      {
        internalType: 'uint64',
        name: 'expiry',
        type: 'uint64',
      },
    ],
    name: 'extendExpiry',
    outputs: [
      {
        internalType: 'uint64',
        name: '',
        type: 'uint64',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const

type Data = {
  name: string
  duration: number
  expiryTimestamp: number
  startDateTimestamp?: number
}

const displayItems = (
  { name, duration, startDateTimestamp, expiryTimestamp }: Data,
  t: TFunction<'translation', undefined>,
): TransactionDisplayItem[] => {
  return [
    {
      label: 'name',
      value: name,
      type: 'subname',
    },
    {
      label: 'action',
      value: t('transaction.extendNames.actionValue', { ns: 'transactionFlow' }),
    },
    {
      type: 'duration',
      label: 'duration',
      value: {
        duration: formatDurationOfDates({
          startDate: startDateTimestamp ? new Date(startDateTimestamp) : undefined,
          endDate: new Date(expiryTimestamp * 1000),
          t,
        }),
        newExpiry: formatExpiry(new Date(expiryTimestamp * 1000)),
      },
    },
  ]
}

const transaction = ({ client, data }: TransactionFunctionParameters<Data>) => {
  const [label] = data.name.split('.')
  const parent = parentName(data.name)

  return {
    to: getChainContractAddress({
      client,
      contract: 'ensNameWrapper',
    }),
    data: encodeFunctionData({
      abi: nameWrapperExtendExpirySnippet,
      functionName: 'extendExpiry',
      args: [namehash(parent), labelhash(label), BigInt(data.expiryTimestamp)],
    }),
  }
}

export default { displayItems, transaction } satisfies Transaction<Data>
