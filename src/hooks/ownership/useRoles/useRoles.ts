import { useMemo } from 'react'
import { P, match } from 'ts-pattern'

import useDNSOwner from '@app/hooks/useDNSOwner'
import { useNameDetails } from '@app/hooks/useNameDetails'
import { useNameType } from '@app/hooks/useNameType'
import useParentBasicName from '@app/hooks/useParentBasicName'

export type Role = 'owner' | 'manager' | 'eth-record' | 'dns-owner' | 'parent-owner'

type BaseOptions = {
  enabled?: boolean
  grouped?: boolean
}

type GroupedOptions = BaseOptions & { grouped: true }
type UngroupedOptions = BaseOptions & { grouped?: false }

type Options = UngroupedOptions | GroupedOptions

type BaseData = {
  address?: string | null
  role?: Role
  roles?: Role[]
}

export type RoleRecord = BaseData & {
  role: Role
  roles?: never
}

export type GroupedRoleRecord = BaseData & {
  role?: never
  roles: string[]
}

type BaseResults = {
  data?: RoleRecord[] | GroupedRoleRecord[]
  isLoading: boolean
}

type RolesResults = BaseResults & { data?: RoleRecord[] }

type GroupedRolesResults = BaseResults & { data?: GroupedRoleRecord[] }

type Result = RolesResults | GroupedRolesResults

function useRoles(name: string, options?: UngroupedOptions): RolesResults
function useRoles(name: string, options: GroupedOptions): GroupedRolesResults
function useRoles(name: string, options?: Options): Result {
  const grouped = options?.grouped ?? false

  const nameType = useNameType(name)

  const details = useNameDetails(name, true)

  const parentData = useParentBasicName(name)

  const enableUseDNSOwner = parentData.isValid && nameType.data?.startsWith('dns-')
  const parentDNS = useDNSOwner(parentData?.normalisedName, enableUseDNSOwner)

  const isLoading =
    nameType.isLoading || details.isLoading || parentData.isLoading || parentDNS.isLoading

  const listData = useMemo<RoleRecord[] | undefined>(() => {
    if (isLoading) return undefined
    return match(nameType.data!)
      .with(P.union('eth-unwrapped-2ld'), () => [
        { address: details.ownerData?.registrant, role: 'owner' as const },
        { address: details.ownerData?.owner, role: 'manager' as const },
        { address: details.profile?.address, role: 'eth-record' as const },
      ])
      .with(P.union('eth-emancipated-2ld', 'eth-locked-2ld'), () => [
        { address: details.ownerData?.owner, role: 'owner' as const },
        { address: details.profile?.address, role: 'eth-record' as const },
      ])
      .with(
        P.union('eth-unwrapped-subname', 'eth-wrapped-subname', 'eth-pcc-expired-subname'),
        () => [
          {
            address: parentData?.ownerData?.registrant || parentData?.ownerData?.owner,
            role: 'parent-owner' as const,
          },
          { address: details.ownerData?.owner, role: 'manager' as const },
          { address: details.profile?.address, role: 'eth-record' as const },
        ],
      )
      .with(P.union('eth-emancipated-subname', 'eth-locked-subname'), () => [
        { address: details.ownerData?.owner, role: 'owner' as const },
        { address: details.profile?.address, role: 'eth-record' as const },
      ])
      .with(P.union('dns-unwrapped-2ld'), () => [
        { address: details.dnsOwner, role: 'dns-owner' as const },
        { address: details.ownerData?.owner, role: 'manager' as const },
        { address: details.profile?.address, role: 'eth-record' as const },
      ])
      .with('dns-wrapped-2ld', () => [
        { address: details.dnsOwner, role: 'dns-owner' as const },
        { address: details.ownerData?.owner, role: 'manager' as const },
        { address: details.profile?.address, role: 'eth-record' as const },
      ])
      .with(P.union('dns-unwrapped-subname', 'dns-wrapped-subname'), () => [
        ...(parentDNS.dnsOwner
          ? [{ address: parentDNS.dnsOwner, role: 'dns-owner' as const }]
          : [{ address: parentData?.ownerData?.owner, role: 'parent-owner' as const }]),
        { address: details.ownerData?.owner, role: 'manager' as const },
        { address: details.profile?.address, role: 'eth-record' as const },
      ])
      .with(
        P.union(
          'tld',
          'root',
          'dns-emancipated-2ld',
          'dns-locked-2ld',
          'dns-emancipated-subname',
          'dns-locked-subname',
          'dns-pcc-expired-subname',
        ),
        () => [],
      )
      .exhaustive()
  }, [
    isLoading,
    nameType.data,
    details.profile,
    details.ownerData,
    details.dnsOwner,
    parentDNS.dnsOwner,
    parentData.ownerData,
  ])

  const groupedData = useMemo(() => {
    if (!listData || !grouped) return undefined
    return listData.reduce<GroupedRoleRecord[]>((acc, cur) => {
      const index = acc.findIndex((item) => item.address === cur.address)
      if (index === -1)
        return [...acc, { address: cur.address, roles: [cur.role] } as GroupedRoleRecord]
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
