import { useDisconnect, UseDisconnectParameters } from 'wagmi'

const LOCAL_STORAGE_KEYS = ['rk-latest-id', 'wagmi.recentConnectorId', 'wagmi.store']

export const useDisconnectWithReset = (parameters: UseDisconnectParameters = {}) => {
  const { disconnect } = useDisconnect({
    mutation: {
      ...parameters,
      onSettled: () => {
        LOCAL_STORAGE_KEYS.forEach((key) => {
          localStorage.removeItem(key)
        })
      },
    },
  })

  return disconnect
}
