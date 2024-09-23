import { useMemo } from 'react'
import { Address } from 'viem'

import { ChildFuseReferenceType, RegistrationParameters } from '@ensdomains/ensjs/utils'

import { profileRecordsToRecordOptions } from '@app/components/pages/register/steps/Profile/profileRecordUtils'
import type { StoredRegistrationFlow } from '@app/transaction/slices/createRegistrationFlowSlice'

type Props = {
  name: string
  owner: Address
  registrationData: Pick<
    StoredRegistrationFlow,
    | 'seconds'
    | 'resolverAddress'
    | 'secret'
    | 'records'
    | 'clearRecords'
    | 'permissions'
    | 'reverseRecord'
  >
}

export const getRegistrationParams = ({
  name,
  owner,
  registrationData,
}: Props): RegistrationParameters => {
  return {
    name,
    owner,
    duration: registrationData.seconds,
    resolverAddress: registrationData.resolverAddress ?? undefined,
    secret: registrationData.secret,
    records: profileRecordsToRecordOptions(registrationData.records, registrationData.clearRecords),
    fuses: {
      named: registrationData.permissions
        ? (Object.keys(registrationData.permissions).filter(
            (key) => !!registrationData.permissions?.[key as ChildFuseReferenceType['Key']],
          ) as ChildFuseReferenceType['Key'][])
        : [],
      unnamed: [],
    },
    reverseRecord: registrationData.reverseRecord,
  }
}

const useRegistrationParams = ({ name, owner, registrationData }: Props) => {
  const registrationParams: RegistrationParameters = useMemo(
    () => getRegistrationParams({ name, owner, registrationData }),
    [owner, name, registrationData],
  )

  return registrationParams
}

export default useRegistrationParams
