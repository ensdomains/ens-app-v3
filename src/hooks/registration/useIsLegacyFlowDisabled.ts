import { useChainName } from '@app/hooks/chain/useChainName'
import { getManagerBaseUrl } from '@app/utils/getManagerBaseUrl'

import { useIsEthRegistrarControllerActive } from './useIsEthRegistrarControllerActive'

/**
 * Whether this (legacy) app's registration / renewal flows should be replaced
 * with a redirect to the new Manager app.
 *
 * - Mainnet: always disabled. Users are sent to app.ens.domains.
 * - Other chains: disabled once the legacy ETHRegistrarController has been
 *   removed from BaseRegistrarImplementation (e.g. Sepolia post ENS v2 beta),
 *   in which case users are sent to sepolia.app.ens.domains.
 */
export const useIsLegacyFlowDisabled = () => {
  const chainName = useChainName()
  const { data: isControllerActive, isLoading: isControllerActiveLoading } =
    useIsEthRegistrarControllerActive()

  const isMainnet = chainName === 'mainnet'

  return {
    isDisabled: isMainnet || isControllerActive === false,
    isLoading: !isMainnet && isControllerActiveLoading,
    isMainnet,
    managerBaseUrl: getManagerBaseUrl(chainName),
  }
}
