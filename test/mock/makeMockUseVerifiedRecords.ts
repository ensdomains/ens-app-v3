import { match } from 'ts-pattern'

import { UseVerifiedRecordsReturnType } from '@app/hooks/verification/useVerifiedRecords/useVerifiedRecords'

export const mockUseVerifiedRecordsTypes = [
  'unverified',
  'verified',
  'verified-with-error',
] as const
type MockUseVerifiedRecordsType = (typeof mockUseVerifiedRecordsTypes)[number]

export const makeMockUseVerifiedRecordsData = (
  type: MockUseVerifiedRecordsType,
): UseVerifiedRecordsReturnType | undefined => {
  return match(type)
    .with('unverified', () => undefined)
    .with('verified', () => [
      {
        verifier: 'dentity' as const,
        isVerified: true,
        isNameVerified: true,
        isAddressVerified: true,
        verifiedRecords: {},
      },
    ])
    .with('verified-with-error', () => [
      {
        verifier: 'dentity' as const,
        isVerified: false,
        isNameVerified: false,
        isAddressVerified: false,
        verifiedRecords: {},
      },
    ])
    .exhaustive()
}
