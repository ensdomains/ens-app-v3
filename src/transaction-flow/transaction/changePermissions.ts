/* eslint-disable @typescript-eslint/no-redeclare */
import type { TFunction } from 'react-i18next'
import { match } from 'ts-pattern'

import { ChildFuseReferenceType, ParentFuseReferenceType } from '@ensdomains/ensjs/utils'
import { setChildFuses, setFuses } from '@ensdomains/ensjs/wallet'

import { Transaction, TransactionDisplayItem, TransactionFunctionParameters } from '@app/types'

type WithSetChildFuses = {
  contract: 'setChildFuses'
  fuses: {
    parent: ParentFuseReferenceType['Key'][]
    child: ChildFuseReferenceType['Key'][]
  }
  expiry?: number
}

type WithSetFuses = {
  contract: 'setFuses'
  fuses: ChildFuseReferenceType['Key'][]
}

type Data = {
  name: string
  contract: 'setChildFuses' | 'setFuses'
} & (WithSetChildFuses | WithSetFuses)

const getFuseTranslationKey = (fuse: ChildFuseReferenceType['Key']): string =>
  match(fuse)
    .with('CANNOT_UNWRAP', () => `transaction.info.fuses.CANNOT_UNWRAP`)
    .with('CANNOT_BURN_FUSES', () => `transaction.info.fuses.CANNOT_BURN_FUSES`)
    .with('CANNOT_TRANSFER', () => `transaction.info.fuses.CANNOT_TRANSFER`)
    .with('CANNOT_SET_RESOLVER', () => `transaction.info.fuses.CANNOT_SET_RESOLVER`)
    .with('CANNOT_SET_TTL', () => `transaction.info.fuses.CANNOT_SET_TTL`)
    .with('CANNOT_CREATE_SUBDOMAIN', () => `transaction.info.fuses.CANNOT_CREATE_SUBDOMAIN`)
    .with('CANNOT_APPROVE', () => `transaction.info.fuses.CANNOT_APPROVE`)
    .otherwise(() => '')

const displayItems = (
  { name, contract, fuses, ...data }: Data,
  t: TFunction<'translation', undefined>,
): TransactionDisplayItem[] => {
  const parentFuses = contract === 'setChildFuses' ? fuses.parent : []
  const expiry = contract === 'setChildFuses' ? (data as WithSetChildFuses).expiry : 0
  const childFuses = contract === 'setChildFuses' ? fuses.child : fuses

  const parentInfoItems = parentFuses.map((fuse) => {
    switch (fuse) {
      case 'PARENT_CANNOT_CONTROL':
        return [t('transaction.info.fuses.PARENT_CANNOT_CONTROL'), undefined]
      case 'CAN_EXTEND_EXPIRY': {
        return [t('transaction.info.fuses.grant'), t('transaction.info.fuses.CAN_EXTEND_EXPIRY')]
      }
      default:
        return null
    }
  })

  const setExpiryInfoItem = expiry
    ? [
        t('transaction.info.fuses.setExpiry'),
        new Date(expiry * 1000).toLocaleDateString(undefined, {
          month: 'short',
          year: 'numeric',
          day: 'numeric',
        }),
      ]
    : null

  const childInfoItems = childFuses.map((fuse) => [
    t('transaction.info.fuses.revoke'),
    t(getFuseTranslationKey(fuse)),
  ])

  const infoItemValue = [...parentInfoItems, setExpiryInfoItem, ...childInfoItems].filter(
    (item) => !!item,
  ) as [string, string | undefined][]

  return [
    {
      label: 'name',
      value: name,
      type: 'name',
    },
    {
      label: 'action',
      value: t('transaction.description.changePermissions'),
    },
    {
      label: 'info',
      value: infoItemValue,
      type: 'records',
    },
  ]
}

const transaction = ({ connectorClient, data }: TransactionFunctionParameters<Data>) => {
  const { contract } = data
  if (contract === 'setChildFuses') {
    return setChildFuses.makeFunctionData(connectorClient, {
      name: data.name,
      fuses: {
        parent: {
          named: data.fuses.parent,
        },
        child: {
          named: data.fuses.child,
        },
      },
      expiry: data.expiry,
    })
  }
  return setFuses.makeFunctionData(connectorClient, {
    name: data.name,
    fuses: {
      named: data.fuses,
    },
  })
}

export default {
  displayItems,
  transaction,
  backToInput: true,
} satisfies Transaction<Data>
