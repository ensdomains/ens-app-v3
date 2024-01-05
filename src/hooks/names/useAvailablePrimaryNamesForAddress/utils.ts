import type { useResolverStatus } from '@app/hooks/resolver/useResolverStatus'
import { safeDateObj } from '@app/utils/date'

import type { Name } from './useAvailablePrimaryNamesForAddress'

const isMigratedName = (n: Pick<Name, 'isMigrated'>) => n.isMigrated === null || !!n.isMigrated

const isNotTLD = (n: Pick<Name, 'name'>) => n.name.split('.').length > 1

const isResolvedOrManagedName = (
  n: Pick<Name, 'isResolvedAddress' | 'isController' | 'isWrappedOwner'>,
) => n.isResolvedAddress || n.isController || n.isWrappedOwner

const isNotPrimaryName = (primaryName?: string | null) => (n: Pick<Name, 'name'>) =>
  !primaryName || n.name !== primaryName

const isNotExpired = (n: Pick<Name, 'expiryDate'>) => {
  const now = Date.now()
  const date = safeDateObj(n.expiryDate)
  return !date || date.getTime() > now
}

type ResolverStatus = ReturnType<typeof useResolverStatus>['data']
const isAuthorized =
  (resolverStatus: ResolverStatus) =>
  (n: Pick<Name, 'fuses' | 'isWrappedOwner' | 'isResolvedAddress'>) => {
    if (
      !n.isResolvedAddress &&
      n.isWrappedOwner &&
      n.fuses?.child.CANNOT_SET_RESOLVER &&
      resolverStatus
    ) {
      return resolverStatus.isAuthorized
    }
    return true
  }

export const checkAvailablePrimaryName =
  (primaryName?: string | null, resolverStatus?: ResolverStatus) =>
  (
    name: Pick<
      Name,
      | 'isMigrated'
      | 'isController'
      | 'isRegistrant'
      | 'isWrappedOwner'
      | 'isResolvedAddress'
      | 'name'
      | 'expiryDate'
      | 'fuses'
    >,
  ) =>
    isMigratedName(name) &&
    isNotTLD(name) &&
    isResolvedOrManagedName(name) &&
    isNotPrimaryName(primaryName)(name) &&
    isNotExpired(name) &&
    isAuthorized(resolverStatus)(name)

export const mergeNames = (namesA: Name[], namesB: Name[]) => {
  const mergedNamesMap = [...namesA, ...namesB].reduce<{ [key: string]: Name }>((acc, curr) => {
    const exitingName = acc[curr.name]
    if (exitingName)
      acc[curr.name] = {
        ...exitingName,
        ...curr,
        isRegistrant: exitingName.isRegistrant || curr.isRegistrant,
        isController: exitingName.isController || curr.isController,
        isWrappedOwner: exitingName.isWrappedOwner || curr.isWrappedOwner,
        isResolvedAddress: exitingName.isResolvedAddress || curr.isResolvedAddress,
      }
    else acc[curr.name] = curr
    return acc
  }, {})
  return Object.values(mergedNamesMap)
}
