import { getChainsFromUrl, getSupportedChainById } from '@app/constants/chains'

export const shouldOpenModal = (
  connectedChainName: string | undefined,
  connectedChainId: number | undefined,
): boolean => {
  if (!connectedChainName) return false
  if (!getSupportedChainById(connectedChainId)) return false

  const currentChain = getChainsFromUrl()?.[0]
  if (!currentChain?.id) return false

  if (currentChain?.id === connectedChainId) {
    return false
  }
  if (currentChain?.id !== connectedChainId) {
    return true
  }

  return false
}
