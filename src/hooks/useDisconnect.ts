import { useConfig } from 'wagmi'
import { disconnect as disconnectWagmi } from 'wagmi/actions'

const LOCAL_STORAGE_KEYS = ['rk-latest-id', 'wagmi.recentConnectorId', 'wagmi.store']

export const useDisconnect = () => {
  const config = useConfig()
  const disconnect = async () => {
    await disconnectWagmi(config)
    LOCAL_STORAGE_KEYS.forEach((key) => {
      localStorage.removeItem(key)
    })
  }

  return {
    disconnect,
  }
}
