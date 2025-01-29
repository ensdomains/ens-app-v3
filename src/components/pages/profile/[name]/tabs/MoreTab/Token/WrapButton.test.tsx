import { mockFunction, render, screen } from '@app/test-utils'

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useAccount } from 'wagmi'

import { useWrapperApprovedForAll } from '@app/hooks/useWrapperApprovedForAll'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'

import WrapButton from './WrapButton'

vi.mock('wagmi')

vi.mock('@app/transaction-flow/TransactionFlowProvider')
vi.mock('@app/hooks/useWrapperApprovedForAll')
vi.mock('@app/utils/SyncProvider/SyncProvider', () => ({
  useHasGraphError: () => ({ data: false, isLoading: false }),
}))

const createMockResolverStatus = (overides = {}) => ({
  data: {
    isMigratedProfileEqual: true,
    isNameWrapperAware: false,
    ...overides,
  },
  isLoading: false,
})
const mockUseResolverStatus = vi.fn().mockReturnValue(createMockResolverStatus())
vi.mock('@app/hooks/resolver/useResolverStatus', () => ({
  useResolverStatus: () => mockUseResolverStatus(),
}))

const mockUseAccount = mockFunction(useAccount)

const mockUseTransaction = mockFunction(useTransactionFlow)
const mockUseWrapperApprovedForAll = mockFunction(useWrapperApprovedForAll)

const mockCreateTransactionFlow = vi.fn()
const mockResumeTransactionFlow = vi.fn()
const mockGetResumable = vi.fn()
const mockShowDataInput = vi.fn()
const mockusePreparedDataInput = () => mockShowDataInput

describe('WrapButton', () => {
  mockUseTransaction.mockReturnValue({
    resumeTransactionFlow: mockResumeTransactionFlow,
    createTransactionFlow: mockCreateTransactionFlow,
    getResumable: mockGetResumable,
    usePreparedDataInput: mockusePreparedDataInput,
  })
  mockUseAccount.mockReturnValue({ address: '0x123' })
  mockUseWrapperApprovedForAll.mockReturnValue({
    data: true,
    isLoading: false,
  })

  beforeEach(() => {
    mockUseResolverStatus.mockReturnValue(createMockResolverStatus())
  })

  it('should render', () => {
    mockResumeTransactionFlow.mockReturnValue(0)
    render(
      <WrapButton
        name="test123.eth"
        canBeWrapped
        ownerData={{ owner: '0x123' } as any}
        profile={{ resolverAddress: '0x456' } as any}
        isManager={false}
        isRegistrant={false}
      />,
    )
    expect(screen.getByTestId('wrap-name-btn')).toBeVisible()
    expect(screen.getByTestId('wrap-name-btn')).toHaveTextContent('tabs.more.token.wrapName')
  })
  it('should render null if canBeWrapped is false', () => {
    mockResumeTransactionFlow.mockReturnValue(0)
    render(
      <WrapButton
        name="test123.eth"
        canBeWrapped={false}
        ownerData={{ owner: '0x123' } as any}
        profile={{ resolverAddress: '0x456' } as any}
        isManager={false}
        isRegistrant={false}
      />,
    )
    expect(screen.queryByTestId('wrap-name-btn')).toBeNull()
  })
  it('should set the current transaction on click', () => {
    mockResumeTransactionFlow.mockReturnValue(0)
    render(
      <WrapButton
        name="test123.eth"
        canBeWrapped
        ownerData={{ owner: '0x123' } as any}
        profile={{ resolverAddress: '0x456' } as any}
        isManager={false}
        isRegistrant={false}
      />,
    )
    screen.getByTestId('wrap-name-btn').click()
    expect(mockCreateTransactionFlow).toHaveBeenCalled()
  })
  it('should create a transaction flow for migrateProfile and wrapName', async () => {
    mockUseResolverStatus.mockReturnValue(
      createMockResolverStatus({ isMigratedProfileEqual: false }),
    )
    render(
      <WrapButton
        name="test123.eth"
        canBeWrapped
        ownerData={{ owner: '0x123' } as any}
        profile={
          {
            resolverAddress: '0x456',
            records: {
              coinTypes: [
                {
                  key: 'coin1',
                },
                {
                  key: 'coin2',
                },
              ],
            },
          } as any
        }
        isManager={true}
        isRegistrant={false}
      />,
    )
    screen.getByTestId('wrap-name-btn').click()
    const args = mockCreateTransactionFlow.mock.lastCall!

    expect(args[0]).toBe('wrapName-test123.eth')
    expect(args[1].transactions[0].name).toEqual('migrateProfile')
    expect(args[1].transactions[0].data).toEqual({ name: 'test123.eth' })
    expect(args[1].transactions[1].name).toEqual('wrapName')
    expect(args[1].transactions[1].data).toEqual({ name: 'test123.eth' })
  })
  it('should create a transaction flow for wrapName when already using wrapper aware resolver', async () => {
    render(
      <WrapButton
        name="test123.eth"
        canBeWrapped
        ownerData={{ owner: '0x123' } as any}
        profile={
          {
            resolverAddress: '0x231b0Ee14048e9dCcD1d247744d114a4EB5E8E63',
            records: {
              coinTypes: [
                {
                  key: 'coin1',
                },
                {
                  key: 'coin2',
                },
              ],
            },
          } as any
        }
        isManager={false}
        isRegistrant={false}
      />,
    )
    screen.getByTestId('wrap-name-btn').click()
    const args = mockCreateTransactionFlow.mock.lastCall!

    expect(args[0]).toBe('wrapName-test123.eth')
    expect(args[1].transactions[0].name).toEqual('wrapName')
    expect(args[1].transactions[0].data).toEqual({ name: 'test123.eth' })
  })

  it('should create a transaction flow for a .eth 2LD with no profile', () => {
    render(
      <WrapButton
        name="test123.eth"
        canBeWrapped
        ownerData={{ owner: '0x123' } as any}
        profile={
          {
            resolverAddress: '0x456',
            records: {},
          } as any
        }
        isManager={false}
        isRegistrant={false}
      />,
    )
    screen.getByTestId('wrap-name-btn').click()
    const args = mockCreateTransactionFlow.mock.lastCall!

    expect(args[0]).toBe('wrapName-test123.eth')
    expect(args[1].transactions[0].name).toEqual('wrapName')
    expect(args[1].transactions[0].data).toEqual({ name: 'test123.eth' })
  })
  it('should create a transaction flow for a .eth 2LD with a profile and a different owner', () => {
    mockUseResolverStatus.mockReturnValue(
      createMockResolverStatus({ isMigratedProfileEqual: false }),
    )
    render(
      <WrapButton
        name="test123.eth"
        canBeWrapped
        ownerData={{ ownershipLevel: 'registrar', owner: '0x124', registrant: '0x123' }}
        profile={
          {
            resolverAddress: '0x456',
            records: {
              coinTypes: [
                {
                  key: 'coin1',
                },
                {
                  key: 'coin2',
                },
              ],
            },
          } as any
        }
        isManager={false}
        isRegistrant={true}
      />,
    )
    screen.getByTestId('wrap-name-btn').click()
    const args = mockCreateTransactionFlow.mock.lastCall!

    expect(args[0]).toBe('wrapName-test123.eth')
    expect(args[1].transactions[0].name).toEqual('wrapName')
    expect(args[1].transactions[0].data).toEqual({ name: 'test123.eth' })
    expect(args[1].transactions[1].name).toEqual('migrateProfile')
    expect(args[1].transactions[1].data).toEqual({ name: 'test123.eth', resolverAddress: '0x456' })
  })
  it('should create a transaction flow for a .eth 2LD with a profile, a different owner, and a name wrapper aware resolver', () => {
    render(
      <WrapButton
        name="test123.eth"
        canBeWrapped
        ownerData={{ ownershipLevel: 'registrar', owner: '0x124', registrant: '0x123' }}
        profile={
          {
            resolverAddress: '0x231b0Ee14048e9dCcD1d247744d114a4EB5E8E63',
            records: {
              coinTypes: [
                {
                  key: 'coin1',
                },
                {
                  key: 'coin2',
                },
              ],
            },
          } as any
        }
        isManager={false}
        isRegistrant={false}
      />,
    )
    screen.getByTestId('wrap-name-btn').click()
    const args = mockCreateTransactionFlow.mock.lastCall!

    expect(args[0]).toBe('wrapName-test123.eth')
    expect(args[1].transactions[0].name).toEqual('wrapName')
    expect(args[1].transactions[0].data).toEqual({ name: 'test123.eth' })
    expect(args[1].transactions).toHaveLength(1)
  })

  it('should create a transaction flow for a subname with no registry approval', () => {
    mockUseWrapperApprovedForAll.mockReturnValue({
      data: false,
      isLoading: false,
    })
    render(
      <WrapButton
        name="sub.test123.eth"
        canBeWrapped
        ownerData={{ owner: '0x123' } as any}
        profile={
          {
            resolverAddress: '0x456',
            records: {},
          } as any
        }
        isManager={true}
        isRegistrant={false}
      />,
    )
    screen.getByTestId('wrap-name-btn').click()
    const args = mockCreateTransactionFlow.mock.lastCall!

    expect(args[0]).toBe('wrapName-sub.test123.eth')
    expect(args[1].transactions[0].name).toEqual('approveNameWrapper')
    expect(args[1].transactions[0].data).toEqual({ address: '0x123' })
    expect(args[1].transactions[1].name).toEqual('wrapName')
    expect(args[1].transactions[1].data).toEqual({ name: 'sub.test123.eth' })
  })
  it('should create a transaction flow for a subname with existing registry approval', () => {
    mockUseWrapperApprovedForAll.mockReturnValue({
      data: true,
      isLoading: false,
    })
    render(
      <WrapButton
        name="sub.test123.eth"
        canBeWrapped
        ownerData={{ owner: '0x123' } as any}
        profile={
          {
            resolverAddress: '0x456',
            records: {},
          } as any
        }
        isManager={false}
        isRegistrant={false}
      />,
    )
    screen.getByTestId('wrap-name-btn').click()
    const args = mockCreateTransactionFlow.mock.lastCall!

    expect(args[0]).toBe('wrapName-sub.test123.eth')
    expect(args[1].transactions[0].name).toEqual('wrapName')
    expect(args[1].transactions[0].data).toEqual({ name: 'sub.test123.eth' })
  })

  it('should create a transaction flow for a subname with a profile', () => {
    mockUseResolverStatus.mockReturnValue(
      createMockResolverStatus({ isMigratedProfileEqual: false }),
    )
    render(
      <WrapButton
        name="sub.test123.eth"
        canBeWrapped
        ownerData={{ owner: '0x123' } as any}
        profile={
          {
            resolverAddress: '0x456',
            records: {
              coinTypes: [
                {
                  key: 'coin1',
                },
                {
                  key: 'coin2',
                },
              ],
            },
          } as any
        }
        isManager={true}
        isRegistrant={false}
      />,
    )
    screen.getByTestId('wrap-name-btn').click()
    const args = mockCreateTransactionFlow.mock.lastCall!

    expect(args[0]).toBe('wrapName-sub.test123.eth')
    expect(args[1].transactions[0].name).toEqual('migrateProfile')
    expect(args[1].transactions[0].data).toEqual({ name: 'sub.test123.eth' })
    expect(args[1].transactions[1].name).toEqual('wrapName')
    expect(args[1].transactions[1].data).toEqual({ name: 'sub.test123.eth' })
  })

  it('should call resumeTransactionFlow if flow can be resumed', () => {
    mockGetResumable.mockReturnValue(1)
    render(
      <WrapButton
        name="test123.eth"
        canBeWrapped
        ownerData={{ owner: '0x123' } as any}
        profile={{ resolverAddress: '0x456' } as any}
        isManager={false}
        isRegistrant={false}
      />,
    )
    screen.getByTestId('wrap-name-btn').click()
    expect(mockResumeTransactionFlow).toHaveBeenCalled()
  })

  it('should show an unknown labels input if a label is unknown', () => {
    mockGetResumable.mockReturnValue(false)
    mockCreateTransactionFlow.mockClear()
    mockUseWrapperApprovedForAll.mockReturnValue({
      data: false,
      isLoading: false,
    })
    // name is sub2.test123.eth
    render(
      <WrapButton
        // eslint-disable-next-line no-restricted-syntax
        name="[b2fd3233fdc544d81e84c93822934ddd9b599f056b6a7f84f4de29378bf1cb15].test123.eth"
        canBeWrapped
        ownerData={{ owner: '0x123' } as any}
        profile={{ resolverAddress: '0x456', records: {} } as any}
        isManager={true}
        isRegistrant={false}
      />,
    )
    screen.getByTestId('wrap-name-btn').click()
    expect(mockCreateTransactionFlow).not.toHaveBeenCalled()
    expect(mockShowDataInput).toHaveBeenCalled()

    const args = mockShowDataInput.mock.lastCall!
    expect(args[0]).toBe(
      // eslint-disable-next-line no-restricted-syntax
      'wrapName-[b2fd3233fdc544d81e84c93822934ddd9b599f056b6a7f84f4de29378bf1cb15].test123.eth',
    )
    expect(args[1].name).toBe(
      // eslint-disable-next-line no-restricted-syntax
      '[b2fd3233fdc544d81e84c93822934ddd9b599f056b6a7f84f4de29378bf1cb15].test123.eth',
    )
    const {
      transactionFlowItem: { transactions },
    } = args[1]
    expect(transactions[0].name).toEqual('approveNameWrapper')
    expect(transactions[0].data).toEqual({ address: '0x123' })
    expect(transactions[1].name).toEqual('wrapName')
    expect(transactions[1].data).toEqual({
      // eslint-disable-next-line no-restricted-syntax
      name: '[b2fd3233fdc544d81e84c93822934ddd9b599f056b6a7f84f4de29378bf1cb15].test123.eth',
    })
  })

  it('should call useWrapperApprovedForAll with the correct canBeWrapped state', async () => {
    render(
      <WrapButton
        name="sub.test123.eth"
        canBeWrapped
        ownerData={{ owner: '0x123', ownershipLevel: 'registrar', registrant: '0x123' } as any}
        profile={{ resolverAddress: '0x456' } as any}
        isManager={false}
        isRegistrant={false}
      />,
    )
    expect(
      mockUseWrapperApprovedForAll.mock.calls[mockUseWrapperApprovedForAll.mock.calls.length - 1],
    ).toEqual([{ address: '0x123', canBeWrapped: true, isSubname: true }])
  })
})
