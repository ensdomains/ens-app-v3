import { zorbImageDataURI } from '@app/utils/gradient'
import { useMemo } from 'react'

export const useZorb = (input: string, type: 'address' | 'name' | 'hash') => {
  const zorb = useMemo(() => zorbImageDataURI(input, type), [input, type])
  return zorb
}
