import { getSupportedChainById } from '@app/constants/chains'

export const shouldOpenModal = (
  connectedChainName: number | undefined,
  accountChainId: number | undefined,
): boolean => {
  if (!connectedChainName || !accountChainId) return false
  if (!getSupportedChainById(accountChainId)) return false
  return connectedChainName !== accountChainId
}
