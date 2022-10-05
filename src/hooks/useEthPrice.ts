import { BigNumber, ethers } from 'ethers'
import { useProvider, useQuery } from 'wagmi'

import AggregatorInterface from '@ensdomains/ens-contracts/build/contracts/AggregatorInterface.json'

import { useEns } from '@app/utils/EnsProvider'

const ORACLE_ENS = 'eth-usd.data.eth'

export const useEthPrice = () => {
  const provider = useProvider()
  const { getAddr, ready } = useEns()
  const { data, isLoading: loading } = useQuery(
    ['use-eth-price'],
    async () => {
      const address = await getAddr(ORACLE_ENS)
      if (!address) throw new Error('Contract address not found')
      if (typeof address !== 'string') throw new Error('Contract address is wrong type')
      const oracle = new ethers.Contract(address, AggregatorInterface, provider)
      const latest = (await oracle.latestAnswer()) as BigNumber
      return latest
    },
    {
      enabled: !!provider && ready,
    },
  )
  return {
    data,
    loading,
  }
}
