import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

import { useEns } from '@app/utils/EnsProvider'

export const useExists = (name: string, skip?: any) => {
  const { ready, getOwner } = useEns()

  const [exists, setExists] = useState(false)

  const {
    data,
    isLoading: loading,
    status,
  } = useQuery(['getOwner', name], () => getOwner(name), {
    enabled: ready && !skip && name !== '',
  })

  useEffect(() => {
    if (data) {
      setExists(true)
    }
  }, [ready, name, skip, data])

  return { exists, loading, status }
}
