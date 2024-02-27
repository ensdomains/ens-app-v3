import { NameWrapperState } from '../fuses/useFusesStates'
import { NameType } from './getNameType'

export const getFuseStateFromNameType = (nameType?: NameType): NameWrapperState => {
  if (!nameType) return 'unwrapped'
  if (nameType.includes('wrapped')) return 'wrapped'
  if (nameType.includes('emancipated')) return 'emancipated'
  if (nameType.includes('locked')) return 'locked'
  return 'unwrapped'
}
