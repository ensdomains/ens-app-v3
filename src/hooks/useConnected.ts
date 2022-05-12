import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'

export const useConnected = () => {
  const { data: accountData } = useAccount()
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    if (accountData?.address) {
      setConnected(true)
    } else {
      setConnected(false)
    }
  }, [accountData?.address])

  return connected
}
