import { Abilities } from '@app/hooks/abilities/useAbilities'

export const shouldShowExtendWarning = (abilities: Abilities | undefined) => {
  return !!abilities?.canSendOwner
}
