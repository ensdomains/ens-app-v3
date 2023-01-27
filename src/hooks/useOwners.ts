import { useMemo } from 'react'

import { ReturnedENS } from '@app/types'

import { useSelfAbilities } from './useSelfAbilities'

type Props = {
  ownerData: Exclude<ReturnedENS['getOwner'], undefined>
  wrapperData: Exclude<ReturnedENS['getWrapperData'], undefined>
  dnsOwner: Exclude<ReturnedENS['getDNSOwner'], undefined>
  selfAbilities: ReturnType<typeof useSelfAbilities>
}

const useOwners = ({ ownerData, wrapperData, dnsOwner, selfAbilities }: Props) => {
  const owners = useMemo(() => {
    const _owners: {
      address: string
      label: string
      description: string
      canTransfer: boolean
      transferType?: 'manager' | 'owner'
      testId: string
    }[] = []
    if (ownerData?.ownershipLevel === 'nameWrapper') {
      _owners.push({
        address: ownerData.owner!,
        canTransfer: selfAbilities.canSend,
        transferType: 'owner',
        label: wrapperData?.parent.PARENT_CANNOT_CONTROL ? 'name.owner' : 'name.manager',
        description: 'details.descriptions.owner',
        testId: 'owner-button-owner',
      })
    } else {
      if (ownerData?.owner) {
        _owners.push({
          address: ownerData?.owner,
          canTransfer: selfAbilities.canSend,
          transferType: 'manager',
          label: 'name.manager',
          description: 'details.descriptions.controller',
          testId: 'owner-button-owner',
        })
      }
      if (ownerData?.registrant) {
        _owners.push({
          address: ownerData.registrant,
          canTransfer: selfAbilities.canSendOwner,
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
  }, [ownerData, wrapperData, selfAbilities, dnsOwner])

  return owners
}

export default useOwners
