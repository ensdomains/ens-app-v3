import { useMemo } from 'react'
import { P, match } from 'ts-pattern'

import useDNSOwner from '@app/hooks/useDNSOwner'
import type { useNameDetails } from '@app/hooks/useNameDetails'
import useParentBasicName from '@app/hooks/useParentBasicName'
import { nameLevel } from '@app/utils/name'

type NameType =
  | 'unwrapped-2ld'
  | 'wrapped-2ld'
  | 'dns-2ld'
  | 'emancipated-subname'
  | 'legacy-subname'
  | 'dns-subname'
  | 'tld'
  | 'root'

type Input = {
  name: string
  details: ReturnType<typeof useNameDetails>
}

type BaseOptions = {
  enabled?: boolean
  grouped?: boolean
}

type GroupedOptions = BaseOptions & { grouped: true }
type UngroupedOptions = BaseOptions & { grouped?: false }

type Options = UngroupedOptions | GroupedOptions

type BaseData = {
  address?: string | null
  role?: string
  roles?: string[]
}

type ListData = BaseData & {
  role: string
  roles?: never
}

type GroupedData = BaseData & {
  role?: never
  roles: string[]
}

type BaseResults = {
  data?: ListData[] | GroupedData[]
  isLoading: boolean
}

type ListResults = BaseResults & { data?: ListData[] }

type GroupedResults = BaseResults & { data?: GroupedData[] }

type Result = ListResults | GroupedResults

function useRoles(input: Input, options?: UngroupedOptions): ListResults
function useRoles(input: Input, options: GroupedOptions): GroupedResults
function useRoles({ name, details }: Input, options?: Options): Result {
  const grouped = options?.grouped ?? false

  const isEth = name?.endsWith('.eth')
  const isWrapped = details?.isWrapped
  const level = nameLevel(name)

  const parentData = useParentBasicName(name)

  const enableUseDNSOwner = parentData.isValid && !isEth && level === 'subname'
  const parentDNS = useDNSOwner(parentData?.normalisedName, enableUseDNSOwner)

  const nameType: NameType = match({
    isEth,
    level,
    isWrapped,
  })
    .with({ isEth: true, level: '2ld', isWrapped: false }, () => 'unwrapped-2ld' as const)
    .with({ isEth: true, level: '2ld', isWrapped: true }, () => 'wrapped-2ld' as const)
    .with({ isEth: false, level: '2ld', isWrapped: P._ }, () => 'dns-2ld' as const)
    .with({ isEth: true, level: 'subname', isWrapped: P._ }, () =>
      details?.wrapperData?.parent.PARENT_CANNOT_CONTROL
        ? ('emancipated-subname' as const)
        : ('legacy-subname' as const),
    )
    .with({ isEth: false, level: 'subname', isWrapped: P._ }, () => 'dns-subname' as const)
    .with({ isEth: P._, level: P.union('root', 'tld'), isWrapped: P._ }, ({ level: l }) => l)
    .exhaustive()

  const isLoading = details.isLoading || parentData.isLoading || parentDNS.isLoading

  const listData = useMemo<ListData[] | undefined>(() => {
    if (isLoading) return undefined

    return match(nameType)
      .with('unwrapped-2ld', () => [
        { address: details.ownerData?.registrant, role: 'owner' },
        { address: details.ownerData?.owner, role: 'manager' },
        { address: details.profile?.address, role: 'eth-record' },
      ])
      .with('wrapped-2ld', () => [
        { address: details.ownerData?.owner, role: 'owner' },
        { address: details.profile?.address, role: 'eth-record' },
      ])
      .with('dns-2ld', () => [
        { address: details.dnsOwner, role: 'dns-owner' },
        { address: details.ownerData?.owner, role: 'manager' },
        { address: details.profile?.address, role: 'eth-record' },
      ])
      .with('legacy-subname', () => [
        {
          address: parentData?.ownerData?.registrant || parentData?.ownerData?.owner,
          role: 'parent-owner',
        },
        { address: details.ownerData?.owner, role: 'manager' },
        { address: details.profile?.address, role: 'eth-record' },
      ])
      .with('emancipated-subname', () => [
        { address: details.ownerData?.owner, role: 'owner' },
        { address: details.profile?.address, role: 'eth-record' },
      ])
      .with('dns-subname', () => [
        ...(parentDNS.dnsOwner
          ? [{ address: parentDNS.dnsOwner, role: 'dns-owner' }]
          : [{ address: parentData?.ownerData?.owner, role: 'parent-owner' }]),
        { address: details.profile?.address, role: 'eth-record' },
      ])
      .with(P.union('tld', 'root'), () => [])
      .exhaustive()
  }, [isLoading, nameType, details, parentDNS, parentData])

  const groupedData = useMemo(() => {
    if (!listData || !grouped) return undefined
    return listData.reduce<GroupedData[]>((acc, cur) => {
      const index = acc.findIndex((item) => item.address === cur.address)
      if (index === -1) return [...acc, { address: cur.address, roles: [cur.role] } as GroupedData]
      return acc.map((item, i) =>
        i === index ? { ...item, roles: [...(item.roles || []), cur.role] } : item,
      )
    }, [])
  }, [listData, grouped])

  if (grouped) return { data: groupedData, isLoading }
  return {
    data: listData,
    isLoading,
  }
}

export default useRoles
