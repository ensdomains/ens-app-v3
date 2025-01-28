import { Hash } from 'viem'
import { mainnet, sepolia, holesky } from 'wagmi/chains'

const SUPPORTED_CHAINS = [mainnet.id, sepolia.id, holesky.id]

export const validateChainId = (chainId: number): boolean => {
  return SUPPORTED_CHAINS.includes(chainId)
}

export const validateTransactionData = (data: { to: string; value?: bigint; data?: string }) => {
  if (!data.to || !/^0x[a-fA-F0-9]{40}$/.test(data.to)) {
    throw new Error('Invalid recipient address')
  }
  
  if (data.value && data.value < 0n) {
    throw new Error('Invalid transaction value')
  }

  if (data.data && !/^0x[a-fA-F0-9]*$/.test(data.data)) {
    throw new Error('Invalid transaction data')
  }

  return true
}

export const validateTransactionHash = (hash: Hash): boolean => {
  return /^0x[a-fA-F0-9]{64}$/.test(hash)
}

export const HIGH_RISK_VALUE_THRESHOLD = 1000000000000000000n // 1 ETH

export const isHighRiskTransaction = (data: { value?: bigint }): boolean => {
  return !!data.value && data.value >= HIGH_RISK_VALUE_THRESHOLD
}
