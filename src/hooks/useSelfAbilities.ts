import { useMemo } from 'react'

import type { ENS } from '@ensdomains/ensjs'

import { useBasicName } from '@app/hooks/useBasicName'

export const useSelfAbilities = (
  address: string | undefined,
  ownerData: Awaited<ReturnType<ENS['getOwner']>> | undefined,
  name?: string,
) => {
  const parent = name?.split('.')?.slice(1)?.join('.')
  const { ownerData: parentOwnerData } = useBasicName(parent)

  return useMemo(() => {
    const abilities = {
      canEdit: false,
      canSend: false,
      canExtend: false,
      canChangeOwner: false,
      canChangeRegistrant: false,
    }
    if (!address || !ownerData) return abilities
    abilities.canExtend = true
    if (address === ownerData.owner) {
      abilities.canSend = true
    }
    if (address === parentOwnerData?.registrant || address === parentOwnerData?.owner) {
      abilities.canSend = true
    }
    if (
      ownerData.registrant === address ||
      (!ownerData.registrant && ownerData.owner === address)
    ) {
      abilities.canSend = true
      abilities.canChangeOwner = true
      abilities.canChangeRegistrant = true
    }
    if (ownerData.owner === address) {
      abilities.canEdit = true
      abilities.canChangeOwner = true
    }
    return abilities
  }, [address, ownerData, parentOwnerData])
}
