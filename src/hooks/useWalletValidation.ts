import { useEffect } from 'react'
import { useAccount, useNetwork, useDisconnect } from 'wagmi'
import { validateChainId } from '@/utils/security/web3'

export const useWalletValidation = () => {
  const { chain } = useNetwork()
  const { address } = useAccount()
  const { disconnect } = useDisconnect()

  useEffect(() => {
    if (chain && !validateChainId(chain.id)) {
      disconnect()
      window.alert('Please connect to a supported network (Mainnet, Sepolia, or Holesky)')
    }
  }, [chain, disconnect])

  useEffect(() => {
    if (address && !/^0x[0-9a-fA-F]{40}$/.test(address)) {
      disconnect()
      window.alert('Invalid wallet address detected')
    }
  }, [address, disconnect])
}
