import { match } from "ts-pattern"

const mockUseSupportsTLDTypes = ['supported', 'unsupported'] as const
export type MockUseSupportsTLDType = typeof mockUseSupportsTLDTypes[number]

export const makeMockUseSupportsTLDData = (type: MockUseSupportsTLDType): boolean | undefined =>
  match(type)
    .with('supported', () => true)
    .with('unsupported', () => false)
    .exhaustive()