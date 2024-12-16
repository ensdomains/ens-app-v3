import { getChainsFromUrl, getSupportedChainById } from '@app/constants/chains'

export const shouldOpenModal = (
  connectedChainName: string | undefined,
  connectedChainId: number | undefined,
) => {
  if (!connectedChainName) return
  if (!getSupportedChainById(connectedChainId)) return

  const currentChain = getChainsFromUrl()?.[0]
  if (!currentChain?.id) return

  if (currentChain?.id === connectedChainId) {
    return false
  }
  if (currentChain?.id !== connectedChainId) {
    return true
  }
}
