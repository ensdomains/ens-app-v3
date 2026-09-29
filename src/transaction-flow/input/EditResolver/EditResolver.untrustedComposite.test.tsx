import { mockFunction, render, screen, waitFor } from '@app/test-utils'

import { beforeEach, describe, expect, it, vi } from 'vitest'

import { KNOWN_RESOLVER_DATA } from '@app/constants/resolverAddressData'
import { useContractAddress } from '@app/hooks/chain/useContractAddress'
import { useUnderlyingResolver } from '@app/hooks/resolver/useUnderlyingResolver'
import { useIsWrapped } from '@app/hooks/useIsWrapped'
import { useProfile } from '@app/hooks/useProfile'

import { makeMockIntersectionObserver } from '../../../../test/mock/makeMockIntersectionObserver'

import { EditResolver } from './EditResolver-flow'

vi.mock('@app/hooks/useProfile')
vi.mock('@app/hooks/useIsWrapped')
vi.mock('@app/hooks/chain/useContractAddress')
vi.mock('@app/hooks/resolver/useUnderlyingResolver')
vi.mock('@app/hooks/useResolverHasInterfaces', () => ({
  useResolverHasInterfaces: () => ({ errors: undefined, isLoading: false }),
}))

const mockUseProfile = mockFunction(useProfile)
const mockUseIsWrapped = mockFunction(useIsWrapped)
const mockUseContractAddress = mockFunction(useContractAddress)
const mockUseUnderlyingResolver = mockFunction(useUnderlyingResolver)

const latestResolver = KNOWN_RESOLVER_DATA['1']![0].address
/** An arbitrary registry resolver claiming to be a composite mirror. */
const attackerResolver = '0xa11ce000000000000000000000000000000a11ce'

const renderEditResolver = () =>
  render(
    <EditResolver
      data={{ name: 'test.eth' }}
      dispatch={vi.fn()}
      onDismiss={vi.fn()}
      transactions={[]}
    />,
  )

describe('EditResolver untrusted composite claim', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseIsWrapped.mockReturnValue({ data: false })
    mockUseContractAddress.mockReturnValue(latestResolver)
    mockUseProfile.mockReturnValue({
      data: { resolverAddress: attackerResolver },
      isLoading: false,
    })
    mockUseUnderlyingResolver.mockReturnValue({
      data: latestResolver,
      isLoading: false,
      isFetching: false,
      isError: false,
    })
    makeMockIntersectionObserver()
  })

  it('keeps the latest-resolver repair available when an unknown resolver names the public resolver', async () => {
    // Honouring the probe would make the form think the name is already on the
    // latest resolver: "Use latest resolver" is disabled, and typing the
    // Public Resolver as custom is rejected as "This is the current resolver",
    // while the registry still points at the attacker contract.
    renderEditResolver()

    await waitFor(() => expect(screen.getByTestId('latest-resolver-radio')).toBeEnabled())
    expect(screen.getByTestId('latest-resolver-radio')).toBeChecked()
    expect(screen.getByTestId('custom-resolver-radio')).not.toBeChecked()
  })
})
