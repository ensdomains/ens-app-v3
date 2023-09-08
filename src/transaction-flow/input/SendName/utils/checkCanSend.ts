import { P, match } from 'ts-pattern'

import { useAbilities } from '@app/hooks/abilities/useAbilities'
import { useNameType } from '@app/hooks/useNameType'

export const checkCanSend = ({
  abilities,
  nameType,
}: {
  abilities: ReturnType<typeof useAbilities>['data']
  nameType: ReturnType<typeof useNameType>['data']
}) => {
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
      () => abilities.canSendOwner,
    )
    .with(
      P.union(
        'eth-unwrapped-subname',
        'eth-wrapped-subname',
        'eth-pcc-expired-subname',
        'dns-unwrapped-2ld',
        'dns-wrapped-2ld',
        'dns-unwrapped-subname',
        'dns-wrapped-subname',
        'dns-pcc-expired-subname',
      ),
      () => abilities.canSendManager,
    )
    .with(P.union(P.nullish, 'root', 'tld'), () => false)
    .exhaustive()
}
