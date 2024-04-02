import { useBasicName, UseBasicNameOptions } from '@app/hooks/useBasicName'
import { parentName } from '@app/utils/name'

export const useParentBasicName = ({ name, enabled, ...otherProps }: UseBasicNameOptions) => {
  const parentName_ = parentName(name)
  return useBasicName({ name: parentName_, ...otherProps })
}
