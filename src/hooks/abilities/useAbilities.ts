import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { checkETH2LDFromName } from '@app/utils/utils'

import { useResolverIsAuthorized } from '../resolver/useResolverIsAuthorized'
import { useAccountSafely } from '../useAccountSafely'
import { useBasicName } from '../useBasicName'
import { useHasSubnames } from '../useHasSubnames'
import { getDeleteAbilities } from './utils/getDeleteAbilities'
import { getEditAbilities } from './utils/getEditAbilities'
import { getReclaimAbilities } from './utils/getReclaimAbilities'
import { getSendAbilities } from './utils/getSendAbilities'

type ExtendAbilities = {
  canExtend: boolean
}

export type DeleteAbilities = {
  canDelete: boolean
  canDeleteContract?: 'nameWrapper' | 'registry'
  canDeleteRequiresWrap?: boolean
  canDeleteMethod?: 'setRecord' | 'setSubnodeOwner'
  isPCCBurned?: boolean
  isParentOwner?: boolean
  canDeleteError?: string
}

export type EditAbilities = {
  canEdit: boolean
  canEditRecords: boolean
  canEditResolver: boolean
  canEditPermissions: boolean
  canCreateSubdomains: boolean
  canEditTTL: boolean
}

export type ReclaimAbilities = {
  canReclaim: boolean
}

export type SendAbilities = {
  canSend: boolean
  canSendOwner: boolean
  canSendManager: boolean
  sendNameFunctionCallDetails?: {
    sendOwner?: {
      contract: 'registry' | 'nameWrapper' | 'baseRegistrar'
      method: 'safeTransferFrom'
    }
    sendManager?: {
      contract: 'registry' | 'nameWrapper' | 'baseRegistrar'
      method: 'safeTransferFrom' | 'reclaim' | 'setOwner' | 'setSubnodeOwner'
    }
  }
  canSendError?: string
}

export type Abilities = ExtendAbilities &
  DeleteAbilities &
  EditAbilities &
  ReclaimAbilities &
  SendAbilities

export const DEFAULT_ABILITIES: Abilities = {
  canExtend: false,
  canDelete: false,
  canEdit: false,
  canEditRecords: false,
  canEditResolver: false,
  canEditPermissions: false,
  canCreateSubdomains: false,
  canEditTTL: false,
  canReclaim: false,
  canSend: false,
  canSendOwner: false,
  canSendManager: false,
}

export const useAbilities = (name: string) => {
  const { t } = useTranslation('profile')
  const parent = name?.split('.')?.slice(1).join('.')

  const { address } = useAccountSafely()

  const basicNameData = useBasicName(name, { skipGraph: false, enabled: !!name && !!address })

  const resolverAuthorisation = useResolverIsAuthorized(name, {
    enabled: !!name && !!address,
  })

  const parentBasicNameData = useBasicName(parent, {
    skipGraph: false,
    enabled: !!parent && !!address,
  })

  // useHasSubnames checks internally if name exists & if it is subname before it enables itself
  const hasSubnamesData = useHasSubnames(name)

  const isLoading =
    basicNameData.isLoading || parentBasicNameData.isLoading || hasSubnamesData.isLoading

  const isCachedData = basicNameData.isCachedData || hasSubnamesData.isCachedData

  const data: Abilities | undefined = useMemo(() => {
    if (!name || !address || isLoading) return DEFAULT_ABILITIES
    return {
      canExtend: !!name && checkETH2LDFromName(name),
      ...getSendAbilities({ name, address, basicNameData, parentBasicNameData }),
      ...getEditAbilities({
        address,
        basicNameData,
        hasAuthorisedResolver: resolverAuthorisation.data?.isAuthorized,
      }),
      ...getDeleteAbilities({
        name,
        address,
        basicNameData,
        parentBasicNameData,
        hasSubnames: hasSubnamesData.hasSubnames!,
        t,
      }),
      ...getReclaimAbilities({
        address,
        basicNameData,
        parentBasicNameData,
      }),
    }
  }, [
    name,
    address,
    basicNameData,
    parentBasicNameData,
    isLoading,
    resolverAuthorisation.data?.isAuthorized,
    hasSubnamesData.hasSubnames,
    t,
  ])

  return {
    data,
    isLoading,
    isCachedData,
  }
}
