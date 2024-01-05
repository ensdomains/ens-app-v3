import { P, match } from 'ts-pattern'

import type { NameType } from '@app/hooks/useNameType'

export const getRoles = ({
  nameType,
  registrant,
  owner,
  ethAddress,
  parentOwner,
  dnsOwner,
}: {
  nameType?: NameType | null
  registrant?: string | null
  owner?: string | null
  dnsOwner?: string | null
  ethAddress?: string | null
  parentOwner?: string | null
}) => {
  return match(nameType)
    .with(P.union('eth-unwrapped-2ld'), () => [
      { address: registrant, role: 'owner' as const },
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
          address: parentOwner,
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
    .with(P.union(P.nullish, 'tld', 'root'), () => [])
    .exhaustive()
}
