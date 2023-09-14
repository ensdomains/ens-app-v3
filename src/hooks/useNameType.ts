import { useMemo } from 'react'
import { P, match } from 'ts-pattern'

import { nameLevel } from '@app/utils/name'

import { useBasicName } from './useBasicName'

type Options = {
  enabled?: boolean
}

export type NameType =
  | 'root'
  | 'tld'
  | 'eth-unwrapped-2ld'
  | 'eth-emancipated-2ld'
  | 'eth-locked-2ld'
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

const getWrapLevel = (
  wrapperData: ReturnType<typeof useBasicName>['wrapperData'],
  ownerData: ReturnType<typeof useBasicName>['ownerData'],
) => {
  if (wrapperData?.child.CANNOT_UNWRAP) return 'locked' as const
  if (wrapperData?.parent.PARENT_CANNOT_CONTROL) return 'emancipated' as const
  if (ownerData?.ownershipLevel === 'nameWrapper') return 'wrapped' as const
  return 'unwrapped' as const
}

export const getNameType = ({
  name,
  ownerData,
  wrapperData,
  pccExpired,
}: {
  name: string
  ownerData: ReturnType<typeof useBasicName>['ownerData']
  wrapperData: ReturnType<typeof useBasicName>['wrapperData']
  pccExpired: boolean
}) => {
  const tldType = name.endsWith('.eth') ? ('eth' as const) : ('dns' as const)
  const level = nameLevel(name)
  const wrapLevel = getWrapLevel(wrapperData, ownerData)

  return match([tldType, wrapLevel, level])
    .with([P._, P._, P.union('root', 'tld')], ([, , _level]) => _level)
    .with(
      ['eth', P._, '2ld'],
      ([_tldType, _wrapLevel]: ['eth', 'unwrapped' | 'emancipated' | 'locked', '2ld']) => {
        return `${_tldType}-${_wrapLevel}-2ld` as const
      },
    )
    .with(['dns', P._, '2ld'], ([, _wrapLevel]) => `dns-${_wrapLevel}-2ld` as const)
    .with([P._, P._, 'subname'], ([_tldType, _wrapLevel]) =>
      pccExpired
        ? (`${_tldType}-pcc-expired-subname` as const)
        : (`${_tldType}-${_wrapLevel}-subname` as const),
    )
    .exhaustive()
}

export const useNameType = (name: string, options: Options = {}) => {
  const enabled = options.enabled ?? true

  const basicName = useBasicName(name, { skipGraph: true, enabled })

  const { isLoading, isCachedData } = basicName

  const data: NameType | undefined = useMemo(() => {
    if (isLoading) return undefined
    return getNameType({
      name,
      ownerData: basicName.ownerData!,
      wrapperData: basicName.wrapperData!,
      pccExpired: basicName.pccExpired,
    })
  }, [isLoading, name, basicName.ownerData, basicName.wrapperData, basicName.pccExpired])

  return {
    data,
    isLoading,
    isCachedData,
  }
}
