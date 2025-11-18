import type { Address, Chain } from 'viem'

import type { Register } from '@app/local-contracts'
import { LocalhostChainWithEnsAndContracts } from '@app/overrides/addEnsContractsWithSubgraphAndOverrides'
import { makeLocalhostChainWithEns } from '@app/utils/chains/makeLocalhostChainWithEns'

type AdditionalContracts = {
  wrappedRenewalWithReferrer: { address: Address }
}

/**
 * Wrapper function for makeLocalhostChainWithEns that allows additional contract overrides.
 *
 * This function adds contract address overrides to the localhost chain configuration,
 * providing a central location for managing custom contract addresses alongside the
 * standard ENS contracts for local development.
 *
 * @param localhost - The localhost chain configuration
 * @param deploymentAddresses - Contract addresses from local deployment
 * @returns Chain with ENS contracts and overrides for localhost
 */
export const makeLocalhostChainWithEnsAndOverrides = <const T extends Chain>(
  localhost: T,
  deploymentAddresses: Register['deploymentAddresses'],
): LocalhostChainWithEnsAndContracts<T, AdditionalContracts> => {
  const chainWithEns = makeLocalhostChainWithEns(localhost, deploymentAddresses)

  return {
    ...chainWithEns,
    contracts: {
      ...chainWithEns.contracts,
      ensBulkRenewal: {
        address: deploymentAddresses.WrappedStaticBulkRenewal as Address,
      },
      wrappedRenewalWithReferrer: {
        address: deploymentAddresses.UniversalRegistrarRenewalWithReferrer as Address,
      },
    },
  } as LocalhostChainWithEnsAndContracts<T, AdditionalContracts>
}
