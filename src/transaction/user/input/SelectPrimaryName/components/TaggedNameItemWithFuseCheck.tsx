import { ComponentProps, useMemo } from 'react'

import { TaggedNameItem } from '@app/components/@atoms/NameDetailItem/TaggedNameItem'
import { useResolverStatus } from '@app/hooks/resolver/useResolverStatus'

type Props = ComponentProps<typeof TaggedNameItem>
export const TaggedNameItemWithFuseCheck = (props: Props) => {
  const { relation, fuses, name } = props
  const skip =
    relation?.resolvedAddress || !relation?.wrappedOwner || !fuses?.child.CANNOT_SET_RESOLVER

  const resolverStatus = useResolverStatus({ name: name!, enabled: !skip })

  const isFuseCheckSuccess = useMemo(() => {
    if (skip) return true
    return resolverStatus.data?.isAuthorized ?? false
  }, [skip, resolverStatus.data])

  if (isFuseCheckSuccess) return <TaggedNameItem {...props} />
  return null
}
