import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'

export const useAccountSafely = () => {
  const {
    address: _address,
    isConnecting: _isConnecting,
    isReconnecting: _isReconnecting,
  } = useAccount()

  const [address, setAddress] = useState<string | undefined>()
  useEffect(() => {
    setAddress(_address)
  }, [_address])

  const [isConnecting, setIsConnecting] = useState(false)
  useEffect(() => {
    setIsConnecting(_isConnecting)
  }, [_isConnecting])

  const [isReconnecting, setIsReconnecting] = useState(false)
  useEffect(() => {
    setIsReconnecting(_isReconnecting)
  }, [_isReconnecting])

  return { address, isConnecting, isReconnecting }
}
