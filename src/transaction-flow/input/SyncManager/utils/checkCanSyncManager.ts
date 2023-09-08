import { P, match } from 'ts-pattern'

import type { useNameDetails } from '@app/hooks/useNameDetails'
import type { useNameType } from '@app/hooks/useNameType'

export const checkCanSyncManager = ({
  address,
  nameType,
  details,
}: {
  address?: string | null
  nameType: ReturnType<typeof useNameType>['data']
  details: ReturnType<typeof useNameDetails>
}) => {
  return match(nameType)
    .with(
      'eth-unwrapped-2ld',
      () => details.ownerData?.registrant === address && details.ownerData?.owner !== address,
    )
    .with(
      P.union('dns-unwrapped-2ld', 'dns-wrapped-2ld'),
      () => details.dnsOwner === address && details.ownerData?.owner !== address,
    )
    .with(
      P.union(
        P.nullish,
        'root',
        'tld',
        'eth-emancipated-2ld',
        'eth-locked-2ld',
        'eth-unwrapped-subname',
        'eth-wrapped-subname',
        'eth-emancipated-subname',
        'eth-locked-subname',
        'eth-pcc-expired-subname',
        'dns-emancipated-2ld',
        'dns-locked-2ld',
        'dns-unwrapped-subname',
        'dns-wrapped-subname',
        'dns-emancipated-subname',
        'dns-locked-subname',
        'dns-pcc-expired-subname',
      ),
      () => false,
    )
    .exhaustive()
}
