import type { JsonRpcSigner } from '@ethersproject/providers'

import { PublicENS, Transaction, TransactionDisplayItem } from '@app/types'
import { yearsToSeconds } from '@app/utils/utils'

type Data = {
  names: string[]
  years: number
}

const displayItems = ({ names }: Data): TransactionDisplayItem[] => [
  {
    label: 'name',
    value: names.length > 1 ? `${names.length} names` : names[0],
    type: names.length > 1 ? undefined : 'name',
  },
]

const transaction = async (signer: JsonRpcSigner, ens: PublicENS, data: Data) => {
  const { names, years } = data
  const duration = yearsToSeconds(years)

  const price = await ens.getPrice(names, duration)
  const value = price?.base

  if (!value) throw new Error('No price found')
  ens.renewNames.populateTransaction(names, {
    duration,
    value,
    signer,
  })
}

export default { transaction, displayItems } as Transaction<Data>
