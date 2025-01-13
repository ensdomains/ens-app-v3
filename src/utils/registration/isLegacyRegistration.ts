import { RegistrationParameters } from '@ensdomains/ensjs/utils'

const hasFuses = ({ fuses }: RegistrationParameters) => {
  const hasNamedFuses = fuses?.named && fuses.named.length > 0
  const hasUnnameFuses = fuses?.unnamed && fuses.unnamed.length > 0
  return hasNamedFuses || hasUnnameFuses
}

const hasRecords = ({ records }: RegistrationParameters) => {
  const hasAddressRecords =
    records?.coins &&
    records.coins?.filter(({ coin }) => {
      const cond1 = typeof coin === 'string' && coin.toLowerCase() !== 'eth'
      const cond2 = typeof coin === 'number' && coin !== 60
      return cond1 || cond2
    }).length > 0
  const hasTextRecord = !!records?.texts && records.texts.length > 0
  const hasContentHash = !!records?.contentHash
  return hasAddressRecords || hasTextRecord || hasContentHash
}

export const isLegacyRegistration = (params: RegistrationParameters) => {
  return !hasRecords(params) && !hasFuses(params) && !params.reverseRecord
}
