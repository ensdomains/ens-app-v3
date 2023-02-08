import type { JsonRpcSigner } from '@ethersproject/providers'
import type { TFunction } from 'react-i18next'

import {
  ChildFuses as ENSJSChildFuses,
  ParentFuses as ENSJSParentFuses,
} from '@ensdomains/ensjs/utils/fuses'

import { PublicENS, Transaction, TransactionDisplayItem } from '@app/types'

export type ParentFuse = ENSJSParentFuses['fuse']
export type ChildFuse = ENSJSChildFuses['fuse']
export type Fuse = ParentFuse | ChildFuse

export const PARENT_FUSES: ParentFuse[] = ['PARENT_CANNOT_CONTROL', 'CAN_EXTEND_EXPIRY']
export const CHILD_FUSES: ChildFuse[] = [
  'CANNOT_UNWRAP',
  'CANNOT_CREATE_SUBDOMAIN',
  'CANNOT_TRANSFER',
  'CANNOT_SET_RESOLVER',
  'CANNOT_SET_TTL',
  'CANNOT_BURN_FUSES',
]

type WithSetChildFuses = {
  contract: 'setChildFuses'
  fuses: {
    parent: ParentFuse[]
    child: ChildFuse[]
  }
  expiry?: number
}

type WithSetFuses = {
  contract: 'setFuses'
  fuses: ChildFuse[]
}

type Data = {
  name: string
  contract: 'setChildFuses' | 'setFuses'
} & (WithSetChildFuses | WithSetFuses)

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
    t(`transaction.info.fuses.${fuse}`),
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
      value: t('transaction.description.changePermissions') as string,
    },
    {
      label: 'info',
      value: infoItemValue,
      type: 'records',
    },
  ]
}

const transaction = (signer: JsonRpcSigner, ens: PublicENS, data: Data) => {
  const { contract } = data
  if (contract === 'setChildFuses') {
    return ens.setChildFuses.populateTransaction(data.name, {
      fuses: {
        parent: {
          named: data.fuses.parent,
        },
        child: {
          named: data.fuses.child,
        },
      },
      expiry: data.expiry,
      signer,
    })
  }
  const tx = ens.setFuses.populateTransaction(data.name, {
    named: data.fuses,
    signer,
  })
  return tx
}

export default {
  displayItems,
  transaction,
  backToInput: true,
} as Transaction<Data>
