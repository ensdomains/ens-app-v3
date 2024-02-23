import { mockFunction } from '@app/test-utils'

import type { Address } from 'viem'
import { useAccount, useChainId, useConfig } from 'wagmi'

import { SupportedChain } from '@app/constants/chains'
import { ClientWithEns } from '@app/types'

const mockUseChainId = mockFunction(useChainId)
const mockUseAccount = mockFunction(useAccount)
const mockUseConfig = mockFunction(useConfig)

/**
 * @dev This function assumes `wagmi` is already mocked.
 */
export const useMockedUseQueryOptions = ({
  chainId = 1,
  address = '0x1234',
  client = {},
}: {
  chainId: SupportedChain['id']
  address: Address
  client: Partial<ClientWithEns>
}) => {
  mockUseChainId.mockReturnValue(chainId)
  mockUseAccount.mockReturnValue({ address })
  mockUseConfig.mockReturnValue({ getClient: () => client })
}
