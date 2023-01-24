import { BigNumber } from '@ethersproject/bignumber/lib/bignumber'
import { Contract } from '@ethersproject/contracts'
import { useProvider, useQuery } from 'wagmi'

import AggregatorInterface from '@ensdomains/ens-contracts/build/contracts/AggregatorInterface.json'

import { useChainId } from '@app/hooks/useChainId'
import { useEns } from '@app/utils/EnsProvider'

const ORACLE_ENS = 'eth-usd.data.eth'
const ORACLE_GOERLI = '0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e'

export const useEthPrice = () => {
  const provider = useProvider()
  const { getAddr, ready } = useEns()
  const chainId = useChainId()

  const { data, isLoading: loading } = useQuery(
    ['use-eth-price'],
    async () => {
      let address
      // Goerli
      if (chainId === 5) {
        address = ORACLE_GOERLI
      } else {
        address = await getAddr(ORACLE_ENS)
      }
      if (!address) throw new Error('Contract address not found')
      if (typeof address !== 'string') throw new Error('Contract address is wrong type')
      const oracle = new Contract(address, AggregatorInterface, provider)
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
