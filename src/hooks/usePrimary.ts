import { useEns } from '@app/utils/EnsProvider'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'

export const usePrimary = (address: string, skip?: any) => {
  const { ready, getName } = useEns()
  const [name, setName] = useState<null | string>(null)

  const {
    data: _name,
    isLoading: loading,
    status,
  } = useQuery(['getName', address], () => getName(address), {
    enabled: ready && !skip && address !== '',
  })

  useEffect(() => {
    if (_name && _name.match) {
      setName(_name.name)
    } else {
      setName(null)
    }
  }, [_name])

  return { name, loading: !ready || loading, status }
}
