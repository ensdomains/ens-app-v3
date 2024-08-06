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
    .with('verified', () => undefined)
    .with('verified-with-error', () => undefined)
    .exhaustive()
}
