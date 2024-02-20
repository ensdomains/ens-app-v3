import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { checkETH2LDFromName } from '@app/utils/utils'

import { useAccountSafely } from '../account/useAccountSafely'
import { useResolverIsAuthorised } from '../resolver/useResolverIsAuthorised'
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
      contract: 'registry' | 'nameWrapper' | 'registrar'
      method: 'safeTransferFrom'
    }
    sendManager?: {
      contract: 'registry' | 'nameWrapper' | 'registrar'
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

type UseAbilitiesParameters = {
  name: string
  enabled?: boolean
}

export const useAbilities = ({ name, enabled = true }: UseAbilitiesParameters) => {
  const { t } = useTranslation('profile')
  const parent = name?.split('.')?.slice(1).join('.')

  const { address } = useAccountSafely()

  const basicNameData = useBasicName({ name, enabled: enabled && !!name && !!address })

  const resolverAuthorisation = useResolverIsAuthorised({
    name,
    enabled: enabled && !!name && !!address,
  })

  const parentBasicNameData = useBasicName({
    name: parent,
    enabled: enabled && !!parent && !!address,
  })

  // useHasSubnames checks internally if name exists & if it is subname before it enables itself
  const hasSubnamesData = useHasSubnames(name)

  const isLoading =
    !address ||
    basicNameData.isLoading ||
    parentBasicNameData.isLoading ||
    hasSubnamesData.isLoading ||
    resolverAuthorisation.isLoading

  const isCachedData =
    basicNameData.isCachedData ||
    hasSubnamesData.isCachedData ||
    resolverAuthorisation.isCachedData ||
    parentBasicNameData.isCachedData

  const data: Abilities | undefined = useMemo(
    () => {
      if (!name || !address) return DEFAULT_ABILITIES
      return {
        canExtend: !!name && checkETH2LDFromName(name),
        ...getSendAbilities({
          name,
          address,
          basicNameData,
          parentBasicNameData,
        }),
        ...getEditAbilities({
          address,
          basicNameData,
          hasAuthorisedResolver: resolverAuthorisation.data?.isAuthorised,
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
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      name,
      address,
      basicNameData.ownerData,
      basicNameData.wrapperData,
      basicNameData.pccExpired,
      parentBasicNameData.ownerData,
      parentBasicNameData.wrapperData,
      isLoading,
      resolverAuthorisation.data?.isAuthorised,
      hasSubnamesData.hasSubnames,
      t,
    ],
  )

  return {
    data,
    isLoading,
    isCachedData,
  }
}
