import { useMemo } from 'react'
import { Address } from 'viem'

import { ChildFuseReferenceType, RegistrationParameters } from '@ensdomains/ensjs/utils'

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
    | 'permissions'
    | 'reverseRecord'
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
      fuses: {
        named: registrationData.permissions
          ? (Object.keys(registrationData.permissions).filter(
              (key) => !!registrationData.permissions?.[key as ChildFuseReferenceType['Key']],
            ) as ChildFuseReferenceType['Key'][])
          : [],
        unnamed: [],
      },
      reverseRecord: registrationData.reverseRecord,
    }),
    [owner, name, registrationData],
  )

  return registrationParams
}

export default useRegistrationParams
