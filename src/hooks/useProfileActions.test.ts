import { mockFunction, renderHook } from '@app/test-utils'

import { labelhash } from '@ensdomains/ensjs/utils/labels'

import { usePrimary } from '@app/hooks/usePrimary'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'

import { useHasGlobalError } from './errors/useHasGlobalError'
import { useProfileActions } from './useProfileActions'
import useWrapperApprovedForAll from './useWrapperApprovedForAll'

const NOW_TIMESTAMP = 1588994800000
jest.spyOn(Date, 'now').mockImplementation(() => NOW_TIMESTAMP)

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
jest.mock('./useWrapperApprovedForAll')

const mockUsePrimary = mockFunction(usePrimary)
const mockUseTransactionFlow = mockFunction(useTransactionFlow)
const mockUseHasGlobalError = mockFunction(useHasGlobalError)
const mockUseWrapperApprovedForAll = mockFunction(useWrapperApprovedForAll)

const mockCreateTransactionFlow = jest.fn()
const mockPrepareDataInput = jest.fn()

describe('useProfileActions', () => {
  const props: any = {
    name: 'test.eth',
    address: '0x1234567890',
    profile: {
      address: '0x1234567890',
      isMigrated: true,
    },
    abilities: {
      canEdit: true,
      canDelete: true,
      canDeleteContract: 'testcontract',
      canDeleteMethod: 'testmethod',
      canDeleteError: null,
      canReclaim: true,
      isPCCBurned: false,
      isParentOwner: true,
    },
    ownerData: {
      ownershipLevel: 'nameWrapper',
      owner: '0x1234567890',
    },
    wrapperData: {
      child: {
        CANNOT_SET_RESOLVER: false,
      },
    },
    expiryDate: new Date(NOW_TIMESTAMP + 1),
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
    mockUseWrapperApprovedForAll.mockReturnValue({ approvedForAll: true, isLoading: false })
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
        abilities: {
          ...props.abilities,
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

  describe('delete subname', () => {
    it('should return a single transaction with normal subname when address is parent owner', () => {
      const { result } = renderHook(() => useProfileActions(props))
      const deleteAction = result.current.profileActions?.find(
        (a) => a.label === 'tabs.profile.actions.deleteSubname.label',
      )
      deleteAction!.onClick()
      expect(mockCreateTransactionFlow).toHaveBeenCalledWith('deleteSubname-test.eth', {
        transactions: [
          {
            name: 'deleteSubname',
            data: {
              name: 'test.eth',
              contract: 'testcontract',
              method: 'testmethod',
            },
          },
        ],
      })
    })
    it('should show data input if normal subname but address is child owner', () => {
      const { result } = renderHook(() =>
        useProfileActions({
          ...props,
          abilities: { ...props.abilities, isParentOwner: false },
        }),
      )
      const deleteAction = result.current.profileActions?.find(
        (a) => a.label === 'tabs.profile.actions.deleteSubname.label',
      )
      deleteAction!.onClick()
      expect(mockPrepareDataInput).toHaveBeenCalledWith(
        `delete-subname-not-parent-warning-test.eth`,
        { name: 'test.eth', contract: 'testcontract' },
      )
    })
    it('should return a two step transaction flow for an unwrapped subname with wrapped parent', () => {
      const { result } = renderHook(() =>
        useProfileActions({
          ...props,
          abilities: {
            ...props.abilities,
            canDeleteRequiresWrap: true,
          },
        }),
      )
      const deleteAction = result.current.profileActions?.find(
        (a) => a.label === 'tabs.profile.actions.deleteSubname.label',
      )
      deleteAction!.onClick()
      expect(mockCreateTransactionFlow).toHaveBeenCalledWith('deleteSubname-test.eth', {
        transactions: [
          {
            name: 'transferSubname',
            data: {
              contract: 'nameWrapper',
              name: 'test.eth',
              newOwner: '0x1234567890',
            },
          },
          {
            name: 'deleteSubname',
            data: {
              contract: 'nameWrapper',
              name: 'test.eth',
              method: 'setRecord',
            },
          },
        ],
        resumable: true,
        intro: {
          title: ['intro.multiStepSubnameDelete.title', { ns: 'transactionFlow' }],
          content: {
            name: 'GenericWithDescription',
            data: {
              description: 'intro.multiStepSubnameDelete.description',
            },
          },
        },
      })
    })
  })

  describe('set primary name', () => {
    it('should return an action for a single transaction with base mock data', async () => {
      const { result } = renderHook(() => useProfileActions(props))
      const setPrimaryAction = result.current.profileActions?.find(
        (action: any) => action.label === 'tabs.profile.actions.setAsPrimaryName.label',
      )
      expect(setPrimaryAction).toBeDefined()
      setPrimaryAction?.onClick()
      expect(mockCreateTransactionFlow).toHaveBeenCalled()
      expect(mockCreateTransactionFlow.mock.calls[0][0]).toBe(
        'setPrimaryName-test.eth-0x1234567890',
      )
      expect(mockCreateTransactionFlow.mock.calls[0][1].transactions.length).toBe(1)
    })

    it('should not return an action if profile is not migrated', () => {
      const { result } = renderHook(() =>
        useProfileActions({
          ...props,
          profile: {
            ...props.profile,
            isMigrated: false,
          },
        }),
      )
      const setPrimaryAction = result.current.profileActions?.find(
        (action: any) => action.label === 'tabs.profile.actions.setAsPrimaryName.label',
      )
      expect(setPrimaryAction).toBeUndefined()
    })

    it('should not return an action if profile user is not controller or wrapped owner or resolved address', () => {
      const { result } = renderHook(() =>
        useProfileActions({
          ...props,
          profile: {
            ...props.profile,
            address: '0xotheraddress',
          },
          ownerData: {
            owner: '0xotherowner',
          },
        }),
      )
      const setPrimaryAction = result.current.profileActions?.find(
        (action: any) => action.label === 'tabs.profile.actions.setAsPrimaryName.label',
      )
      expect(setPrimaryAction).toBeUndefined()
    })

    it('should return an action if profile user is controller but not wrapped owner or resolved address', () => {
      const { result } = renderHook(() =>
        useProfileActions({
          ...props,
          profile: {
            ...props.profile,
            address: '0xotheraddress',
          },
          ownerData: {
            ...props.ownerData,
            ownershipLevel: 'registry',
          },
        }),
      )
      const setPrimaryAction = result.current.profileActions?.find(
        (action: any) => action.label === 'tabs.profile.actions.setAsPrimaryName.label',
      )
      expect(setPrimaryAction).toBeDefined()
    })

    it('should return an action if profile user is wrapped owner but not controller or resolved address', () => {
      const { result } = renderHook(() =>
        useProfileActions({
          ...props,
          profile: {
            ...props.profile,
            address: '0xotheraddress',
          },
          ownerData: {
            ...props.ownerData,
            ownershipLevel: 'nameWrapper',
          },
        }),
      )
      const setPrimaryAction = result.current.profileActions?.find(
        (action: any) => action.label === 'tabs.profile.actions.setAsPrimaryName.label',
      )
      expect(setPrimaryAction).toBeDefined()
    })

    it('should return an action if profile user is resolved address but not controller or wrapped owner', () => {
      const { result } = renderHook(() =>
        useProfileActions({
          ...props,
          profile: {
            ...props.profile,
            address: '0x1234567890',
          },
          ownerData: {
            ...props.ownerData,
            owner: '0xotherowner',
          },
        }),
      )
      const setPrimaryAction = result.current.profileActions?.find(
        (action: any) => action.label === 'tabs.profile.actions.setAsPrimaryName.label',
      )
      expect(setPrimaryAction).toBeDefined()
    })

    it('should return an action if expiry date is less than now', () => {
      const { result } = renderHook(() =>
        useProfileActions({
          ...props,
          expiryDate: new Date(NOW_TIMESTAMP - 1),
        }),
      )
      const setPrimaryAction = result.current.profileActions?.find(
        (action: any) => action.label === 'tabs.profile.actions.setAsPrimaryName.label',
      )
      expect(setPrimaryAction).toBeUndefined()
    })

    it('should return not return action if primary name matches current name', () => {
      mockUsePrimary.mockReturnValueOnce({
        data: { name: 'test.eth' },
        isLoading: false,
      })
      const { result } = renderHook(() => useProfileActions(props))
      const setPrimaryAction = result.current.profileActions?.find(
        (action: any) => action.label === 'tabs.profile.actions.setAsPrimaryName.label',
      )
      expect(setPrimaryAction).toBeUndefined()
    })

    it('should not return action if profile address does not match, is wrapped owner and CSR fuse is burned and resolver status isAuthorized is false', () => {
      mockUseResolverStatus.mockReturnValueOnce({
        data: { isAuthorized: false },
        isLoading: false,
      })
      const { result } = renderHook(() =>
        useProfileActions({
          ...props,
          profile: {
            ...props.profile,
            address: '0xotheraddress',
          },
          ownerData: {
            ...props.ownerData,
            ownershipLevel: 'nameWrapper',
          },
          wrapperData: {
            child: {
              CANNOT_SET_RESOLVER: true,
            },
          },
        }),
      )
      const setPrimaryAction = result.current.profileActions?.find(
        (action: any) => action.label === 'tabs.profile.actions.setAsPrimaryName.label',
      )
      expect(setPrimaryAction).toBeUndefined()
    })

    it('should return action if profile address does not match, is wrapped owner and CSR fuse is burned and resolver status isAuthorized is true', () => {
      mockUseResolverStatus.mockReturnValueOnce({
        data: { isAuthorized: true },
        isLoading: false,
      })
      const { result } = renderHook(() =>
        useProfileActions({
          ...props,
          profile: {
            ...props.profile,
            address: '0xotheraddress',
          },
          ownerData: {
            ...props.ownerData,
            ownershipLevel: 'nameWrapper',
          },
          wrapperData: {
            child: {
              CANNOT_SET_RESOLVER: true,
            },
          },
        }),
      )
      const setPrimaryAction = result.current.profileActions?.find(
        (action: any) => action.label === 'tabs.profile.actions.setAsPrimaryName.label',
      )
      expect(setPrimaryAction).toBeDefined()
    })

    it('should return action if CSR is not burned and resolver is not authorized ', () => {
      mockUseResolverStatus.mockReturnValueOnce({
        data: { isAuthorized: false },
        isLoading: false,
      })
      const { result } = renderHook(() =>
        useProfileActions({
          ...props,
          profile: {
            ...props.profile,
            address: '0xotheraddress',
          },
          ownerData: {
            ...props.ownerData,
            ownershipLevel: 'nameWrapper',
          },
          wrapperData: {
            child: {
              CANNOT_SET_RESOLVER: false,
            },
          },
        }),
      )
      const setPrimaryAction = result.current.profileActions?.find(
        (action: any) => action.label === 'tabs.profile.actions.setAsPrimaryName.label',
      )
      expect(setPrimaryAction).toBeDefined()
    })

    it('should return action if CSR is burned and resolver is not authorized but name is not wrapped owner (technically not possible)', () => {
      mockUseResolverStatus.mockReturnValueOnce({
        data: { isAuthorized: false },
        isLoading: false,
      })
      const { result } = renderHook(() =>
        useProfileActions({
          ...props,
          profile: {
            ...props.profile,
            address: '0xotheraddress',
          },
          ownerData: {
            ...props.ownerData,
            ownershipLevel: 'registry',
          },
          wrapperData: {
            child: {
              CANNOT_SET_RESOLVER: true,
            },
          },
        }),
      )
      const setPrimaryAction = result.current.profileActions?.find(
        (action: any) => action.label === 'tabs.profile.actions.setAsPrimaryName.label',
      )
      expect(setPrimaryAction).toBeDefined()
    })

    it('should return an action with 2 transaction steps if profile address does not match user address', () => {
      const { result } = renderHook(() =>
        useProfileActions({
          ...props,
          profile: {
            ...props.profile,
            address: '0xotheraddress',
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

    it('should return an action with 2 transaction steps if profile address does not match user address and resolver is not authorized but the latest resolver has eth record', () => {
      mockUseResolverStatus.mockReturnValueOnce({
        data: { isAuthorized: false, hasMigratedRecord: true },
        isLoading: false,
      })
      const { result } = renderHook(() =>
        useProfileActions({
          ...props,
          profile: {
            ...props.profile,
            address: '0xotheraddress',
          },
          selfAbilities: {
            ...props.selfAbilites,
            canEdit: true,
          },
          ownerData: {
            ...props.ownerData,
            ownershipLevel: 'nameWrapper',
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
        data: { isAuthorized: false, hasMigratedRecord: false },
        isLoading: false,
      })
      const { result } = renderHook(() =>
        useProfileActions({
          ...props,
          profile: {
            ...props.profile,
            address: '0xotheraddress',
          },
          selfAbilities: {
            ...props.selfAbilites,
            canEdit: true,
          },
          ownerData: {
            ...props.ownerData,
            ownershipLevel: 'nameWrapper',
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
