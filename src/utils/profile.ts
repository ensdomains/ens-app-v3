import { Profile } from '@app/types'

import { contentHashToString } from './contenthash'

export const profileHasRecords = (profile?: Profile) => {
  if (!profile?.records) return false
  if (profile.records.texts?.length) return true
  if (profile.records.coinTypes?.length) return true
  if (contentHashToString(profile.records.contentHash)) return true
  if ((profile.records as any).abi) return true
  return false
}
