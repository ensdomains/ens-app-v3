import { match, P } from 'ts-pattern'
import { Address } from 'viem'

import type { NameType } from '@app/hooks/nameType/getNameType'

/*
  Roles relate to the type of ownership
  - owner: The ultimate owner of the name 
  - manager: Able to manager various details of the name, but is not the ultimate owner
  - eth-record: Mostly for off-chain names, assume the owner is the eth record
  - parent-owner: The owner of the parent name
  - dns-owner: The owner of the DNS name
*/

export const getRoles = ({
  nameType,
  registrant,
  owner,
  dnsOwner,
  parentOwner,
  parentWrapperOwner,
  ethAddress,
}: {
  nameType?: NameType
  registrant?: Address | null
  owner?: Address
  dnsOwner?: Address | null
  parentOwner?: Address
  parentWrapperOwner?: Address | null
  ethAddress?: Address
}) => {
  return match(nameType)
    .with(P.union('eth-wrapped-2ld', 'eth-wrapped-2ld:grace-period'), () => [
      { address: owner, role: 'owner' as const },
      { address: ethAddress, role: 'eth-record' as const },
    ])
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
      { address: owner, role: 'owner' as const },
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
    .with(P.union(P.nullish, 'tld', 'root'), () => [])
    .exhaustive()
}
