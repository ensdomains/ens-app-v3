import { mockFunction, renderHook } from '@app/test-utils'

import { labelhash } from '@ensdomains/ensjs/utils/labels'

import { usePrimary } from '@app/hooks/usePrimary'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'

import { useHasGlobalError } from './errors/useHasGlobalError'
import { useProfileActions } from './useProfileActions'

const mockUseResolverStatus = jest.fn().mockReturnValue({
  data: {
    isAuthorized: true,
  },
  isLoading: false,
})
jest.mock('@app/hooks/resolver/useResolverStatus', () => ({
  useResolverStatus: () => mockUseResolverStatus(),
}))
jest.mock('@app/hooks/usePrimary')
jest.mock('@app/transaction-flow/TransactionFlowProvider')
jest.mock('./errors/useHasGlobalError')

const mockUsePrimary = mockFunction(usePrimary)
const mockUseTransactionFlow = mockFunction(useTransactionFlow)
const mockUseHasGlobalError = mockFunction(useHasGlobalError)

const mockCreateTransactionFlow = jest.fn()
const mockPrepareDataInput = jest.fn()

describe('useProfileActions', () => {
  const props: any = {
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
    ownerData: {
      ownershipLevel: 'nameWrapper',
    },
    chainId: 1,
  }

  beforeEach(() => {
    mockUsePrimary.mockReturnValue({
      data: { name: undefined, beautifiedName: undefined },
      isLoading: false,
      status: 'success',
    })
    mockUseTransactionFlow.mockReturnValue({
      prepareDataInput:
        () =>
        (...args: any[]) =>
          mockPrepareDataInput(...args),
      createTransactionFlow: (...args: any[]) => mockCreateTransactionFlow(...args),
    })
    mockUseHasGlobalError.mockReturnValue(false)
  })

  afterEach(() => {
    jest.clearAllMocks()
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
      data: { name: undefined, beautifiedName: undefined },
      isLoading: true,
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

  describe('set primary name', () => {
    it('should return an action for a single transaction with base mock data', () => {
      const { result } = renderHook(() => useProfileActions(props))
      const setPrimaryAction = result.current.profileActions?.find(
        (action: any) => action.label === 'tabs.profile.actions.setAsPrimaryName.label',
      )
      setPrimaryAction?.onClick()
      expect(mockCreateTransactionFlow).toHaveBeenCalled()
      expect(mockCreateTransactionFlow.mock.calls[0][0]).toBe(
        'setPrimaryName-testname-0x1234567890',
      )
      expect(mockCreateTransactionFlow.mock.calls[0][1].transactions.length).toBe(1)
    })

    it('should not return an action if profile address does not match user address and selfAbility canEdit is false', () => {
      const { result } = renderHook(() =>
        useProfileActions({
          ...props,
          profile: {
            address: '0xotheraddress',
          },
          selfAbilities: {
            ...props.selfAbilites,
            canEdit: false,
          },
        }),
      )
      const setPrimaryAction = result.current.profileActions?.find(
        (action: any) => action.label === 'tabs.profile.actions.setAsPrimaryName.label',
      )
      expect(setPrimaryAction).toBeUndefined()
    })

    it('should return an action if profile address matches user address and selfAbility canEdit is false', () => {
      const { result } = renderHook(() =>
        useProfileActions({
          ...props,
          profile: {
            address: '0x1234567890',
          },
          selfAbilities: {
            ...props.selfAbilites,
            canEdit: false,
          },
        }),
      )
      const setPrimaryAction = result.current.profileActions?.find(
        (action: any) => action.label === 'tabs.profile.actions.setAsPrimaryName.label',
      )
      expect(setPrimaryAction).toBeDefined()
    })

    it('should return an action if profile address != user address if selfAbility canEdit is true', () => {
      const { result } = renderHook(() =>
        useProfileActions({
          ...props,
          profile: {
            address: '0xotheraddress',
          },
          selfAbilities: {
            ...props.selfAbilites,
            canEdit: true,
          },
        }),
      )
      const setPrimaryAction = result.current.profileActions?.find(
        (action: any) => action.label === 'tabs.profile.actions.setAsPrimaryName.label',
      )
      expect(setPrimaryAction).toBeDefined()
    })

    it('should return not return action if primary name matches current name', () => {
      mockUsePrimary.mockReturnValueOnce({
        data: { name: 'testname' },
        isLoading: false,
      })
      const { result } = renderHook(() => useProfileActions(props))
      const setPrimaryAction = result.current.profileActions?.find(
        (action: any) => action.label === 'tabs.profile.actions.setAsPrimaryName.label',
      )
      expect(setPrimaryAction).toBeUndefined()
    })

    it('should return an action with 2 transaction steps if profile address does not match user address', () => {
      const { result } = renderHook(() =>
        useProfileActions({
          ...props,
          profile: {
            address: '0xotheraddress',
          },
          selfAbilities: {
            ...props.selfAbilites,
            canEdit: true,
          },
        }),
      )
      const setPrimaryAction = result.current.profileActions?.find(
        (action: any) => action.label === 'tabs.profile.actions.setAsPrimaryName.label',
      )
      setPrimaryAction?.onClick()
      expect(mockCreateTransactionFlow).toHaveBeenCalled()
      expect(mockCreateTransactionFlow.mock.calls[0][1].transactions.length).toBe(2)
    })

    it('should return an action with 3 transaction steps if profile address does not match user address and resolver is not authorized', () => {
      mockUseResolverStatus.mockReturnValueOnce({
        data: { isAuthorised: false },
        isLoading: false,
      })
      const { result } = renderHook(() =>
        useProfileActions({
          ...props,
          profile: {
            address: '0xotheraddress',
          },
          selfAbilities: {
            ...props.selfAbilites,
            canEdit: true,
          },
        }),
      )
      const setPrimaryAction = result.current.profileActions?.find(
        (action: any) => action.label === 'tabs.profile.actions.setAsPrimaryName.label',
      )
      setPrimaryAction?.onClick()
      expect(mockCreateTransactionFlow).toHaveBeenCalled()
      expect(mockCreateTransactionFlow.mock.calls[0][1].transactions.length).toBe(3)
    })

    it('should return an action that triggers unknownLable input if name is encrypted', () => {
      const { result } = renderHook(() =>
        useProfileActions({
          ...props,
          name: `[${labelhash('test').slice(2)}].eth`,
        }),
      )
      const setPrimaryAction = result.current.profileActions?.find(
        (action: any) => action.label === 'tabs.profile.actions.setAsPrimaryName.label',
      )
      setPrimaryAction?.onClick()
      expect(mockPrepareDataInput).toHaveBeenCalled()
      expect(mockPrepareDataInput.mock.calls[0][0]).toBe(
        `setPrimaryName-[${labelhash('test').slice(2)}].eth-0x1234567890`,
      )
      expect(mockPrepareDataInput.mock.calls[0][1].transactionFlowItem.transactions.length).toEqual(
        1,
      )
    })
  })
})
