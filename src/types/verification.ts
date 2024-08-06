export type VerifiableCredential = {
  type: Array<'VerifiedCredential' | string>
} & Record<string, any>
