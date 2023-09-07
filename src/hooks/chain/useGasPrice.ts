import { useFeeData } from 'wagmi'

export const useGasPrice = () => {
  const { data, isLoading, isFetching } = useFeeData({ watch: true })

  const gasPrice = data ? data?.lastBaseFeePerGas! + data?.maxPriorityFeePerGas! : undefined

  return { gasPrice, isLoading, isFetching }
}
