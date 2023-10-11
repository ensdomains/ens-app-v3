import { useOwner } from './ensjs/public/useOwner'

type UseIsWrappedParameters = {
  name: string
  enabled?: boolean
}

export const useIsWrapped = ({ name, enabled = true }: UseIsWrappedParameters) => {
  const { data: ownerData, ...query } = useOwner({ name, enabled })

  return {
    data: ownerData ? ownerData.ownershipLevel === 'nameWrapper' : undefined,
    ...query,
  }
}
