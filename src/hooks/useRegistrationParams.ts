import { useMemo } from 'react'
import { Address } from 'viem'

import { RegistrationParameters } from '@ensdomains/ensjs/utils'

import { profileRecordsToRecordOptions } from '@app/components/pages/profile/[name]/registration/steps/Profile/profileRecordUtils'
import { RegistrationReducerDataItem } from '@app/components/pages/profile/[name]/registration/types'

type Props = {
  name: string
  owner: Address
  registrationData: Pick<
    RegistrationReducerDataItem,
    | 'seconds'
    | 'resolverAddress'
    | 'secret'
    | 'records'
    | 'clearRecords'
    | 'reverseRecord'
    | 'referrer'
  >
}

const useRegistrationParams = ({ name, owner, registrationData }: Props) => {
  const registrationParams: RegistrationParameters = useMemo(
    () => ({
      name,
      owner,
      duration: registrationData.seconds,
      resolverAddress: registrationData.resolverAddress,
      secret: registrationData.secret,
      records: profileRecordsToRecordOptions(
        registrationData.records,
        registrationData.clearRecords,
      ),
      // Convert boolean to ReverseRecordParameter enum values
      // false -> 0 (None), true -> 2 (Default - sets as primary name)
      reverseRecord: registrationData.reverseRecord ? 2 : 0,
      referrer: registrationData.referrer,
    }),
    [owner, name, registrationData],
  )

  return registrationParams
}

export default useRegistrationParams
