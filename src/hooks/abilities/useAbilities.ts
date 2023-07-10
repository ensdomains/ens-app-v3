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

export const useAbilities = (name: string) => {
  const { t } = useTranslation('profile')
  const parent = name?.split('.')?.slice(1).join('.')

  const { address } = useAccountSafely()
  const basicNameData = useBasicName(name, { skipGraph: false })
  const resolverAuthorisation = useResolverIsAuthorized(name, {
    enabled: !!name && basicNameData.wrapperData?.child.CANNOT_SET_RESOLVER,
  })
  const parentBasicNameData = useBasicName(parent, { skipGraph: false, enabled: !!parent })

  const hasSubnamesData = useHasSubnames(name)

  const isLoading =
    basicNameData.isLoading || parentBasicNameData.isLoading || hasSubnamesData.isLoading

  const isCachedData = basicNameData.isCachedData || hasSubnamesData.isCachedData

  const data = useMemo(() => {
    if (!name) return undefined
    if (isLoading) return undefined
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

  console.log('useAbilities', data)
  return {
    data,
    isLoading,
    isCachedData,
  }
}
