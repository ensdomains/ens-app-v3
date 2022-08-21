import { zorbImageDataURI } from '@app/utils/gradient'
import { useQuery } from 'wagmi'

export const useZorb = (input: string, type: 'address' | 'name' | 'hash') => {
  const { data: zorb } = useQuery(['zorb', input, type], () => zorbImageDataURI(input, type))
  return zorb
}
