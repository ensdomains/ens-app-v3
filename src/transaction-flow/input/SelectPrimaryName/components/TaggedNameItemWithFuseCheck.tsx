import { ComponentProps, useMemo } from 'react'

import { TaggedNameItem } from '@app/components/@atoms/NameDetailItem/TaggedNameItem'
import { useResolverStatus } from '@app/hooks/resolver/useResolverStatus'

type Props = { isResolvedAddress?: boolean } & ComponentProps<typeof TaggedNameItem>
export const TaggedNameItemWithFuseCheck = ({ isResolvedAddress, ...props }: Props) => {
  const skip = isResolvedAddress || !props.isWrappedOwner || !props.fuses?.child.CANNOT_SET_RESOLVER

  const resolverStatus = useResolverStatus(props.name, { enabled: !skip })

  const isFuseCheckSuccess = useMemo(() => {
    if (skip) return true
    return resolverStatus.data?.isAuthorized ?? false
  }, [skip, resolverStatus.data])

  if (isFuseCheckSuccess) return <TaggedNameItem {...props} />
  return null
}
