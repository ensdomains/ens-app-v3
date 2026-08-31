import { mockFunction, render, screen, waitFor } from '@app/test-utils'

import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useContractAddress } from '@app/hooks/chain/useContractAddress'
import { useEffectiveResolverAddress } from '@app/hooks/resolver/useEffectiveResolverAddress'
import { useIsWrapped } from '@app/hooks/useIsWrapped'
import { useProfile } from '@app/hooks/useProfile'

import { makeMockIntersectionObserver } from '../../../../test/mock/makeMockIntersectionObserver'

import { EditResolver } from './EditResolver-flow'

vi.mock('@app/hooks/useProfile')
vi.mock('@app/hooks/useIsWrapped')
vi.mock('@app/hooks/chain/useContractAddress')
vi.mock('@app/hooks/resolver/useEffectiveResolverAddress')
vi.mock('@app/hooks/useResolverHasInterfaces', () => ({
  useResolverHasInterfaces: () => ({ errors: undefined, isLoading: false }),
}))

const mockUseProfile = mockFunction(useProfile)
const mockUseIsWrapped = mockFunction(useIsWrapped)
const mockUseContractAddress = mockFunction(useContractAddress)
const mockUseEffectiveResolverAddress = mockFunction(useEffectiveResolverAddress)

const latestResolver = '0xF29100983E058B709F3D539b0c765937B804AC15'
/** The ENSv2 composite mirror the registry reports for an abstracted name. */
const mirror = '0x1000000000000000000000000000000000000001'

const renderEditResolver = () =>
  render(
    <EditResolver
      data={{ name: 'test.eth' }}
      dispatch={vi.fn()}
      onDismiss={vi.fn()}
      transactions={[]}
    />,
  )

describe('EditResolver', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseIsWrapped.mockReturnValue({ data: false })
    mockUseContractAddress.mockReturnValue(latestResolver)
    makeMockIntersectionObserver()
  })

  it('does not offer to switch an abstracted name to the resolver it already uses', async () => {
    // The registry reports the mirror, but the resolver actually holding the
    // records is already the latest one. Judging by the mirror would preselect
    // "switch to latest", and confirming that replaces the abstraction.
    mockUseProfile.mockReturnValue({ data: { resolverAddress: mirror }, isLoading: false })
    mockUseEffectiveResolverAddress.mockReturnValue({
      data: latestResolver,
      isLoading: false,
      isFetching: false,
      isError: false,
      isAbstracted: true,
    })

    renderEditResolver()

    await waitFor(() =>
      expect(screen.getByTestId('custom-resolver-radio')).toBeChecked(),
    )
    expect(screen.getByTestId('latest-resolver-radio')).not.toBeChecked()
  })

  it('still offers the latest resolver when the name is genuinely on an older one', async () => {
    const olderResolver = '0x2000000000000000000000000000000000000002'
    mockUseProfile.mockReturnValue({ data: { resolverAddress: olderResolver }, isLoading: false })
    mockUseEffectiveResolverAddress.mockReturnValue({
      data: olderResolver,
      isLoading: false,
      isFetching: false,
      isError: false,
      isAbstracted: false,
    })

    renderEditResolver()

    await waitFor(() => expect(screen.getByTestId('latest-resolver-radio')).toBeChecked())
  })

  it('does not preselect switching resolver when the lookup failed', async () => {
    // A failed lookup leaves the reported (mirror) address in play, so the
    // latest-resolver comparison is not trustworthy; preselecting the switch
    // would put a one-confirm path to replacing the abstraction behind a
    // transient RPC error.
    mockUseProfile.mockReturnValue({ data: { resolverAddress: mirror }, isLoading: false })
    mockUseEffectiveResolverAddress.mockReturnValue({
      data: mirror,
      isLoading: false,
      isFetching: false,
      isError: true,
      isAbstracted: false,
    })

    renderEditResolver()

    await waitFor(() => expect(screen.getByTestId('custom-resolver-radio')).toBeChecked())
    expect(screen.getByTestId('latest-resolver-radio')).not.toBeChecked()
  })
})
