import { Abilities } from '@app/hooks/abilities/useAbilities'

export const shouldShowExtendWarning = (abilities: Abilities | undefined) => {
  if (!abilities) return false
  return abilities?.canEdit || abilities.canSend
}
