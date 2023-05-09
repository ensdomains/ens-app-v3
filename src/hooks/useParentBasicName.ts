import { useBasicName } from '@app/hooks/useBasicName'

const useParentBasicName = (name: string) => {
  const nameParts = name.split('.')
  const parentName = nameParts.slice(1).join('.')

  const isValidParent = parentName.split('.').length > 1

  const validParentName = isValidParent ? parentName : ''
  return useBasicName(validParentName, { skipGraph: true})
}

export default useParentBasicName
