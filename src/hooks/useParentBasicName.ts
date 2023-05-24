import { useBasicName } from '@app/hooks/useBasicName'

const useParentBasicName = (name: string) => {
  const nameParts = name.split('.')
  const parentName = nameParts.slice(1).join('.')

  const isValidParent = parentName.split('.').length > 1

  const validParentName = isValidParent ? parentName : ''

  // So far the use of this hook is for the wrapper data which does not rely on the graph so
  // it is safe to skip the graph
  return useBasicName(validParentName, { skipGraph: true })
}

export default useParentBasicName
