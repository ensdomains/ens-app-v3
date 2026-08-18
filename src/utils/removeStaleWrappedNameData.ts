import { Address } from 'viem'

import { NameWithRelation } from '@ensdomains/ensjs/subgraph'

/**
 * The subgraph does not receive an event when a wrapped name expires, so when an
 * expired wrapped name is re-registered unwrapped, the stale `WrappedDomain` entity
 * (`fuses`/`wrappedOwner`) remains attached to the domain. This makes previously
 * wrapped names display as wrapped (greyed out owner, missing manager) on the
 * address/my names pages, and show up in the previous owner's name list.
 *
 * A name is only genuinely wrapped if its registry owner is the NameWrapper
 * contract itself, so any wrapped data on a name owned by another address is
 * stale and can be safely discarded.
 *
 * Ref: WEB-613 / https://github.com/ensdomains/ens-subgraph/pull/93
 */
export const removeStaleWrappedNameData = ({
  names,
  nameWrapperAddress,
}: {
  names: NameWithRelation[]
  nameWrapperAddress?: Address
}): NameWithRelation[] => {
  if (!nameWrapperAddress) return names

  return names.flatMap((name) => {
    const hasWrappedData = !!name.fuses || !!name.wrappedOwner
    const isActuallyWrapped = name.owner.toLowerCase() === nameWrapperAddress.toLowerCase()
    if (!hasWrappedData || isActuallyWrapped) return [name]

    const cleanedName: NameWithRelation = {
      ...name,
      fuses: null,
      wrappedOwner: null,
      // if there is no registration, the expiry date was derived from the stale
      // `WrappedDomain` entity, so it is also stale
      expiryDate: name.registrationDate ? name.expiryDate : null,
      relation: { ...name.relation, wrappedOwner: false },
    }

    // if the stale wrapped owner was the only relation the name had to the
    // address, the name no longer belongs in the list at all
    const { owner, registrant, resolvedAddress } = cleanedName.relation
    if (!owner && !registrant && !resolvedAddress) return []

    return [cleanedName]
  })
}
