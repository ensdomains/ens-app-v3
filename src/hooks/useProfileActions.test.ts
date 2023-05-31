import { fireEvent, mockFunction, render, renderHook, screen } from '@app/test-utils'

import { usePrimary } from '@app/hooks/usePrimary'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'

import { useHasGlobalError } from './errors/useHasGlobalError'
import { useProfileActions } from './useProfileActions'

jest.mock('@app/hooks/usePrimary')
jest.mock('@app/transaction-flow/TransactionFlowProvider')
jest.mock('./errors/useHasGlobalError')

const mockUsePrimary = mockFunction(usePrimary)
const mockUseTransactionFlow = mockFunction(useTransactionFlow)
const mockUseHasGlobalError = mockFunction(useHasGlobalError)

describe('useProfileActions', () => {
  const props = {
    name: 'testname',
    address: '0x1234567890',
    profile: {
      address: '0x1234567890',
    },
    selfAbilities: {
      canEdit: true,
    },
    subnameAbilities: {
      canDelete: true,
      canDeleteContract: 'testcontract',
      canDeleteMethod: 'testmethod',
      canDeleteError: null,
      canReclaim: true,
      isPCCBurned: false,
    },
  }

  beforeEach(() => {
    mockUsePrimary.mockReturnValue({
      loading: false,
      name: null,
      status: 'success',
    })
    mockUseTransactionFlow.mockReturnValue({
      prepareDataInput: () => () => {},
      createTransactionFlow: () => () => {},
    })
    mockUseHasGlobalError.mockReturnValue(false)
  })

  it('returns an object with profileActions and loading properties', () => {
    const { result } = renderHook(() => useProfileActions(props))
    expect(result.current).toHaveProperty('profileActions')
    expect(result.current).toHaveProperty('loading')
  })

  it('returns an empty array for profileActions if address is falsy', () => {
    const { result } = renderHook(() => useProfileActions({ ...props, address: '' }))
    expect(result.current.profileActions).toEqual([])
  })

  it('returns an empty array for profileActions if isLoading is true', () => {
    mockUsePrimary.mockReturnValue({
      loading: true,
      name: null,
      status: 'success',
    })
    const { result } = renderHook(() => useProfileActions({ ...props, isLoading: true }))
    expect(result.current.profileActions).toEqual([])
  })

  it('returns the correct action if selfAbilities.canEdit is true', () => {
    const { result } = renderHook(() => useProfileActions(props))
    expect(result.current.profileActions).toContainEqual(
      expect.objectContaining({
        label: 'tabs.profile.actions.setAsPrimaryName.label',
        onClick: expect.any(Function),
      }),
    )
  })

  it('returns the correct action if subnameAbilities.canDelete is true', () => {
    const { result } = renderHook(() => useProfileActions(props))
    expect(result.current.profileActions).toContainEqual(
      expect.objectContaining({
        label: 'tabs.profile.actions.deleteSubname.label',
        onClick: expect.any(Function),
      }),
    )
  })

  it('returns the correct action if subnameAbilities.canReclaim is true', () => {
    const { result } = renderHook(() => useProfileActions(props))
    expect(result.current.profileActions).toContainEqual(
      expect.objectContaining({
        label: 'tabs.profile.actions.reclaim.label',
        onClick: expect.any(Function),
      }),
    )
  })

  it('should return the correct copy when subnameAbilities.canDeleteError has a string value', () => {
    const { result } = renderHook(() =>
      useProfileActions({
        ...props,
        subnameAbilities: {
          ...props.subnameAbilities,
          canDelete: false,
          canDeleteError: 'test error',
        },
      }),
    )
    expect(result.current.profileActions).toContainEqual(
      expect.objectContaining({
        label: 'tabs.profile.actions.deleteSubname.label',
        tooltipContent: 'test error',
      }),
    )
  })
})
