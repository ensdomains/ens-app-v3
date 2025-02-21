import { getSupportedChainById } from '@app/constants/chains'

export const shouldOpenModal = (
  connectedChainId: number | undefined,
  accountChainId: number | undefined,
): boolean => {
  if (!connectedChainId || !accountChainId) return false
  if (!getSupportedChainById(accountChainId)) return false
  return connectedChainId !== accountChainId
}
