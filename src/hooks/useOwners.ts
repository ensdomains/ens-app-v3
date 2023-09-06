import { useMemo } from 'react'

import { GetDnsOwnerReturnType } from '@ensdomains/ensjs/dns'
import { GetOwnerReturnType, GetWrapperDataReturnType } from '@ensdomains/ensjs/public'

import { OwnerArray } from '@app/types'

import { DEFAULT_ABILITIES, type useAbilities } from './abilities/useAbilities'

type Props = {
  ownerData: GetOwnerReturnType
  wrapperData: GetWrapperDataReturnType
  dnsOwner?: GetDnsOwnerReturnType
  abilities?: ReturnType<typeof useAbilities>['data']
}

export const useOwners = ({
  ownerData,
  wrapperData,
  dnsOwner,
  abilities = DEFAULT_ABILITIES,
}: Props) => {
  const owners = useMemo(() => {
    const _owners: OwnerArray = []
    if (ownerData?.ownershipLevel === 'nameWrapper') {
      _owners.push({
        address: ownerData.owner!,
        canTransfer: abilities.canSend,
        transferType: 'owner',
        label: wrapperData?.fuses.parent.PARENT_CANNOT_CONTROL ? 'name.owner' : 'name.manager',
        description: 'details.descriptions.owner',
        testId: 'owner-button-owner',
      })
    } else {
      if (ownerData?.owner) {
        _owners.push({
          address: ownerData?.owner,
          canTransfer: abilities.canSend,
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
