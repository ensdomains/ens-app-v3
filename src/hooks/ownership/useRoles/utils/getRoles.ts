import { match, P } from 'ts-pattern'
import { Address } from 'viem'

import type { NameType } from '@app/hooks/nameType/getNameType'

export const getRoles = ({
  nameType,
  registrant,
  owner,
  wrapperOwner,
  dnsOwner,
  parentOwner,
  parentWrapperOwner,
  ethAddress,
}: {
  nameType?: NameType
  registrant?: Address | null
  owner?: Address
  wrapperOwner?: Address | null
  dnsOwner?: Address | null
  parentOwner?: Address
  parentWrapperOwner?: Address | null
  ethAddress?: Address
}) => {
  return match(nameType)
    .with(P.union('eth-unwrapped-2ld', 'eth-unwrapped-2ld:grace-period'), () => [
      { address: registrant || undefined, role: 'owner' as const },
      { address: owner, role: 'manager' as const },
      { address: ethAddress, role: 'eth-record' as const },
    ])
    .with(
      P.union('eth-emancipated-2ld', 'eth-locked-2ld', 'dns-emancipated-2ld', 'dns-locked-2ld'),
      () => [
        { address: owner, role: 'owner' as const },
        { address: ethAddress, role: 'eth-record' as const },
      ],
    )
    .with(P.union('eth-emancipated-2ld:grace-period', 'eth-locked-2ld:grace-period'), () => [
      { address: wrapperOwner, role: 'owner' as const },
      { address: ethAddress, role: 'eth-record' as const },
    ])
    .with(
      P.union(
        'eth-unwrapped-subname',
        'eth-wrapped-subname',
        'eth-pcc-expired-subname',
        'dns-unwrapped-subname',
        'dns-wrapped-subname',
        'dns-pcc-expired-subname',
      ),
      () => [
        {
          address: parentWrapperOwner || parentOwner,
          role: 'parent-owner' as const,
        },
        { address: owner, role: 'manager' as const },
        { address: ethAddress, role: 'eth-record' as const },
      ],
    )
    .with(
      P.union(
        'eth-emancipated-subname',
        'eth-locked-subname',
        'dns-emancipated-subname',
        'dns-locked-subname',
      ),
      () => [
        { address: owner, role: 'owner' as const },
        { address: ethAddress, role: 'eth-record' as const },
      ],
    )
    .with(P.union('dns-unwrapped-2ld', 'dns-wrapped-2ld'), () => [
      { address: dnsOwner, role: 'dns-owner' as const },
      { address: owner, role: 'manager' as const },
      { address: ethAddress, role: 'eth-record' as const },
    ])
    .with(
      P.union(P.nullish, 'tld', 'root', 'eth-desynced-2ld', 'eth-desynced-2ld:grace-period'),
      () => [],
    )
    .exhaustive()
}
