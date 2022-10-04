import { useQuery } from 'wagmi'

import { namehash } from '@ensdomains/ensjs/utils/normalise'

import { useEns } from '@app/utils/EnsProvider'

const query = `
  query getResolverExists($id: String!) {
    resolver(id: $id) {
      id
    }
  }
`

const useResolverExists = (name: string, address: string) => {
  const { ready, gqlInstance } = useEns()
  const { data, isLoading } = useQuery(
    ['getResolverExists', name, 'graph'],
    async () => {
      const { resolver } = await gqlInstance.request(query, { id: `${address}-${namehash(name)}` })
      return !!resolver
    },
    {
      enabled: ready && name !== '',
    },
  )

  return {
    data,
    isLoading,
  }
}

export default useResolverExists
