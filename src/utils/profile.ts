import { Profile } from '@app/types'

import { contentHashToString } from './contenthash'

export const profileHasRecords = (profile?: Profile) => {
  if (!profile) return false
  if (profile.texts?.length) return true
  if (profile.coins?.length) return true
  if (contentHashToString(profile.contentHash)) return true
  if (profile.abi) return true
  return false
}
