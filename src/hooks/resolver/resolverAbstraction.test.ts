import { mockFunction, renderHook } from '@app/test-utils'

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useEstimateGas } from 'wagmi'

import { KNOWN_RESOLVER_DATA } from '@app/constants/resolverAddressData'
import { useContractAddress } from '@app/hooks/chain/useContractAddress'
import { useProfileEditorReducer } from '@app/transaction-flow/input/ProfileEditor/hooks/useProfileEditorReducer'

import { useIsWrapped } from '../useIsWrapped'
import { useProfile } from '../useProfile'
import { useResolverHasInterfaces } from '../useResolverHasInterfaces'
import { useRegistryResolver } from './useRegistryResolver'
import { useResolverStatus } from './useResolverStatus'
import { useUnderlyingResolver } from './useUnderlyingResolver'

// Only the edges are mocked: the chain reads, and the abstraction probe itself.
// Everything between them — useEffectiveResolverAddress, useResolverType,
// useResolverIsAuthorised, useResolverStatus and the ProfileEditor reducer —
// runs for real, because the bug this covers lives in how they compose.
vi.mock('wagmi', async (importOriginal) => ({
  ...(await importOriginal<typeof import('wagmi')>()),
  useEstimateGas: vi.fn(),
}))
vi.mock('@app/hooks/useProfile')
vi.mock('@app/hooks/useIsWrapped')
vi.mock('@app/hooks/useResolverHasInterfaces')
vi.mock('@app/hooks/resolver/useRegistryResolver')
vi.mock('@app/hooks/resolver/useUnderlyingResolver')
vi.mock('@app/hooks/chain/useContractAddress')

const mockUseEstimateGas = mockFunction(useEstimateGas)
const mockUseProfile = mockFunction(useProfile)
const mockUseIsWrapped = mockFunction(useIsWrapped)
const mockUseResolverHasInterfaces = mockFunction(useResolverHasInterfaces)
const mockUseRegistryResolver = mockFunction(useRegistryResolver)
const mockUseUnderlyingResolver = mockFunction(useUnderlyingResolver)
const mockUseContractAddress = mockFunction(useContractAddress)

const latestResolverAddress = KNOWN_RESOLVER_DATA['1']![0].address
/** An ENSv2 abstraction contract standing in front of the name's real resolver. */
const abstractionAddress = '0x1111111111111111111111111111111111111111'
const unknownResolverAddress = '0x2222222222222222222222222222222222222222'

const name = 'test.eth'

const renderEditorView = ({ isWrapped }: { isWrapped: boolean }) => {
  const { result: status } = renderHook(() => useResolverStatus({ name }))
  const { result: editor } = renderHook(() =>
    useProfileEditorReducer(
      {
        profile: { isMigrated: true, resolverAddress: abstractionAddress } as never,
        resolverStatus: status.current.data,
        isWrapped,
        isLoading: status.current.isLoading,
      },
      {},
    ),
  )
  const [state] = editor.current
  return { status: status.current, view: state.stack[state.stack.length - 1] }
}

beforeEach(() => {
  vi.clearAllMocks()
  // The registry points the name at the ENSv2 abstraction contract.
  mockUseProfile.mockReturnValue({
    data: { isMigrated: true, resolverAddress: abstractionAddress },
    isLoading: false,
  })
  mockUseRegistryResolver.mockReturnValue({
    data: abstractionAddress,
    isLoading: false,
    isSuccess: true,
  })
  mockUseIsWrapped.mockReturnValue({ data: false, isLoading: false })
  mockUseContractAddress.mockReturnValue(latestResolverAddress)
  mockUseEstimateGas.mockReturnValue({ isLoading: false })
  mockUseResolverHasInterfaces.mockReturnValue({ data: [false], isLoading: false })
  mockUseUnderlyingResolver.mockReturnValue({
    data: latestResolverAddress,
    isLoading: false,
    isFetching: false,
  })
})

describe('resolver abstraction layer', () => {
  it('treats an abstracted name with the latest underlying resolver as ready to edit', () => {
    const { status, view } = renderEditorView({ isWrapped: false })
    expect(status.data).toMatchObject({
      hasResolver: true,
      hasLatestResolver: true,
      isOutdatedResolver: false,
      hasValidResolver: true,
      isAuthorized: true,
      isNameWrapperAware: true,
    })
    expect(view).toBe('editor')
  })

  it('does not send a wrapped abstracted name to the name-wrapper-aware prompt', () => {
    mockUseIsWrapped.mockReturnValue({ data: true, isLoading: false })
    const { status, view } = renderEditorView({ isWrapped: true })
    expect(status.data).toMatchObject({ isNameWrapperAware: true })
    expect(view).toBe('editor')
  })

  it('still prompts to update the resolver when the underlying resolver is unusable', () => {
    mockUseUnderlyingResolver.mockReturnValue({
      data: unknownResolverAddress,
      isLoading: false,
      isFetching: false,
    })
    const { status, view } = renderEditorView({ isWrapped: false })
    expect(status.data).toMatchObject({
      hasLatestResolver: false,
      hasValidResolver: false,
      isAuthorized: false,
    })
    expect(view).toBe('invalidResolver')
  })

  it('keeps a name with no resolver at all on the noResolver view', () => {
    mockUseProfile.mockReturnValue({
      data: { isMigrated: true, resolverAddress: undefined },
      isLoading: false,
    })
    mockUseUnderlyingResolver.mockReturnValue({ data: null, isLoading: false, isFetching: false })
    const { view } = renderEditorView({ isWrapped: false })
    expect(view).toBe('noResolver')
  })

  it('does not judge the name while the abstraction probe is in flight', () => {
    mockUseUnderlyingResolver.mockReturnValue({
      data: undefined,
      isLoading: true,
      isFetching: true,
    })
    const { status, view } = renderEditorView({ isWrapped: false })
    expect(status).toMatchObject({ data: undefined, isLoading: true })
    expect(view).toBe('loading')
  })

  it('behaves exactly as before for a name with no abstraction layer', () => {
    mockUseProfile.mockReturnValue({
      data: { isMigrated: true, resolverAddress: latestResolverAddress },
      isLoading: false,
    })
    mockUseRegistryResolver.mockReturnValue({
      data: latestResolverAddress,
      isLoading: false,
      isSuccess: true,
    })
    // An ordinary v1 resolver has no `getResolver`, so the probe reverts.
    mockUseUnderlyingResolver.mockReturnValue({ data: null, isLoading: false, isFetching: false })
    const { status, view } = renderEditorView({ isWrapped: false })
    expect(status.data).toMatchObject({
      hasResolver: true,
      hasLatestResolver: true,
      hasValidResolver: true,
      isAuthorized: true,
      isNameWrapperAware: true,
    })
    expect(view).toBe('editor')
  })
})
