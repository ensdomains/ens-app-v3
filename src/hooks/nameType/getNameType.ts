import { match, P } from 'ts-pattern'
import { Address } from 'viem'

import { GetOwnerReturnType, GetWrapperDataReturnType } from '@ensdomains/ensjs/public'

import { nameLevel } from '@app/utils/name'
import { RegistrationStatus } from '@app/utils/registrationStatus'

export type NameType =
  | 'root'
  | 'tld'
  | 'eth-unwrapped-2ld'
  | 'eth-unwrapped-2ld:grace-period'
  | 'eth-desynced-2ld'
  | 'eth-desynced-2ld:grace-period'
  | 'eth-emancipated-2ld'
  | 'eth-emancipated-2ld:grace-period'
  | 'eth-locked-2ld'
  | 'eth-locked-2ld:grace-period'
  | 'eth-unwrapped-subname'
  | 'eth-wrapped-subname'
  | 'eth-emancipated-subname'
  | 'eth-locked-subname'
  | 'eth-pcc-expired-subname'
  | 'dns-unwrapped-2ld'
  | 'dns-wrapped-2ld'
  | 'dns-emancipated-2ld' // *
  | 'dns-locked-2ld' // *
  | 'dns-unwrapped-subname'
  | 'dns-wrapped-subname'
  | 'dns-emancipated-subname' // *
  | 'dns-locked-subname' // *
  | 'dns-pcc-expired-subname' // *

// * - Outliers. These states require that a dns tld owner wraps their tld and then burns PCC on
//     their subdomain.

const getWrapLevel = ({
  wrapperData,
  ownerData,
}: {
  wrapperData?: GetWrapperDataReturnType
  ownerData?: GetOwnerReturnType
}) => {
  if (ownerData?.ownershipLevel !== 'nameWrapper') return 'unwrapped' as const
  if (wrapperData?.fuses.child.CANNOT_UNWRAP) return 'locked' as const
  if (wrapperData?.fuses.parent.PARENT_CANNOT_CONTROL) return 'emancipated' as const
  if (ownerData?.ownershipLevel === 'nameWrapper') return 'wrapped' as const
  return 'unwrapped' as const
}

export const getNameType = ({
  name,
  ownerData,
  wrapperData,
  pccExpired,
  registrationStatus,
  nameWrapperAddress,
}: {
  name: string
  ownerData?: GetOwnerReturnType
  wrapperData?: GetWrapperDataReturnType
  pccExpired: boolean
  registrationStatus?: RegistrationStatus
  nameWrapperAddress: Address
}): NameType => {
  const tldType = name.endsWith('.eth') ? ('eth' as const) : ('dns' as const)
  const level = nameLevel(name)
  const wrapLevel = getWrapLevel({ wrapperData, ownerData })

  return match([tldType, wrapLevel, level, registrationStatus])
    .with([P._, P._, P.union('root', 'tld'), P._], ([, , _level]) => _level)
    .with(['eth', P._, '2ld', 'gracePeriod'], () => {
      if (ownerData?.owner !== nameWrapperAddress) return 'eth-unwrapped-2ld:grace-period' as const
      if (wrapperData?.fuses?.child?.CANNOT_UNWRAP) return 'eth-locked-2ld:grace-period' as const
      if (wrapperData?.fuses?.parent?.PARENT_CANNOT_CONTROL)
        return 'eth-emancipated-2ld:grace-period' as const
      return 'eth-unwrapped-2ld:grace-period' as const
    })
    .with(['eth', P._, '2ld', 'desynced'], () => 'eth-desynced-2ld' as const)
    .with(
      ['eth', P._, '2ld', 'desynced:gracePeriod'],
      () => 'eth-desynced-2ld:grace-period' as const,
    )
    .with(
      ['eth', P._, '2ld', P._],
      ([_tldType, _wrapLevel]: [
        'eth',
        'unwrapped' | 'emancipated' | 'locked',
        '2ld',
        RegistrationStatus,
      ]) => {
        return `${_tldType}-${_wrapLevel}-2ld` as const
      },
    )
    .with(['dns', P._, '2ld', P._], ([, _wrapLevel]) => `dns-${_wrapLevel}-2ld` as const)
    .with([P._, P._, 'subname', P._], ([_tldType, _wrapLevel]) =>
      pccExpired
        ? (`${_tldType}-pcc-expired-subname` as const)
        : (`${_tldType}-${_wrapLevel}-subname` as const),
    )
    .exhaustive()
}
