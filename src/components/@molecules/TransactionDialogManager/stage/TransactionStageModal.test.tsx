/* eslint-disable no-promise-executor-return */
import { act, fireEvent, mockFunction, render, screen, userEvent, waitFor } from '@app/test-utils'

import type { MockedFunctionDeep } from '@vitest/spy'
import { ComponentProps } from 'react'
import { Account, TransactionRequest } from 'viem'
import { estimateGas, prepareTransactionRequest } from 'viem/actions'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useClient, useConnectorClient, useSendTransaction } from 'wagmi'

import { useAccountSafely } from '@app/hooks/account/useAccountSafely'
import { useChainName } from '@app/hooks/chain/useChainName'
import { useAddRecentTransaction } from '@app/hooks/transactions/useAddRecentTransaction'
import { useRecentTransactions } from '@app/hooks/transactions/useRecentTransactions'
import { useIsSafeApp } from '@app/hooks/useIsSafeApp'
import { GenericTransaction } from '@app/transaction-flow/types'
import { createAccessList } from '@app/utils/query/createAccessList'
import { checkIsSafeApp } from '@app/utils/safe'

import { makeMockIntersectionObserver } from '../../../../../test/mock/makeMockIntersectionObserver'
import { useMockedUseQueryOptions } from '../../../../../test/mock/useMockedUseQueryOptions'
import { calculateGasLimit, transactionSuccessHandler } from './query'
import { handleBackToInput, TransactionStageModal } from './TransactionStageModal'

vi.mock('@app/hooks/account/useAccountSafely')
vi.mock('@app/hooks/chain/useChainName')
vi.mock('@app/hooks/useIsSafeApp')
vi.mock('@app/hooks/transactions/useAddRecentTransaction')
vi.mock('@app/hooks/transactions/useRecentTransactions')
vi.mock('@app/hooks/chain/useInvalidateOnBlock')
vi.mock('@app/utils/safe')
vi.mock('@app/utils/query/createAccessList')
vi.mock('@wagmi/core', async () => {
  const actual = await vi.importActual('@wagmi/core')
  return {
    ...actual,
    getFeeHistory: vi.fn().mockResolvedValue({
      baseFeePerGas: [],
      gasUsedRatio: [],
      oldestBlock: 0n,
      reward: [],
    }),
  }
})

vi.mock('wagmi')
vi.mock('viem/actions')

const mockTransactionRequest: TransactionRequest = {
  data: '0x1896f70a516f53deb2dac3f055f1db1fbd64c12640aa29059477103c3ef28806f15929250000000000000000000000004976fb03c32e5b8cfe2b6ccb31c09ba78ebaba41',
  to: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
  from: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
  gas: 0x798an,
}
const mockTransaction: GenericTransaction = {
  name: 'updateResolver',
  data: {
    name: 'other-registrant.eth',
    contract: 'registry',
    resolverAddress: '0x4976fb03C32e5B8cfe2b6cCB31c09Ba78EBaBa41',
    oldResolverAddress: '0x1613beB3B2C4f22Ee086B2b38C1476A3cE7f78E8',
  },
}

makeMockIntersectionObserver()

vi.mock('@app/transaction-flow/transaction', () => {
  const originalModule = vi.importActual('@app/transaction-flow/transaction')
  return {
    __esModule: true,
    ...originalModule,
    createTransactionRequest: () => mockTransactionRequest,
  }
})

const mockClient = {
  request: vi.fn(),
}

const mockUseClient = mockFunction(useClient)
const mockUseConnectorClient = mockFunction(useConnectorClient)

const mockEstimateGas = mockFunction(estimateGas)
const mockCreateAccessList = createAccessList as MockedFunctionDeep<typeof createAccessList>
const mockPrepareTransactionRequest = prepareTransactionRequest as MockedFunctionDeep<
  typeof prepareTransactionRequest
>

const mockUseIsSafeApp = mockFunction(useIsSafeApp)
const mockUseAddRecentTransaction = mockFunction(useAddRecentTransaction)
const mockUseRecentTransactions = mockFunction(useRecentTransactions)
const mockUseAccountSafely = mockFunction(useAccountSafely)
const mockUseChainName = mockFunction(useChainName)
const mockUseSendTransaction = mockFunction(useSendTransaction)
const mockCheckIsSafeApp = checkIsSafeApp as MockedFunctionDeep<typeof checkIsSafeApp>

const mockOnDismiss = vi.fn()
const mockDispatch = vi.fn()

const ComponentWithDefaultProps = ({
  currentStep = 0,
  stepCount = 1,
  actionName = 'test',
  displayItems = [],
  transaction = {} as any,
}: Partial<ComponentProps<typeof TransactionStageModal>>) => (
  <TransactionStageModal
    currentStep={currentStep}
    stepCount={stepCount}
    actionName={actionName}
    displayItems={displayItems}
    transaction={transaction}
    onDismiss={mockOnDismiss}
    dispatch={mockDispatch}
    backToInput={false}
    txKey="test"
  />
)

const renderHelper = async (props: Partial<ComponentProps<typeof TransactionStageModal>> = {}) => {
  const renderValue = render(<ComponentWithDefaultProps key="component-default" {...props} />)
  await waitFor(() => expect(screen.getByTestId('transaction-modal-inner')).toBeVisible(), {
    timeout: 350,
  })
  return renderValue
}

const clickRequest = async () => {
  await waitFor(() => expect(screen.getByTestId('transaction-modal-confirm-button')).toBeEnabled())
  await userEvent.click(screen.getByTestId('transaction-modal-confirm-button'))
}

describe('TransactionStageModal', () => {
  mockUseRecentTransactions.mockReturnValue([])
  mockUseSendTransaction.mockReturnValue({})

  beforeEach(() => {
    mockUseClient.mockReturnValue({})
    useMockedUseQueryOptions({
      chainId: 1,
      address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
      client: mockClient,
    })
    mockUseConnectorClient.mockReturnValue({
      data: { account: { address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266' } },
    })
    mockUseIsSafeApp.mockReturnValue({ data: false })
    mockEstimateGas.mockReset()
    mockPrepareTransactionRequest.mockReset()
    // passthrough for the transaction request
    mockPrepareTransactionRequest.mockImplementation(
      async (_, { parameters: _parameters, account, ...data }) =>
        ({ ...data, from: (account as Account).address }) as any,
    )
    mockUseAccountSafely.mockReturnValue({ address: '0x1234' })
    mockUseChainName.mockReturnValue('ethereum')
    mockUseRecentTransactions.mockReturnValue([
      {
        status: 'pending',
        hash: '0x123',
        action: 'test',
        key: 'test',
      },
    ])
  })

  it('should render on open', async () => {
    await renderHelper()
    expect(screen.getByText('transaction.dialog.confirm.title')).toBeVisible()
  })
  it('should render display items', async () => {
    await renderHelper({
      displayItems: [
        {
          label: 'GenericItem',
          value: 'GenericValue',
        },
      ],
    })
    expect(screen.getByText('transaction.itemLabel.GenericItem')).toBeVisible()
    expect(screen.getByText('GenericValue')).toBeVisible()
  })

  it('should not render steps if there is only 1 step', async () => {
    await renderHelper()
    expect(screen.queryByTestId('step-container')).not.toBeInTheDocument()
  })
  it('should render steps if there are multiple steps', async () => {
    await renderHelper({ stepCount: 2 })
    expect(screen.getByTestId('step-container')).toBeVisible()
  })
  describe('stage', () => {
    describe('confirm', () => {
      it('should show confirm button as disabled if gas is not estimated', async () => {
        await renderHelper()
        await waitFor(() =>
          expect(screen.getByTestId('transaction-modal-confirm-button')).toBeDisabled(),
        )
      })
      it('should show confirm button as disabled if a unique identifier is undefined', async () => {
        mockUseIsSafeApp.mockReturnValue({ data: false })
        mockEstimateGas.mockResolvedValue(1n)
        mockUseSendTransaction.mockReturnValue({
          sendTransaction: () => Promise.resolve(),
        })
        mockUseAccountSafely.mockReturnValue({ address: undefined })
        await renderHelper({ transaction: mockTransaction })
        await waitFor(() =>
          expect(screen.getByTestId('transaction-modal-confirm-button')).toBeDisabled(),
        )
      })

      it('should disable confirm button and re-estimate gas if a unique identifier is changed', async () => {
        mockCreateAccessList.mockResolvedValue({ accessList: [], gasUsed: '0x64' })
        mockEstimateGas.mockResolvedValue(1n)
        mockUseIsSafeApp.mockReturnValue({ data: false })
        mockUseSendTransaction.mockReturnValue({
          sendTransaction: () => Promise.resolve(),
        })
        const { rerender } = await renderHelper({ transaction: mockTransaction })
        await waitFor(() =>
          expect(screen.getByTestId('transaction-modal-confirm-button')).toBeEnabled(),
        )
        expect(mockEstimateGas).toHaveBeenCalledTimes(1)
        mockEstimateGas.mockReset()
        mockEstimateGas.mockResolvedValue(2n)
        rerender(
          <ComponentWithDefaultProps
            transaction={{
              ...mockTransaction,
              data: { ...mockTransaction.data, name: 'test.eth' },
            }}
            key="component-default"
          />,
        )
        expect(screen.getByTestId('transaction-modal-confirm-button')).toBeDisabled()
        await waitFor(() =>
          expect(screen.getByTestId('transaction-modal-confirm-button')).toBeEnabled(),
        )
        expect(mockEstimateGas).toHaveBeenCalledTimes(1)
      })

      it('should only show confirm button as enabled if gas is estimated and sendTransaction func is defined', async () => {
        mockCreateAccessList.mockResolvedValue({ accessList: [], gasUsed: '0x64' })
        mockEstimateGas.mockResolvedValue(1n)
        mockUseSendTransaction.mockReturnValue({
          sendTransaction: () => Promise.resolve(),
        })
        await renderHelper({ transaction: mockTransaction })
        await waitFor(() =>
          expect(screen.getByTestId('transaction-modal-confirm-button')).toBeEnabled(),
        )
      })
      it('should run set sendTransaction on action click', async () => {
        mockCreateAccessList.mockResolvedValue({ accessList: [], gasUsed: '0x64' })
        mockEstimateGas.mockResolvedValue(1n)
        const mockSendTransaction = vi.fn()
        mockUseSendTransaction.mockReturnValue({
          sendTransaction: mockSendTransaction,
        })
        mockSendTransaction.mockResolvedValue({
          hash: '0x0',
        })
        await renderHelper({ transaction: mockTransaction })
        await clickRequest()
        expect(mockSendTransaction).toHaveBeenCalled()
      })
      it('should show the waiting for wallet button if the transaction is loading', async () => {
        mockEstimateGas.mockResolvedValue(1n)
        const mockSendTransaction = vi.fn()
        mockUseSendTransaction.mockReturnValue({
          sendTransaction: mockSendTransaction,
          isPending: true,
        })
        mockSendTransaction.mockImplementation(async () => new Promise(() => {}))
        await renderHelper({ transaction: mockTransaction })
        await waitFor(() =>
          expect(screen.getByTestId('transaction-modal-confirm-button')).toBeDisabled(),
        )
      })
      it('should show the error message and reenable button if there is an error', async () => {
        const mockSendTransaction = vi.fn()
        mockUseSendTransaction.mockReturnValue({
          sendTransaction: mockSendTransaction,
          error: new Error('error123') as any,
        })
        mockEstimateGas.mockResolvedValue(1n)
        mockCreateAccessList.mockResolvedValue({ accessList: [], gasUsed: '0x64' })
        await renderHelper({ transaction: mockTransaction })
        await clickRequest()
        await waitFor(() => expect(screen.getByText('error123')).toBeVisible())
        await waitFor(() =>
          expect(screen.getByTestId('transaction-modal-confirm-button')).toBeEnabled(),
        )
      })
      it('should pass the request to send transaction', async () => {
        mockUseIsSafeApp.mockReturnValue({ data: false })
        mockCreateAccessList.mockResolvedValue({ accessList: [], gasUsed: '0x64' })
        mockEstimateGas.mockResolvedValue(1n)
        const mockSendTransaction = vi.fn()
        mockUseSendTransaction.mockReturnValue({
          sendTransaction: mockSendTransaction,
        })
        await renderHelper({ transaction: mockTransaction })
        await clickRequest()
        await waitFor(() =>
          expect(mockSendTransaction.mock.lastCall![0]!).toStrictEqual(
            expect.objectContaining({
              ...mockTransactionRequest,
              gas: 1n,
              accessList: [],
            }),
          ),
        )
      })
      it('should add to recent transactions and run dispatch from success callback', async () => {
        const mockAddTransaction = vi.fn()
        mockUseAddRecentTransaction.mockReturnValue(mockAddTransaction)
        mockCheckIsSafeApp.mockResolvedValue(false)
        await renderHelper({ transaction: mockTransaction })
        await waitFor(() =>
          expect(mockUseSendTransaction.mock.lastCall![0]!.mutation!.onSuccess).toBeDefined(),
        )
        await mockUseSendTransaction.mock.lastCall![0]!.mutation!.onSuccess!('0x123', {} as any, {})
        expect(mockAddTransaction).toBeCalledWith(
          expect.objectContaining({
            hash: '0x123',
            action: 'test',
            isSafeTx: false,
            key: 'test',
          }),
        )
        expect(mockDispatch).toBeCalledWith({
          name: 'setTransactionHash',
          payload: { hash: '0x123', key: 'test' },
        })
      })
      it('should add to recent transactions and run dispatch from success callback when isSafeTx', async () => {
        const mockAddTransaction = vi.fn()
        mockUseIsSafeApp.mockReturnValue({ data: 'iframe' })
        mockUseAddRecentTransaction.mockReturnValue(mockAddTransaction)
        mockCheckIsSafeApp.mockResolvedValue('iframe')
        await renderHelper({ transaction: mockTransaction })
        await waitFor(() =>
          expect(mockUseSendTransaction.mock.lastCall![0]!.mutation!.onSuccess).toBeDefined(),
        )
        await mockUseSendTransaction.mock.lastCall![0]!.mutation!.onSuccess!('0x123', {} as any, {})
        expect(mockAddTransaction).toBeCalledWith(
          expect.objectContaining({
            hash: '0x123',
            action: 'test',
            isSafeTx: true,
            key: 'test',
          }),
        )
        expect(mockDispatch).toBeCalledWith({
          name: 'setTransactionHash',
          payload: { hash: '0x123', key: 'test' },
        })
      })
    })
    describe('sent', () => {
      it('should show load bar', async () => {
        await renderHelper({
          transaction: { ...mockTransaction, hash: '0x123', sendTime: Date.now(), stage: 'sent' },
        })
        await waitFor(() => expect(screen.getByTestId('load-bar-container')).toBeVisible())
      })
      it('should call onDismiss on close', async () => {
        await renderHelper({
          transaction: { ...mockTransaction, hash: '0x123', sendTime: Date.now(), stage: 'sent' },
        })
        fireEvent.click(screen.getByTestId('transaction-modal-sent-button'))
        expect(mockOnDismiss).toHaveBeenCalled()
      })
      it('should show message if transaction is taking a long time', async () => {
        await renderHelper({
          transaction: {
            ...mockTransaction,
            hash: '0x123',
            sendTime: Date.now() - 45000,
            stage: 'sent',
          },
        })
        expect(screen.getByText('transaction.dialog.sent.progress.message')).toBeVisible()
        expect(screen.getByText('transaction.dialog.sent.learn')).toBeVisible()
      })
    })
    describe('complete', () => {
      it('should call onDismiss on close', async () => {
        await renderHelper({
          transaction: {
            ...mockTransaction,
            hash: '0x123',
            sendTime: Date.now(),
            stage: 'complete',
          },
        })
        fireEvent.click(screen.getByTestId('transaction-modal-complete-button'))
        expect(mockOnDismiss).toHaveBeenCalled()
      })
    })
    describe('failed', () => {
      it('should show try again button', async () => {
        await renderHelper({ transaction: { ...mockTransaction, hash: '0x123', stage: 'failed' } })
        expect(screen.getByTestId('transaction-modal-failed-button')).toBeVisible()
      })
      it('should run sendTransaction on action click', async () => {
        mockEstimateGas.mockResolvedValue(1n)
        const mockSendTransaction = vi.fn()
        mockUseSendTransaction.mockReturnValue({
          sendTransaction: mockSendTransaction,
        })
        mockSendTransaction.mockResolvedValue({
          hash: '0x0',
        })
        await renderHelper({ transaction: { ...mockTransaction, hash: '0x123', stage: 'failed' } })
        await waitFor(() =>
          expect(screen.getByTestId('transaction-modal-failed-button')).toBeEnabled(),
        )
        await act(async () => {
          fireEvent.click(screen.getByTestId('transaction-modal-failed-button'))
        })
        expect(mockSendTransaction).toHaveBeenCalled()
      })
    })
  })
})

describe('handleBackToInput', () => {
  it('should reset the transaction step', () => {
    handleBackToInput(mockDispatch)()
    expect(mockDispatch).toBeCalledWith({
      name: 'resetTransactionStep',
    })
  })
})

describe('transactionSuccessHandler', () => {
  it('should add recent transaction data', async () => {
    const mockAddRecentTransaction = vi.fn()

    transactionSuccessHandler({
      actionName: 'actionName',
      txKey: 'txKey',
      request: {} as any,
      addRecentTransaction: mockAddRecentTransaction,
      dispatch: vi.fn(),
      isSafeApp: false,
      client: { request: vi.fn(async () => ({ testKey: 'testVal' })) } as any,
      connectorClient: { data: { account: { address: '0x1234' } }, request: vi.fn() } as any,
    })('0xhash')

    await waitFor(() =>
      expect(mockAddRecentTransaction).toBeCalledWith(
        expect.objectContaining({ testKey: 'testVal' }),
      ),
    )
  })
  it('should dispatch the correct action', async () => {
    const mockDispatch = vi.fn()

    transactionSuccessHandler({
      actionName: 'actionName',
      txKey: 'txKey',
      request: {} as any,
      addRecentTransaction: vi.fn(),
      dispatch: mockDispatch,
      isSafeApp: false,
      client: { request: vi.fn(async () => ({ testKey: 'testVal' })) } as any,
      connectorClient: { data: { account: { address: '0x1234' } }, request: vi.fn() } as any,
    })('0xhash')

    await waitFor(() =>
      expect(mockDispatch).toBeCalledWith(
        expect.objectContaining({
          name: 'setTransactionHash',
          payload: { hash: '0xhash', key: 'txKey' },
        }),
      ),
    )
  })
  it('should handle a failed call to getTransaction', async () => {
    const mockAddRecentTransaction = vi.fn()

    transactionSuccessHandler({
      actionName: 'actionName',
      txKey: 'txKey',
      request: {} as any,
      addRecentTransaction: mockAddRecentTransaction,
      dispatch: vi.fn(),
      isSafeApp: false,
      client: { request: vi.fn(async () => Promise.reject(new Error('Error'))) } as any,
      connectorClient: { data: { account: { address: '0x1234' } }, request: vi.fn() } as any,
    })('0xhash')

    await waitFor(() => expect(mockAddRecentTransaction).toBeCalled())
  })
})

describe('calculateGasLimit', () => {
  const mockConnectorClient = {
    account: {
      address: '0x1234',
    },
  }
  const mockTxWithZeroGas = {
    to: '0x1234567890123456789012345678901234567890',
    value: 0n,
    data: '0x12345678',
  } as const
  const mockTransactionName = 'registerName'
  const mockAccessListResponse = {
    accessList: [
      {
        address: '0x1234567890123456789012345678901234567890' as const,
        storageKeys: [
          '0x1234567890123456789012345678901234567890123456789012345678901234' as const,
        ],
      },
    ],
    gasUsed: '0x64' as const,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should calculate gas limit', async () => {
    mockEstimateGas.mockResolvedValueOnce(100000n)
    mockCreateAccessList.mockResolvedValueOnce(mockAccessListResponse)
    const result = await calculateGasLimit({
      txWithZeroGas: mockTxWithZeroGas,
      transactionName: mockTransactionName,
      client: mockClient as any,
      connectorClient: mockConnectorClient as any,
    })
    expect(result.gasLimit).toEqual(105000n)
    expect(result.accessList).toEqual(mockAccessListResponse.accessList)
    expect(mockEstimateGas).toHaveBeenCalledWith(mockClient, {
      ...mockTxWithZeroGas,
      accessList: mockAccessListResponse.accessList,
      account: mockConnectorClient.account,
    })
  })
})
