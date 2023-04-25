import { useMemo } from 'react'
import { useFeeData } from 'wagmi'

const useGasPrice = () => {
  const { data, isLoading, isFetching } = useFeeData({ watch: true })
  const gasPrice = useMemo(() => {
    if (!data) return undefined
    return data.lastBaseFeePerGas?.add(data.maxPriorityFeePerGas!)
  }, [data])

  return { gasPrice, isLoading, isFetching }
}

export default useGasPrice
