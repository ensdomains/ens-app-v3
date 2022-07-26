import { ENS } from '@ensdomains/ensjs'
import { JsonRpcSigner } from '@ethersproject/providers'

const infoItems = [
  {
    label: 'action',
    value: 'Update Resolver',
  },
  {
    label: 'info',
    value: 'Update your current resolver to the new one you have selected',
  },
  {
    label: 'currentResolver',
    value: 'shouldGetUpdated',
    type: 'address',
  },
  {
    label: 'newResolver',
    value: 'shouldGetUpdated',
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

const transaction = (
  signer: JsonRpcSigner,
  ens: ENS,
  data: {
    name: string
    contract: 'registry' | 'nameWrapper'
    resolver: string
  },
) =>
  ens.setResolver.populateTransaction(data.name, {
    contract: data.contract,
    resolver: data.resolver,
    signer,
  })

export default { infoItems, confirm, request, pending, transaction }
