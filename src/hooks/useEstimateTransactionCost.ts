import { useMemo } from 'react'
import { useFeeData } from 'wagmi'
import {ethers} from "ethers";

const gasLimitDictionary = {
  COMMIT: 42000,
  RENEW: 61818,
}

const useEstimateTransactionCost = (...transactions: (keyof typeof gasLimitDictionary)[]) => {
  const { data: feeData, isLoading } = useFeeData()

  const data = useMemo(() => {
    if (!feeData || isLoading) return undefined
    const { maxFeePerGas } = feeData

    // if (!maxFeePerGas) throw new Error('Fee data not found')
    // if (!maxFeePerGas) maxFeePerGas = ethers.BigNumber.from(100)

    const totalGasLimit = transactions
      .map((transaction) => gasLimitDictionary[transaction])
      .reduce((a, b) => a + b)
    const transactionFee = (maxFeePerGas || ethers.BigNumber.from(100)).mul(totalGasLimit)
    return {
      transactionFee,
      gasPrice: maxFeePerGas,
      gasLimit: totalGasLimit,
    }
  }, [transactions, feeData, isLoading])

  return {
    data,
    isLoading,
  }
}

export default useEstimateTransactionCost
