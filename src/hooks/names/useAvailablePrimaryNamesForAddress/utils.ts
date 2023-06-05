import { safeDateObj } from '@app/utils/date'

import type { Name } from './useAvailablePrimaryNamesForAddress'

const isMigratedName = (n: Name) => n.isMigrated

const isNotTLD = (n: Name) => n.name.split('.').length > 1

const isResolvedOrManagedName = (n: Name) =>
  n.isResolvedAddress || n.isController || n.isWrappedOwner

const isNotPrimaryName = (primaryName?: string | null) => (n: Name) =>
  !primaryName || n.name !== primaryName

const isNotExpired = (n: Name) => {
  const now = Date.now()
  const date = safeDateObj(n.expiryDate)
  return !date || date.getTime() > now
}

export const isAvailablePrimaryName = (primaryName?: string | null) => (name: Name) =>
  isMigratedName(name) &&
  isNotTLD(name) &&
  isResolvedOrManagedName(name) &&
  isNotPrimaryName(primaryName)(name) &&
  isNotExpired(name)

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
