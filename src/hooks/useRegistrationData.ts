import { useQuery } from 'wagmi'

import { labelhash } from '@ensdomains/ensjs/utils/labels'

import { useEns } from '@app/utils/EnsProvider'
import { useQueryKeys } from '@app/utils/cacheKeyFactory'
import { checkETH2LDFromName } from '@app/utils/utils'

const query = `
  query getNameDates($id: String!) {
    registration(id: $id) {
      registrationDate
    }
    nameRegistereds(first: 1, orderBy: blockNumber, orderDirection: desc, where: { registration: $id }) {
      transactionID
    }
  }
`

const useRegistrationData = (name: string) => {
  const { ready, gqlInstance } = useEns()
  const is2LDEth = checkETH2LDFromName(name)
  const {
    data,
    isLoading,
    status,
    isFetchedAfterMount,
    isFetched,
    // don't remove this line, it updates the isCachedData state (for some reason) but isn't needed to verify it
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isFetching: _isFetching,
  } = useQuery(
    useQueryKeys().registrationDate(name),
    async () =>
      gqlInstance.client.request<{
        registration?: {
          registrationDate: string
        }
        nameRegistereds: {
          transactionID: string
        }[]
      }>(query, {
        id: labelhash(name.split('.')[0]),
      }),
    {
      enabled: ready && is2LDEth,
      select: (queryResult) => {
        if (!queryResult?.registration) return null
        return {
          registrationDate: new Date(parseInt(queryResult.registration.registrationDate) * 1000),
          transactionHash: queryResult.nameRegistereds[0]?.transactionID,
        }
      },
    },
  )

  return {
    data: is2LDEth ? data : null,
    isLoading,
    isCachedData: status === 'success' && isFetched && !isFetchedAfterMount,
  }
}

export default useRegistrationData
