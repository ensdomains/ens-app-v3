import { useEffect, useState } from 'react'
import { ethers } from 'ethers'

type EthereumNetworkStatus = 'unknown' | 'valid' | 'invalid'

export const useEthereumNetworkStatus = (): EthereumNetworkStatus => {
  const [status, setStatus] = useState<EthereumNetworkStatus>('unknown')

  useEffect(() => {
    let provider: ethers.providers.Web3Provider
    const acceptedNetworks: string[] =
      process.env.NEXT_PUBLIC_ACCEPTED_ETHEREUM_NETWORKS?.split(',') || []

    const eventHandler = (newNetwork: any) => {
      const name = newNetwork?.name
      if (!name) setStatus('unknown')
      else if (acceptedNetworks.includes(name)) setStatus('valid')
      else setStatus('invalid')
    }
    if (window.ethereum) {
      provider = new ethers.providers.Web3Provider(
        window.ethereum as any,
        'any',
      )
      provider.on('network', eventHandler)
    }

    return () => {
      if (provider) provider.off('network', eventHandler)
    }
  }, [setStatus])
  return status
}
