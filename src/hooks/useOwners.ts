import { useMemo } from 'react'

import { GetDnsOwnerReturnType } from '@ensdomains/ensjs/dns'

import { useBasicName } from '@app/hooks/useBasicName'
import { OwnerArray } from '@app/types'

import { DEFAULT_ABILITIES, type useAbilities } from './abilities/useAbilities'

type BasicNameReturnType = ReturnType<typeof useBasicName>

type UseOwnersParameters = {
  ownerData: BasicNameReturnType['ownerData']
  wrapperData: BasicNameReturnType['wrapperData']
  dnsOwner?: GetDnsOwnerReturnType
  abilities?: ReturnType<typeof useAbilities>['data']
}

export const useOwners = ({
  ownerData,
  wrapperData,
  dnsOwner,
  abilities = DEFAULT_ABILITIES,
}: UseOwnersParameters) => {
  const owners = useMemo(() => {
    const _owners: OwnerArray = []
    if (wrapperData) {
      const isPCCBurned = !!wrapperData?.fuses.parent.PARENT_CANNOT_CONTROL
      _owners.push({
        address: wrapperData.owner!,
        canTransfer: isPCCBurned ? abilities.canSendOwner : abilities.canSendManager,
        transferType: isPCCBurned ? 'owner' : 'manager',
        label: isPCCBurned ? 'name.owner' : 'name.manager',
        description: isPCCBurned ? 'details.descriptions.owner' : 'details.descriptions.manager',
        testId: isPCCBurned ? 'owner-button-owner' : 'owner-button-manager',
      })
    } else {
      if (ownerData?.owner) {
        _owners.push({
          address: ownerData?.owner,
          canTransfer: abilities.canSendManager,
          transferType: 'manager',
          label: 'name.manager',
          description: 'details.descriptions.controller',
          testId: 'owner-button-owner',
        })
      }
      if (ownerData?.registrant) {
        _owners.push({
          address: ownerData.registrant,
          canTransfer: abilities.canSendOwner,
          transferType: 'owner',
          label: 'name.owner',
          description: 'details.descriptions.registrant',
          testId: 'owner-button-registrant',
        })
      }
    }
    if (dnsOwner) {
      _owners.push({
        address: dnsOwner,
        canTransfer: false,
        label: 'name.dnsOwner',
        description: 'details.descriptions.dnsOwner',
        testId: 'owner-button-dnsOwner',
      })
    }

    return _owners
  }, [ownerData, wrapperData, abilities, dnsOwner])

  return owners
}
