import type { ENS } from '@ensdomains/ensjs'
import type { JsonRpcSigner } from '@ethersproject/providers'

const infoItems = [
  {
    label: 'name',
    value: 'name',
    type: 'name',
  },
]

const transaction = async (
  signer: JsonRpcSigner,
  ens: ENS,
  data: {
    name: string
  },
) =>
  ens.wrapName.populateTransaction(data.name, { wrappedOwner: await signer.getAddress(), signer })

export default { infoItems, transaction }
