import { useMemo } from 'react'

import { ChildFuses } from '@ensdomains/ensjs'
import { BaseRegistrationParams } from '@ensdomains/ensjs/utils/registerHelpers'

import { profileRecordsToRecordOptions } from '@app/components/pages/profile/[name]/registration/steps/Profile/profileRecordUtils'
import { RegistrationReducerDataItem } from '@app/components/pages/profile/[name]/registration/types'
import { yearsToSeconds } from '@app/utils/utils'

type Props = {
  name: string
  owner: string
  registrationData: Pick<
    RegistrationReducerDataItem,
    'years' | 'resolver' | 'secret' | 'records' | 'clearRecords' | 'permissions' | 'reverseRecord'
  >
}

const useRegistrationParams = ({ name, owner, registrationData }: Props) => {
  const registrationParams: BaseRegistrationParams & { name: string } = useMemo(
    () => ({
      name,
      owner,
      duration: yearsToSeconds(registrationData.years),
      resolverAddress: registrationData.resolver,
      secret: registrationData.secret,
      records: profileRecordsToRecordOptions(
        registrationData.records,
        registrationData.clearRecords,
      ),
      fuses: {
        named: registrationData.permissions
          ? (Object.keys(registrationData.permissions).filter(
              (key) => !!registrationData.permissions?.[key as ChildFuses['fuse']],
            ) as ChildFuses['fuse'][])
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
