import { useMemo } from 'react'

import { RegistrationParameters } from '@ensdomains/ensjs/utils'

import { profileRecordsToRecordOptions } from '@app/components/pages/profile/[name]/registration/steps/Profile/profileRecordUtils'
import { ChildFuseKeyType, RegistrationReducerDataItem } from '@app/components/pages/profile/[name]/registration/types'
import { yearsToSeconds } from '@app/utils/utils'
import { Address } from 'viem'

type Props = {
  name: string
  owner: Address
  registrationData: Pick<
    RegistrationReducerDataItem,
    'years' | 'resolverAddress' | 'secret' | 'records' | 'clearRecords' | 'permissions' | 'reverseRecord'
  >
}

const useRegistrationParams = ({ name, owner, registrationData }: Props) => {
  const registrationParams: RegistrationParameters = useMemo(
    () => ({
      name,
      owner,
      duration: yearsToSeconds(registrationData.years),
      resolverAddress: registrationData.resolverAddress,
      secret: registrationData.secret,
      records: profileRecordsToRecordOptions(
        registrationData.records,
        registrationData.clearRecords,
      ),
      fuses: {
        named: registrationData.permissions
          ? (Object.keys(registrationData.permissions).filter(
              (key) => !!registrationData.permissions?.[key as ChildFuseKeyType],
            ) as ChildFuseKeyType[])
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
