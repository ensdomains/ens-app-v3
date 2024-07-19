import { UseVerifiedRecordsReturnType } from '@app/hooks/verification/useVerifiedRecords/useVerifiedRecords'

export type VerificationRecordItem = Record<'key' | 'value' | 'iconKey', string> & {
  showBadge: boolean
  isVerified: boolean
}

type GetVerificationRecordItemsReturnTyep = VerificationRecordItem[]

export const getVerificationRecordItemProps = ({
  verifiedRecordsData,
  showErrors,
}: {
  verifiedRecordsData?: UseVerifiedRecordsReturnType
  showErrors: boolean
}): GetVerificationRecordItemsReturnTyep => {
  if (showErrors) {
    return (
      verifiedRecordsData?.map(({ verifier, isVerified, verifiedRecords: records }) => {
        const hasPersonhood = !!records.personhood
        return {
          showBadge: hasPersonhood || !isVerified,
          isVerified: isVerified && hasPersonhood,
          key: verifier,
          iconKey: verifier,
          value: verifier,
        }
      }) || []
    )
  }
  return (
    verifiedRecordsData
      ?.map(({ verifier, isVerified, verifiedRecords: records }) => {
        if (!isVerified) return null
        const hasPersonhood = !!records.personhood
        return {
          showBadge: isVerified && hasPersonhood,
          isVerified: isVerified && !!records.personhood,
          key: verifier as string,
          iconKey: verifier as string,
          value: verifier as string,
        }
      })
      .filter((recordItem): recordItem is VerificationRecordItem => !!recordItem) || []
  )
}
