import { useMemo } from 'react'

import { checkETH2LDFromName, checkSubname } from '@app/utils/utils'

import { useResolverIsAuthorized } from '../resolver/useResolverIsAuthorized'
import { useAccountSafely } from '../useAccountSafely'
import { useBasicName } from '../useBasicName'
import { useHasSubnames } from '../useHasSubnames'
import { getEditAbilities } from './utils/getEditAbilities'
import { getSendAbilities } from './utils/getSendAbilities'

export const useAbilities = (name: string) => {
  const parent = name?.split('.')?.slice(1).join('.')
  const isSubname = checkSubname(name)
  const { address } = useAccountSafely()
  const basicNameData = useBasicName(name, { skipGraph: false })
  const resolverAuthorisation = useResolverIsAuthorized(name, {
    enabled: !!name && basicNameData.wrapperData?.child.CANNOT_SET_RESOLVER,
  })
  const parentBasicNameData = useBasicName(parent, { skipGraph: false, enabled: !!parent })

  const hasSubnamesData = useHasSubnames(name)

  const isLoading =
    basicNameData.isLoading || parentBasicNameData.isLoading || hasSubnamesData.isLoading

  const data = useMemo(() => {
    if (isLoading) return undefined
    return {
      canExtend: checkETH2LDFromName(name),
      ...getSendAbilities({ name, address, basicNameData, parentBasicNameData }),
      ...getEditAbilities({
        address,
        basicNameData,
        hasAuthorisedResolver: resolverAuthorisation.data?.isAuthorized,
      }),
    }
  }, [])
  return {
    data,
    isLoading,
  }
}
