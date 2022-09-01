import { JsonRpcSigner } from '@ethersproject/providers'

import { PublicENS, TransactionDisplayItem } from '@app/types'

type Data = {
  name: string
  contract: 'registry' | 'nameWrapper'
  resolver: string
  oldResolver: string
}

const displayItems = ({ resolver, oldResolver }: Data): TransactionDisplayItem[] => [
  {
    label: 'currentResolver',
    value: oldResolver,
    type: 'address',
  },
  {
    label: 'newResolver',
    value: resolver,
    type: 'address',
  },
]

const confirm = {
  type: 'confirm',
  title: 'Transaction Request',
  description: 'Confirm the details of the transaction',
}

const request = {
  type: 'request',
  title: 'Update Resolver',
  description: 'Update your current resolver to the new one you have selected',
}

const pending = {
  type: 'pending',
  title: 'Transaction mining',
  description:
    'Your transaction has been sent to the network, and is waiting to be saved to the blockchain. You may close this dialog.',
}

const transaction = (signer: JsonRpcSigner, ens: PublicENS, data: Data) =>
  ens.setResolver.populateTransaction(data.name, {
    contract: data.contract,
    resolver: data.resolver,
    signer,
  })

export default { displayItems, confirm, request, pending, transaction }
