import { useQuery } from '@tanstack/react-query'
import { useProvider } from 'wagmi'
import { ethers } from 'ethers'
import { useEns } from '@app/utils/EnsProvider'
import AggregatorInterface from '@ensdomains/ens-contracts/build/contracts/AggregatorInterface.json'

export const useEthPrice = () => {
  const oracleens = 'eth-usd.data.eth'
  const provider = useProvider()
  const { getProfile, ready } = useEns()
  const {
    data,
    error,
    isLoading: loading,
    isFetching: fetching,
  } = useQuery(
    ['use-eth-price'],
    async () => {
      const profile = await getProfile(oracleens, {})
      if (!profile?.address) throw new Error('Contract address not found')
      const oracle = new ethers.Contract(profile.address, AggregatorInterface, provider)
      const latest = await oracle.latestAnswer()
      return latest.toNumber() / 100000000
    },
    {
      enabled: !!provider && ready,
    },
  )
  return {
    data,
    error,
    loading,
    fetching,
  }
}
