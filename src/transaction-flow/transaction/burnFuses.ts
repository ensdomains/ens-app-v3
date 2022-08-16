import { PublicENS, TransactionDisplayItem } from '@app/types'
import { JsonRpcSigner } from '@ethersproject/providers'

type Data = {
  name: string
  permissions: string[]
  selectedFuses: number
}

const displayItems = ({ name, permissions }: Data): TransactionDisplayItem[] => [
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

const transaction = (signer: JsonRpcSigner, ens: PublicENS, data: Data) => {
  console.log('data: ', data)
  const tx = ens.setFuses.populateTransaction('wrapped.eth', {
    fuses: data.selectedFuses,
    signer,
  })
  console.log('tx: ', tx)
  return tx
}

export default { displayItems, confirm, request, pending, transaction }
