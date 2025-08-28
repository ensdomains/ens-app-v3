import { match, P } from 'ts-pattern'
import { Address } from 'viem'

import type { NameType } from '@app/hooks/nameType/getNameType'

export const checkCanSyncManager = ({
  address,
  nameType,
  registrant,
  owner,
  dnsOwner,
}: {
  address?: Address | null
  nameType?: NameType | null
  registrant?: Address | null
  owner?: Address | null
  dnsOwner?: Address | null
}) => {
  return match(nameType)
    .with(
      P.union('eth-unwrapped-2ld', 'eth-unwrapped-2ld:grace-period'),
      () => registrant === address && owner !== address,
    )
    .with(
      P.union('dns-unwrapped-2ld', 'dns-wrapped-2ld'),
      () => dnsOwner === address && owner !== address,
    )
    .with(
      P.union(
        P.nullish,
        'root',
        'tld',
        'eth-desynced-2ld',
        'eth-desynced-2ld:grace-period',
        'eth-emancipated-2ld',
        'eth-emancipated-2ld:grace-period',
        'eth-locked-2ld',
        'eth-locked-2ld:grace-period',
        'eth-unwrapped-subname',
        'eth-wrapped-subname',
        'eth-emancipated-subname',
        'eth-locked-subname',
        'eth-pcc-expired-subname',
        'dns-locked-2ld',
        'dns-emancipated-2ld',
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
