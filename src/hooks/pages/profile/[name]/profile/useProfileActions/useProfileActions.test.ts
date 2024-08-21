import { mockFunction, renderHook, waitFor } from '@app/test-utils'

import { makeMockUseAbilitiesData } from '@root/test/mock/makeMockUseAbilitiesData'
import { makeMockUseOwnerData } from '@root/test/mock/makeMockUseOwnerData'
import { labelhash } from 'viem'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useAbilities } from '@app/hooks/abilities/useAbilities'
import { useAccountSafely } from '@app/hooks/account/useAccountSafely'
import { useContractAddress } from '@app/hooks/chain/useContractAddress'
import { useExpiry } from '@app/hooks/ensjs/public/useExpiry'
import { useOwner } from '@app/hooks/ensjs/public/useOwner'
import { usePrimaryName } from '@app/hooks/ensjs/public/usePrimaryName'
import { useWrapperData } from '@app/hooks/ensjs/public/useWrapperData'
import { useGetPrimaryNameTransactionFlowItem } from '@app/hooks/primary/useGetPrimaryNameTransactionFlowItem'
import { useResolverStatus } from '@app/hooks/resolver/useResolverStatus'
import { useProfile } from '@app/hooks/useProfile'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'
import { DeepPartial } from '@app/types'
import { useHasGraphError } from '@app/utils/SyncProvider/SyncProvider'
import { createDateAndValue } from '@app/utils/utils'

import { transactions } from '../../../../../../transaction-flow/transaction/index'
import { useProfileActions } from './useProfileActions'

const NOW_TIMESTAMP = 1588994800000
vi.spyOn(Date, 'now').mockImplementation(() => NOW_TIMESTAMP)

vi.mock('@app/transaction-flow/TransactionFlowProvider')

vi.mock('@app/hooks/account/useAccountSafely')
vi.mock('@app/hooks/abilities/useAbilities')

vi.mock('@app/hooks/useProfile')
vi.mock('@app/hooks/ensjs/public/useOwner')
vi.mock('@app/hooks/ensjs/public/useWrapperData')
vi.mock('@app/hooks/ensjs/public/useExpiry')

vi.mock('@app/hooks/resolver/useResolverStatus')
vi.mock('@app/hooks/ensjs/public/usePrimaryName')

vi.mock('@app/utils/SyncProvider/SyncProvider')

vi.mock('@app/hooks/chain/useContractAddress')

vi.mock('@app/hooks/primary/useGetPrimaryNameTransactionFlowItem')

const mockUseTransactionFlow = mockFunction(useTransactionFlow)

const mockUseAccountSafely = mockFunction(useAccountSafely)
const mockUseAbilities = mockFunction(useAbilities)

const mockUseProfile = mockFunction(useProfile)
const mockUseOwner = mockFunction(useOwner)
const mockUseWrapperData = mockFunction(useWrapperData)
const mockUseExpiry = mockFunction(useExpiry)

const mockUseResolverStatus = mockFunction(useResolverStatus)
const mockUsePrimaryName = mockFunction(usePrimaryName)

const mockUseHasGraphError = mockFunction(useHasGraphError)

const mockUseContractAddress = mockFunction(useContractAddress)

const mockGetUseGetPrimaryNameTransactionFlowItem = mockFunction(
  useGetPrimaryNameTransactionFlowItem,
)

const mockCreateTransactionFlow = vi.fn()
const mockUsePreparedDataInput = vi.fn()

type MockHookData<THookFn extends (...args: any[]) => { data: any }> = DeepPartial<
  ReturnType<THookFn>['data']
>

const mockUseAbilitiesData: MockHookData<typeof useAbilities> = {
  canEdit: true,
  canDelete: true,
  canDeleteContract: 'testcontract' as any,
  canDeleteMethod: 'testmethod' as any,
  canDeleteError: undefined,
  canReclaim: true,
  isPCCBurned: false,
  isParentOwner: true,
}

const mockUseProfileData: MockHookData<typeof useProfile> = {
  address: '0x1234567890',
  isMigrated: true,
}

const mockUseOwnerData: MockHookData<typeof useOwner> = {
  ownershipLevel: 'nameWrapper',
  owner: '0x1234567890',
}

const mockUseWrapperDataData: MockHookData<typeof useWrapperData> = {
  fuses: {
    child: {
      CANNOT_SET_RESOLVER: false,
    },
  },
}

const mockUseExpiryData: MockHookData<typeof useExpiry> = {
  expiry: createDateAndValue(BigInt(NOW_TIMESTAMP + 1)),
}

const mockUseResolverStatusData: MockHookData<typeof useResolverStatus> = {
  isAuthorized: true,
}

describe('useProfileActions', () => {
  beforeEach(() => {
    mockUseAccountSafely.mockReturnValue({ address: '0x1234567890' })
    mockUseAbilities.mockReturnValue({
      data: mockUseAbilitiesData,
      isLoading: false,
    })

    mockUseProfile.mockReturnValue({
      data: mockUseProfileData,
      isLoading: false,
    })
    mockUseOwner.mockReturnValue({
      data: mockUseOwnerData,
      isLoading: false,
    })
    mockUseWrapperData.mockReturnValue({
      data: mockUseWrapperDataData,
      isLoading: false,
    })
    mockUseExpiry.mockReturnValue({
      data: mockUseExpiryData,
      isLoading: false,
    })

    mockUseResolverStatus.mockReturnValue({
      data: mockUseResolverStatusData,
      isLoading: false,
    })
    mockUsePrimaryName.mockReturnValue({
      data: null,
      isLoading: false,
    })
    mockUseTransactionFlow.mockReturnValue({
      usePreparedDataInput:
        () =>
        (...args: any[]) =>
          mockUsePreparedDataInput(...args),
      createTransactionFlow: (...args: any[]) => mockCreateTransactionFlow(...args),
    })
    mockUseHasGraphError.mockReturnValue({ data: false, isLoading: false })

    // @ts-ignore
    mockUseContractAddress.mockReturnValue('0xresolver')

    mockGetUseGetPrimaryNameTransactionFlowItem.mockReturnValue({
      callBack: (name: string) => ({
        transactions: [
          {
            data: {
              name,
              address: '0x1234567890',
            },
            name: 'updateEthAddress',
          },
        ],
      }),
      isLoading: false,
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('returns an object with profileActions and isLoading properties', () => {
    const { result } = renderHook(() => useProfileActions({ name: 'test.eth' }))
    expect(result.current).toHaveProperty('profileActions')
    expect(result.current).toHaveProperty('isLoading')
  })

  it('returns an empty array for profileActions if address is falsy', () => {
    mockUseAccountSafely.mockReturnValue({ address: undefined })
    const { result } = renderHook(() => useProfileActions({ name: 'test.eth' }))
    expect(result.current.profileActions).toEqual([])
  })

  it('returns an empty array for profileActions if isLoading is true', () => {
    mockUsePrimaryName.mockReturnValue({
      data: undefined,
      isLoading: true,
    })
    const { result } = renderHook(() => useProfileActions({ name: 'test.eth' }))
    expect(result.current.profileActions).toEqual([])
  })

  it('returns the correct action if subnameAbilities.canDelete is true', () => {
    const { result } = renderHook(() => useProfileActions({ name: 'test.eth' }))
    expect(result.current.profileActions).toContainEqual(
      expect.objectContaining({
        label: 'tabs.profile.actions.deleteSubname.label',
        onClick: expect.any(Function),
      }),
    )
  })

  it('returns the correct action if subnameAbilities.canReclaim is true', () => {
    const { result } = renderHook(() => useProfileActions({ name: 'test.eth' }))
    expect(result.current.profileActions).toContainEqual(
      expect.objectContaining({
        label: 'tabs.profile.actions.reclaim.label',
        onClick: expect.any(Function),
      }),
    )
  })

  it('should return the correct copy when subnameAbilities.canDeleteError has a string value', () => {
    mockUseAbilities.mockReturnValue({
      data: {
        ...mockUseAbilitiesData,
        canDelete: false,
        canDeleteError: 'test error',
      },
      isLoading: false,
    })
    const { result } = renderHook(() => useProfileActions({ name: 'test.eth' }))
    expect(result.current.profileActions).toContainEqual(
      expect.objectContaining({
        label: 'tabs.profile.actions.deleteSubname.label',
        tooltipContent: 'test error',
      }),
    )
  })

  describe('delete subname', () => {
    it('should return a single transaction with normal subname when address is parent owner', () => {
      const { result } = renderHook(() => useProfileActions({ name: 'test.eth' }))
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
      mockUseAbilities.mockReturnValue({
        data: {
          ...mockUseAbilitiesData,
          isParentOwner: false,
        },
        isLoading: false,
      })
      const { result } = renderHook(() => useProfileActions({ name: 'test.eth' }))
      const deleteAction = result.current.profileActions?.find(
        (a) => a.label === 'tabs.profile.actions.deleteSubname.label',
      )
      deleteAction!.onClick()
      expect(mockUsePreparedDataInput).toHaveBeenCalledWith(
        `delete-subname-not-parent-warning-test.eth`,
        { name: 'test.eth', contract: 'testcontract' },
      )
    })
    it('should return a two step transaction flow for an unwrapped subname with wrapped parent', () => {
      mockUseAbilities.mockReturnValue({
        data: {
          ...mockUseAbilitiesData,
          canDeleteRequiresWrap: true,
        },
        isLoading: false,
      })
      const { result } = renderHook(() => useProfileActions({ name: 'test.eth' }))
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
              newOwnerAddress: '0x1234567890',
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
      const { result } = renderHook(() => useProfileActions({ name: 'test.eth' }))
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
      mockUseProfile.mockReturnValue({
        data: {
          ...mockUseProfileData,
          isMigrated: false,
        },
        isLoading: false,
      })
      const { result } = renderHook(() => useProfileActions({ name: 'test.eth' }))
      const setPrimaryAction = result.current.profileActions?.find(
        (action: any) => action.label === 'tabs.profile.actions.setAsPrimaryName.label',
      )
      expect(setPrimaryAction).toBeUndefined()
    })

    it('should not return an action if profile user is not controller or wrapped owner or resolved address', () => {
      mockUseProfile.mockReturnValue({
        data: {
          ...mockUseProfileData,
          address: '0xotheraddress',
        },
        isLoading: false,
      })
      mockUseOwner.mockReturnValue({
        data: {
          ...mockUseOwnerData,
          owner: '0xotherowner',
        },
        isLoading: false,
      })
      const { result } = renderHook(() => useProfileActions({ name: 'test.eth' }))
      const setPrimaryAction = result.current.profileActions?.find(
        (action: any) => action.label === 'tabs.profile.actions.setAsPrimaryName.label',
      )
      expect(setPrimaryAction).toBeUndefined()
    })

    it('should return an action if profile user is controller but not wrapped owner or resolved address', () => {
      mockUseProfile.mockReturnValue({
        data: {
          ...mockUseProfileData,
          address: '0xotheraddress',
        },
        isLoading: false,
      })
      mockUseOwner.mockReturnValue({
        data: {
          ...mockUseOwnerData,
          ownershipLevel: 'registry',
        },
        isLoading: false,
      })
      const { result } = renderHook(() => useProfileActions({ name: 'test.eth' }))
      const setPrimaryAction = result.current.profileActions?.find(
        (action: any) => action.label === 'tabs.profile.actions.setAsPrimaryName.label',
      )
      expect(setPrimaryAction).toBeDefined()
    })

    it('should return an action if profile user is wrapped owner but not controller or resolved address', () => {
      mockUseProfile.mockReturnValue({
        data: {
          ...mockUseProfileData,
          address: '0xotheraddress',
        },
        isLoading: false,
      })
      const { result } = renderHook(() => useProfileActions({ name: 'test.eth' }))
      const setPrimaryAction = result.current.profileActions?.find(
        (action: any) => action.label === 'tabs.profile.actions.setAsPrimaryName.label',
      )
      expect(setPrimaryAction).toBeDefined()
    })

    it('should return an action if profile user is resolved address but not controller or wrapped owner', () => {
      mockUseOwner.mockReturnValue({
        data: {
          ...mockUseOwnerData,
          owner: '0xotherowner',
        },
        isLoading: false,
      })
      const { result } = renderHook(() => useProfileActions({ name: 'test.eth' }))
      const setPrimaryAction = result.current.profileActions?.find(
        (action: any) => action.label === 'tabs.profile.actions.setAsPrimaryName.label',
      )
      expect(setPrimaryAction).toBeDefined()
    })

    it('should not return an action if expiry date is less than now', () => {
      mockUseExpiry.mockReturnValue({
        data: {
          expiry: createDateAndValue(BigInt(NOW_TIMESTAMP - 1)),
        },
        isLoading: false,
      })
      const { result } = renderHook(() => useProfileActions({ name: 'test.eth' }))
      const setPrimaryAction = result.current.profileActions?.find(
        (action: any) => action.label === 'tabs.profile.actions.setAsPrimaryName.label',
      )
      expect(setPrimaryAction).toBeUndefined()
    })

    it('should not return an action if primary name matches current name', () => {
      mockUsePrimaryName.mockReturnValue({
        data: { name: 'test.eth', beautifiedName: 'test.eth' },
        isLoading: false,
      })
      const { result } = renderHook(() => useProfileActions({ name: 'test.eth' }))
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
      mockUseProfile.mockReturnValue({
        data: {
          ...mockUseProfileData,
          address: '0xotheraddress',
        },
        isLoading: false,
      })
      mockUseWrapperData.mockReturnValue({
        data: {
          fuses: {
            child: {
              CANNOT_SET_RESOLVER: true,
            },
          },
          owner: '0x1234567890',
        },
        isLoading: false,
      })
      const { result } = renderHook(() => useProfileActions({ name: 'test.eth' }))
      const setPrimaryAction = result.current.profileActions?.find(
        (action: any) => action.label === 'tabs.profile.actions.setAsPrimaryName.label',
      )
      expect(setPrimaryAction).toBeUndefined()
    })

    it('should return action if profile address does not match, is wrapped owner and CSR fuse is burned and resolver status isAuthorized is true', () => {
      mockUseProfile.mockReturnValue({
        data: {
          ...mockUseProfileData,
          address: '0xotheraddress',
        },
        isLoading: false,
      })
      mockUseWrapperData.mockReturnValue({
        data: {
          fuses: {
            child: {
              CANNOT_SET_RESOLVER: true,
            },
          },
          owner: '0x1234567890',
        },
        isLoading: false,
      })
      const { result } = renderHook(() => useProfileActions({ name: 'test.eth' }))
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
      mockUseProfile.mockReturnValue({
        data: {
          ...mockUseProfileData,
          address: '0xotheraddress',
        },
        isLoading: false,
      })
      const { result } = renderHook(() => useProfileActions({ name: 'test.eth' }))
      const setPrimaryAction = result.current.profileActions?.find(
        (action: any) => action.label === 'tabs.profile.actions.setAsPrimaryName.label',
      )
      expect(setPrimaryAction).toBeDefined()
    })

    it('should return an action that triggers unknownLable input if name is encrypted', async () => {
      const { result } = renderHook(() =>
        useProfileActions({ name: `[${labelhash('test').slice(2)}].eth` }),
      )
      const setPrimaryAction = result.current.profileActions?.find(
        (action: any) => action.label === 'tabs.profile.actions.setAsPrimaryName.label',
      )
      setPrimaryAction?.onClick()
      expect(mockUsePreparedDataInput).toHaveBeenCalled()
      expect(mockUsePreparedDataInput.mock.calls[0][0]).toBe(
        `setPrimaryName-[${labelhash('test').slice(2)}].eth-0x1234567890`,
      )
      expect(
        mockUsePreparedDataInput.mock.calls[0][1].transactionFlowItem.transactions.length,
      ).toEqual(1)
    })
  })

  describe('edit profile button', () => {
    it('Should show edit profile button if user is manager', () => {
      mockUseAbilities.mockReturnValue({
        data: makeMockUseAbilitiesData('eth-unwrapped-2ld:manager'),

        isLoading: false,
      })

      const { result } = renderHook(() => useProfileActions({ name: 'test.eth' }))

      expect(result.current.profileActions).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            label: 'tabs.profile.actions.editProfile.label',

            tooltipContent: undefined,
          }),
        ]),
      )
    })

    it('Should show disabled profile button if there is a graph error', () => {
      mockUseHasGraphError.mockReturnValue({
        data: true,

        isLoading: false,
      })

      const { result } = renderHook(() => useProfileActions({ name: 'test.eth' }))

      expect(result.current.profileActions).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            label: 'tabs.profile.actions.editProfile.label',

            tooltipContent: 'errors.networkError.blurb',
          }),
        ]),
      )
    })

    it('Should show disabled edit profile button if user is owner but not manager', () => {
      mockUseAbilities.mockReturnValue({
        data: makeMockUseAbilitiesData('eth-unwrapped-2ld:owner'),

        isLoading: false,
      })

      const { result } = renderHook(() => useProfileActions({ name: 'test.eth' }))

      expect(result.current.profileActions).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            label: 'tabs.profile.actions.editProfile.label',

            tooltipContent: 'errors.isOwnerCannotEdit',
          }),
        ]),
      )
    })

    it('Should show disabled edit profile button if name is wrapped but fuse for edit resolver is burned and resolver is unauthorised', () => {
      mockUseAbilities.mockReturnValue({
        data: {
          ...makeMockUseAbilitiesData('eth-burnt-2ld'),

          canEditRecords: false,
        },

        isLoading: false,
      })

      const { result } = renderHook(() => useProfileActions({ name: 'test.eth' }))

      expect(result.current.profileActions).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            label: 'tabs.profile.actions.editProfile.label',

            tooltipContent: 'errors.cannotEdit',
          }),
        ]),
      )
    })
  })

  describe('verifications', () => {
    it('should return active verifications button if the user is the manager of unwrapped 2ld eth name', async () => {
      mockUseAbilities.mockReturnValue({
        data: makeMockUseAbilitiesData('eth-unwrapped-2ld:manager'),
        isLoading: false,
      })
      mockUseOwner.mockReturnValue({
        data: makeMockUseOwnerData('registrar:manager'),
        isLoading: false,
      })
      mockUseAccountSafely.mockReturnValue({
        address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
      })
      const { result } = renderHook(() => useProfileActions({ name: 'test.eth' }))
      expect(result.current.profileActions).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            label: 'tabs.profile.actions.verifyProfile.label',
            tooltipContent: undefined,
          }),
        ]),
      )
    })

    it('should return disabled verifications button if the user is only the owner the unwrapped 2ld eth name', async () => {
      mockUseAbilities.mockReturnValue({
        data: makeMockUseAbilitiesData('eth-unwrapped-2ld:owner'),
        isLoading: false,
      })
      mockUseOwner.mockReturnValue({
        data: makeMockUseOwnerData('registrar:owner'),
        isLoading: false,
      })
      mockUseAccountSafely.mockReturnValue({
        address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
      })
      const { result } = renderHook(() => useProfileActions({ name: 'test.eth' }))
      expect(result.current.profileActions).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            label: 'tabs.profile.actions.verifyProfile.label',
            tooltipContent: 'errors.isOwnerCannotVerify',
          }),
        ]),
      )
    })

    it('should return active verifications button if the user is the owner the wrapped 2ld eth name', async () => {
      mockUseAbilities.mockReturnValue({
        data: makeMockUseAbilitiesData('eth-emancipated-2ld'),
        isLoading: false,
      })
      mockUseOwner.mockReturnValue({
        data: makeMockUseOwnerData('namewrapper'),
        isLoading: false,
      })
      mockUseAccountSafely.mockReturnValue({
        address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
      })
      const { result } = renderHook(() => useProfileActions({ name: 'test.eth' }))
      expect(result.current.profileActions).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            label: 'tabs.profile.actions.verifyProfile.label',
            tooltipContent: undefined,
          }),
        ]),
      )
    })

    it('should return active verifications button if the user is the manager of a unwrapped subname 2ld', async () => {
      mockUseAbilities.mockReturnValue({
        data: makeMockUseAbilitiesData('eth-unwrapped-subname'),
        isLoading: false,
      })
      mockUseOwner.mockReturnValue({
        data: makeMockUseOwnerData('registry'),
        isLoading: false,
      })
      mockUseAccountSafely.mockReturnValue({
        address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
      })
      const { result } = renderHook(() => useProfileActions({ name: 'test.eth' }))
      expect(result.current.profileActions).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            label: 'tabs.profile.actions.verifyProfile.label',
            tooltipContent: undefined,
          }),
        ]),
      )
    })

    it('should not return verifications button if the parent owner of a unwrapped subname', async () => {
      mockUseAbilities.mockReturnValue({
        data: makeMockUseAbilitiesData('eth-unwrapped-subname:unowned+unwrapped-2ld'),
        isLoading: false,
      })
      mockUseOwner.mockReturnValue({
        data: makeMockUseOwnerData('registry:unowned'),
        isLoading: false,
      })
      mockUseAccountSafely.mockReturnValue({
        address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
      })

      const { result } = renderHook(() => useProfileActions({ name: 'test.eth' }))
      expect(result.current.profileActions).not.toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            label: 'tabs.profile.actions.verifyProfile.label',
          }),
        ]),
      )
    })

    it('should show active verifications button if the user is owner of wrapped subname', async () => {
      mockUseAbilities.mockReturnValue({
        data: makeMockUseAbilitiesData('eth-wrapped-subname'),
        isLoading: false,
      })
      mockUseOwner.mockReturnValue({
        data: makeMockUseOwnerData('namewrapper'),
        isLoading: false,
      })
      mockUseAccountSafely.mockReturnValue({
        address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
      })

      const { result } = renderHook(() => useProfileActions({ name: 'test.eth' }))
      expect(result.current.profileActions).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            label: 'tabs.profile.actions.verifyProfile.label',
            tooltipContent: undefined,
          }),
        ]),
      )
    })
  })
})
