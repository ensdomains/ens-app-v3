import { useBasicName, UseBasicNameOptions } from '@app/hooks/useBasicName'
import { parentName } from '@app/utils/name'

export const useParentBasicName = ({ name, enabled, ...otherProps }: UseBasicNameOptions) => {
  const parentName_ = parentName(name)
  // So far the use of this hook is for the wrapper data which does not rely on the graph so
  // it is safe to skip the graph
  return useBasicName({ name: parentName_, ...otherProps })
}
