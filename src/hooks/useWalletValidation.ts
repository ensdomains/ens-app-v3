import { useEffect } from 'react'
import { useAccount, useDisconnect, useNetwork } from 'wagmi/react'

import { validateChainId } from '../utils/security/web3.js'

export const useWalletValidation = () => {
  const { chain } = useNetwork()
  const { address } = useAccount()
  const { disconnect } = useDisconnect()

  useEffect(() => {
    if (chain && !validateChainId(chain.id)) {
      disconnect()
      console.warn('Unsupported network detected - disconnecting wallet')
    }
  }, [chain, disconnect])

  useEffect(() => {
    if (address && !/^0x[0-9a-fA-F]{40}$/.test(address)) {
      disconnect()
      console.warn('Invalid wallet address detected - disconnecting wallet')
    }
  }, [address, disconnect])
}
