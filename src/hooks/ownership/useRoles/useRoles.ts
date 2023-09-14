import { useMemo } from 'react'

import { useNameDetails } from '@app/hooks/useNameDetails'
import { useNameType } from '@app/hooks/useNameType'
import useParentBasicName from '@app/hooks/useParentBasicName'

import { getRoles } from './utils/getRoles'

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
  isCachedData?: boolean
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

  const isLoading = nameType.isLoading || details.isLoading || parentData.isLoading
  const isCachedData = nameType.isCachedData || details.basicIsCachedData || parentData.isCachedData

  const listData = useMemo<RoleRecord[] | undefined>(() => {
    if (isLoading) return undefined
    return getRoles({
      nameType: nameType.data!,
      owner: details.ownerData?.owner,
      registrant: details.ownerData?.registrant,
      parentOwner: parentData.ownerData?.owner,
      ethAddress: details.profile?.address,
      dnsOwner: details.dnsOwner,
    })
  }, [
    isLoading,
    nameType.data,
    details.ownerData,
    details.dnsOwner,
    details.profile?.address,
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

  if (grouped) return { data: groupedData, isLoading, isCachedData }
  return {
    data: listData,
    isLoading,
    isCachedData,
  }
}

export default useRoles
