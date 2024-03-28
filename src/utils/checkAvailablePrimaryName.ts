import { NameWithRelation } from '@ensdomains/ensjs/subgraph'

import type { useResolverStatus } from '@app/hooks/resolver/useResolverStatus'
import { safeDateObj } from '@app/utils/date'

type CheckPrimaryNameInputName = Pick<
  NameWithRelation,
  'name' | 'isMigrated' | 'fuses' | 'relation'
> & { expiryDate: Date | undefined }

const isMigratedName = (n: Pick<CheckPrimaryNameInputName, 'isMigrated'>) =>
  n.isMigrated === null || !!n.isMigrated

const isNotTLD = (n: Pick<CheckPrimaryNameInputName, 'name'>) =>
  n.name ? n.name.split('.').length > 1 : false

const isResolvedOrManagedName = ({
  relation: { owner, resolvedAddress, wrappedOwner },
}: Pick<CheckPrimaryNameInputName, 'relation'>) => owner || wrappedOwner || resolvedAddress

const isNotPrimaryName =
  (primaryName?: string | null) => (n: Pick<CheckPrimaryNameInputName, 'name'>) =>
    !primaryName || n.name !== primaryName

const isNotExpired = (n: Pick<CheckPrimaryNameInputName, 'expiryDate'>) => {
  const now = Date.now()
  const date = safeDateObj(n.expiryDate)
  return !date || date.getTime() > now
}

type ResolverStatus = ReturnType<typeof useResolverStatus>['data']
const isAuthorized =
  (resolverStatus: ResolverStatus) =>
  (n: Pick<CheckPrimaryNameInputName, 'fuses' | 'relation'>) => {
    if (
      !n.relation.resolvedAddress &&
      n.relation.wrappedOwner &&
      n.fuses?.child.CANNOT_SET_RESOLVER &&
      resolverStatus
    ) {
      return resolverStatus.isAuthorized
    }
    return true
  }

export const checkAvailablePrimaryName =
  (primaryName?: string | null, resolverStatus?: ResolverStatus) =>
  (name: CheckPrimaryNameInputName) =>
    isMigratedName(name) &&
    isNotTLD(name) &&
    isResolvedOrManagedName(name) &&
    isNotPrimaryName(primaryName)(name) &&
    isNotExpired(name) &&
    isAuthorized(resolverStatus)(name)
