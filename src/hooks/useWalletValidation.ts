import { useEffect } from 'react'
import { useAccount, useDisconnect, useChainId } from 'wagmi'

import { validateChainId } from '../utils/security/web3'

export const useWalletValidation = () => {
  const chainId = useChainId()
  const { address } = useAccount()
  const { disconnect } = useDisconnect()

  useEffect(() => {
    if (chainId && !validateChainId(chainId)) {
      disconnect()
      console.warn('Unsupported network detected - disconnecting wallet')
    }
  }, [chainId, disconnect])

  useEffect(() => {
    if (address && !/^0x[0-9a-fA-F]{40}$/.test(address)) {
      disconnect()
      console.warn('Invalid wallet address detected - disconnecting wallet')
    }
  }, [address, disconnect])
}
