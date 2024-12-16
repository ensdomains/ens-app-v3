import { getChainsFromUrl, getSupportedChainById } from '@app/constants/chains'

export const shouldOpenModal = (
  connectedChainName: string | undefined,
  connectedChainId: number | undefined,
  setOpen: (open: boolean) => void,
) => {
  if (!connectedChainName) return
  if (!getSupportedChainById(connectedChainId)) return

  const currentChain = getChainsFromUrl()?.[0]
  if (!currentChain?.id) return

  if (currentChain?.id === connectedChainId) {
    setOpen(false)
    return
  }
  if (currentChain?.id !== connectedChainId) {
    setOpen(true)
  }
}
