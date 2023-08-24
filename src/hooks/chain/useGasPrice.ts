import { useEffect, useState } from 'react'
import { useFeeData } from 'wagmi'

export const useGasPrice = () => {
  const { data, isLoading, isFetching } = useFeeData({ watch: true })
  const [gasPrice, setGasPrice] = useState<bigint | undefined>(undefined)

  useEffect(() => {
    if (data) {
      setGasPrice(data.lastBaseFeePerGas! + data.maxPriorityFeePerGas!)
    }
  }, [data])

  return { gasPrice, isLoading, isFetching }
}
