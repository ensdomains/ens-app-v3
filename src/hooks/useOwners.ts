import { useMemo } from 'react'

import { GetDnsOwnerReturnType } from '@ensdomains/ensjs/dns'

import { useBasicName } from '@app/hooks/useBasicName'
import { OwnerArray } from '@app/types'

import { DEFAULT_ABILITIES, type useAbilities } from './abilities/useAbilities'

type BasicNameReturnType = ReturnType<typeof useBasicName>

type UseOwnersParameters = {
  ownerData: BasicNameReturnType['ownerData']
  wrapperData: BasicNameReturnType['wrapperData']
  registrationStatus: BasicNameReturnType['registrationStatus']
  dnsOwner?: GetDnsOwnerReturnType
  abilities?: ReturnType<typeof useAbilities>['data']
}

export const useOwners = ({
  ownerData,
  wrapperData,
  dnsOwner,
  abilities = DEFAULT_ABILITIES,
  registrationStatus,
}: UseOwnersParameters) => {
  const owners = useMemo(() => {
    const _owners: OwnerArray = []
    // if (wrapperData) {
    //   if (ownerData?.owner === nameWrapperAddress) {
    //     _owners.push({
    //       address: wrapperData!.owner,
    //       canTransfer: abilities.canSendOwner,
    //       transferType: 'owner',
    //       label: 'name.owner',
    //       description: 'details.descriptions.owner',
    //       testId: 'owner-button-owner',
    //     })
    //   }
    // } else
    if (wrapperData) {
      _owners.push({
        address: wrapperData.owner!,
        canTransfer: abilities.canSendOwner,
        transferType: 'owner',
        label: wrapperData?.fuses.parent.PARENT_CANNOT_CONTROL ? 'name.owner' : 'name.manager',
        description: 'details.descriptions.owner',
        testId: 'owner-button-owner',
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
