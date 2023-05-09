import type { BigNumber } from '@ethersproject/bignumber'
import { useEffect, useState } from 'react'
import { useFeeData } from 'wagmi'

const useGasPrice = () => {
  const { data, isLoading, isFetching } = useFeeData({ watch: true })
  const [gasPrice, setGasPrice] = useState<BigNumber | undefined>(undefined)

  useEffect(() => {
    if (data) {
      setGasPrice(data.lastBaseFeePerGas?.add(data.maxPriorityFeePerGas!))
    }
  }, [data])

  return { gasPrice, isLoading, isFetching }
}

export default useGasPrice
