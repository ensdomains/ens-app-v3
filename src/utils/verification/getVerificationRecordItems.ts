import { UseVerifiedRecordsReturnType } from '@app/hooks/verification/useVerifiedRecords/useVerifiedRecords'

export type VerificationRecordItem = Record<'key' | 'value' | 'iconKey', string> & {
  showBadge: boolean
  isVerified: boolean
}

type GetVerificationRecordItemsReturnTyep = VerificationRecordItem[]

export const getVerificationRecordItemProps = ({
  verifiedRecordsData,
  showErrors,
  name,
}: {
  verifiedRecordsData?: UseVerifiedRecordsReturnType
  showErrors: boolean
  name: string
}): GetVerificationRecordItemsReturnTyep => {
  const verificationItemsMap =
    verifiedRecordsData?.reduce<{ [key: string]: VerificationRecordItem }>(
      (acc, { issuer, key, verified }) => {
        // Defaulte record item
        const recordItem = acc[issuer] ?? {
          showBadge: false,
          isVerified: false,
          key: issuer,
          iconKey: issuer,
          value: name,
        }

        if (key !== 'personhood') return { ...acc, [issuer]: recordItem }

        if (showErrors) recordItem.showBadge = true
        if (verified) {
          recordItem.showBadge = true
          recordItem.isVerified = true
        }

        return { ...acc, [issuer]: recordItem }
      },
      {},
    ) || {}
  return Object.values(verificationItemsMap)
}
