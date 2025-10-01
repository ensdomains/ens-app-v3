import { match, P } from 'ts-pattern'

import { useAbilities } from '@app/hooks/abilities/useAbilities'
import { useNameType } from '@app/hooks/nameType/useNameType'

export const senderRole = (nameType: ReturnType<typeof useNameType>['data']) => {
  return match(nameType)
    .with(
      P.union(
        'eth-unwrapped-2ld',
        'eth-emancipated-2ld',
        'eth-locked-2ld',
        'eth-emancipated-subname',
        'eth-locked-subname',
        'dns-emancipated-2ld',
        'dns-locked-2ld',
        'dns-emancipated-subname',
        'dns-locked-subname',
      ),
      () => 'owner' as const,
    )
    .with(
      P.union(
        'eth-unwrapped-subname',
        'eth-wrapped-subname',
        'eth-pcc-expired-subname',
        'dns-unwrapped-subname',
        'dns-wrapped-subname',
        'dns-pcc-expired-subname',
      ),
      () => 'manager' as const,
    )
    .with(
      P.union(
        'dns-unwrapped-2ld',
        'dns-wrapped-2ld',
        'eth-emancipated-2ld:grace-period',
        'eth-locked-2ld:grace-period',
        'eth-unwrapped-2ld:grace-period',
      ),
      () => null,
    )
    .with(
      P.union(P.nullish, 'root', 'tld', 'eth-desynced-2ld', 'eth-desynced-2ld:grace-period'),
      () => null,
    )
    .exhaustive()
}

export const checkCanSend = ({
  abilities,
  nameType,
}: {
  abilities: ReturnType<typeof useAbilities>['data']
  nameType: ReturnType<typeof useNameType>['data']
}) => {
  const role = senderRole(nameType)
  if (role === 'manager' && !!abilities?.canSendManager) return true
  if (role === 'owner' && !!abilities?.canSendOwner) return true
  return false
}
