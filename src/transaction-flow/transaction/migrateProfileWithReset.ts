import type { JsonRpcSigner } from '@ethersproject/providers'
import type { TFunction } from 'react-i18next'

import {
  profileRecordsToRecordOptions,
  profileToProfileRecords,
} from '@app/components/pages/profile/[name]/registration/steps/Profile/profileRecordUtils'
import { getABISafely, normaliseABI } from '@app/hooks/useGetABI'
import { PublicENS, Transaction, TransactionDisplayItem } from '@app/types'

import { DetailedProfile } from '../../hooks/useNameDetails'

type Data = {
  name: string
  resolver: string
}

const displayItems = ({ name }: Data, t: TFunction): TransactionDisplayItem[] => {
  return [
    {
      label: 'name',
      value: name,
      type: 'name',
    },
    {
      label: 'action',
      value: t('transaction.description.migrateProfileWithReset'),
    },
    {
      label: 'info',
      value: t('transaction.info.migrateProfileWithReset'),
    },
  ]
}

const transaction = async (signer: JsonRpcSigner, ens: PublicENS, data: Data) => {
  const latestResolver = (await ens.contracts!.getPublicResolver()!).address
  const currentProfile = await ens.getProfile(data.name)
  const abiData = await getABISafely(ens.getABI)(data.name)
  const abi = normaliseABI(abiData)

  const profileRecords = profileToProfileRecords(currentProfile as DetailedProfile)
  const recordOptions = profileRecordsToRecordOptions(profileRecords)

  return ens.setRecords.populateTransaction(data.name, {
    records: {
      ...recordOptions,
      clearRecords: true,
      ...(abi ? { abi } : {}),
    },
    resolverAddress: latestResolver,
    signer,
  })
}

export default { displayItems, transaction } as Transaction<Data>
