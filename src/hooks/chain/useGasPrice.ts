import { useFeeData } from 'wagmi'

export const useGasPrice = () => {
  // TODO: check to see why useFeeData is returning strings instead of bigints
  const { data, isLoading, isFetching } = useFeeData({ watch: true })

  const gasPrice =
    data && data.lastBaseFeePerGas && data.maxPriorityFeePerGas
      ? BigInt(data.lastBaseFeePerGas) + BigInt(data.maxPriorityFeePerGas)
      : undefined

  return { gasPrice, isLoading, isFetching }
}
