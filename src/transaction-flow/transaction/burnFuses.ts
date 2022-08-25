import { Dispatch } from 'react'
import type { JsonRpcSigner } from '@ethersproject/providers'

import { PublicENS, TransactionDisplayItem, Transaction, FuseObj } from '@app/types'

import { TransactionFlowAction } from '../types'

type Data = {
  name: string
  permissions: string[]
  selectedFuses: Array<keyof FuseObj>
}

const displayItems = ({ name, permissions }: Data): TransactionDisplayItem<'name' | 'list'>[] => [
  {
    label: 'name',
    value: name,
    type: 'name',
  },
  {
    label: 'action',
    value: `transaction.description`,
  },
  {
    label: 'info',
    value: ['Permissions to be burned:', ...permissions],
    type: 'list',
  },
]

const onDismiss = (dispatch: Dispatch<TransactionFlowAction>) => () => {
  dispatch({ name: 'setFlowStage', payload: 'input' })
}

const dismissBtnLabel = 'Back'

const transaction = (signer: JsonRpcSigner, ens: PublicENS, data: Data) => {
  const tx = ens.burnFuses.populateTransaction(data.name, {
    fusesToBurn: new Set(data.selectedFuses),
    signer,
  })
  return tx
}

const exports: Transaction<Data> = {
  displayItems,
  transaction,
  onDismiss,
  dismissBtnLabel,
}

export default exports
