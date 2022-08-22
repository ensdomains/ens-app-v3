import { useChainName } from '@app/hooks/useChainName'
import { act, fireEvent, mockFunction, render, screen, waitFor } from '@app/test-utils'
import { GenericTransaction } from '@app/transaction-flow/types'
import { useEns } from '@app/utils/EnsProvider'
import { useAddRecentTransaction, useRecentTransactions } from '@rainbow-me/rainbowkit'
import { ComponentProps } from 'react'
import { useSendTransaction, useSigner } from 'wagmi'
import { TransactionStageModal } from './TransactionStageModal'

jest.mock('@app/hooks/useChainName')
jest.mock('@rainbow-me/rainbowkit')
jest.mock('@app/utils/EnsProvider')

const mockPopulatedTransaction = {
  data: '0x1896f70a516f53deb2dac3f055f1db1fbd64c12640aa29059477103c3ef28806f15929250000000000000000000000004976fb03c32e5b8cfe2b6ccb31c09ba78ebaba41',
  to: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
  from: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
  gasLimit: {
    type: 'BigNumber',
    hex: '0x798a',
  },
}
const mockTransaction: GenericTransaction = {
  name: 'updateResolver',
  data: {
    name: 'other-registrant.eth',
    contract: 'registry',
    resolver: '0x4976fb03C32e5B8cfe2b6cCB31c09Ba78EBaBa41',
    oldResolver: '0x1613beB3B2C4f22Ee086B2b38C1476A3cE7f78E8',
  },
}

jest.mock('@app/transaction-flow/transaction', () => {
  const originalModule = jest.requireActual('@app/transaction-flow/transaction')
  return {
    __esModule: true,
    ...originalModule,
    transactions: {
      updateResolver: {
        transaction: () => mockPopulatedTransaction,
      },
    },
  }
})

const mockUseEns = mockFunction(useEns)
const mockUseAddRecentTransaction = mockFunction(useAddRecentTransaction)
const mockUseRecentTransactions = mockFunction(useRecentTransactions)
const mockUseChainName = mockFunction(useChainName)
const mockUseSigner = mockFunction(useSigner)
const mockUseSendTransaction = mockFunction(useSendTransaction)

const mockEstimateGas = jest.fn()
const mockOnDismiss = jest.fn()
const mockDispatch = jest.fn()

const renderHelper = async ({
  currentStep,
  stepCount,
  actionName,
  displayItems,
  transaction,
}: Partial<ComponentProps<typeof TransactionStageModal>> = {}) => {
  render(
    <TransactionStageModal
      currentStep={currentStep || 0}
      stepCount={stepCount || 1}
      actionName={actionName || 'test'}
      displayItems={displayItems || []}
      transaction={transaction || ({} as any)}
      onDismiss={mockOnDismiss}
      dispatch={mockDispatch}
      txKey="test"
    />,
  )
  await waitFor(() => expect(screen.getByTestId('transaction-modal-inner')).toBeVisible(), {
    timeout: 350,
  })
}

const clickRequest = async () => {
  await act(async () => {
    await waitFor(() =>
      expect(screen.getByTestId('transaction-modal-confirm-button')).toBeEnabled(),
    )
    fireEvent.click(screen.getByTestId('transaction-modal-confirm-button'))
  })
}

describe('TransactionStageModal', () => {
  mockUseChainName.mockReturnValue('ethereum')
  mockUseSigner.mockReturnValue({
    data: {
      estimateGas: mockEstimateGas,
    } as any,
  })
  mockUseRecentTransactions.mockReturnValue([])
  mockUseSendTransaction.mockReturnValue({})
  mockUseEns.mockReturnValue({})

  it('should render on open', async () => {
    await renderHelper()
    expect(screen.getByText('transaction.dialog.confirm.title')).toBeVisible()
  })
  it('should render display items, and the action/info items should be added automatically', async () => {
    await renderHelper({
      displayItems: [
        {
          label: 'GenericItem',
          value: 'GenericValue',
        },
      ],
    })
    expect(screen.getByText('transaction.itemLabel.action')).toBeVisible()
    expect(screen.getByText('transaction.description.test')).toBeVisible()
    expect(screen.getByText('transaction.itemLabel.info')).toBeVisible()
    expect(screen.getByText('transaction.info.test')).toBeVisible()
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
      it('should only show confirm button as enabled if gas is estimated and sendTransaction func is defined', async () => {
        mockEstimateGas.mockResolvedValue(1)
        mockUseSendTransaction.mockReturnValue({
          sendTransaction: () => Promise.resolve(),
        })
        await renderHelper({ transaction: mockTransaction })
        await waitFor(() =>
          expect(screen.getByTestId('transaction-modal-confirm-button')).toBeEnabled(),
        )
      })
      it('should run set sendTransaction on action click', async () => {
        mockEstimateGas.mockResolvedValue(1)
        const mockSendTransaction = jest.fn()
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
        mockEstimateGas.mockResolvedValue(1)
        const mockSendTransaction = jest.fn()
        mockUseSendTransaction.mockReturnValue({
          sendTransaction: mockSendTransaction,
          isLoading: true,
        })
        mockSendTransaction.mockImplementation(async () => new Promise(() => {}))
        await renderHelper({ transaction: mockTransaction })
        await waitFor(() =>
          expect(screen.getByTestId('transaction-modal-confirm-button')).toBeDisabled(),
        )
      })
      it('should show the error message and reenable button if there is an error', async () => {
        const mockSendTransaction = jest.fn()
        mockUseSendTransaction.mockReturnValue({
          sendTransaction: mockSendTransaction,
          error: new Error('error123'),
        })
        await renderHelper({ transaction: mockTransaction })
        await clickRequest()
        await waitFor(() => expect(screen.getByText('error123')).toBeVisible())
        await waitFor(() =>
          expect(screen.getByTestId('transaction-modal-confirm-button')).toBeEnabled(),
        )
      })
      it('should pass the request to send transaction', async () => {
        mockEstimateGas.mockResolvedValue(1)
        const mockSendTransaction = jest.fn()
        mockUseSendTransaction.mockReturnValue({
          sendTransaction: mockSendTransaction,
        })
        await renderHelper({ transaction: mockTransaction })
        await clickRequest()
        await waitFor(() =>
          expect(mockUseSendTransaction.mock.lastCall[0].request).toStrictEqual({
            ...mockPopulatedTransaction,
            gasLimit: 1,
          }),
        )
      })
      it('should add to recent transactions and run dispatch from success callback', async () => {
        const mockAddTransaction = jest.fn()
        mockUseAddRecentTransaction.mockReturnValue(mockAddTransaction)
        await renderHelper({ transaction: mockTransaction })
        await waitFor(() => expect(mockUseSendTransaction.mock.lastCall[0].onSuccess).toBeDefined())
        ;(mockUseSendTransaction.mock.lastCall[0] as any).onSuccess({ hash: '0x123' })
        expect(mockAddTransaction).toBeCalledWith({
          hash: '0x123',
          description: JSON.stringify({ action: 'test', key: 'test' }),
        })
        expect(mockDispatch).toBeCalledWith({
          name: 'setTransactionHash',
          payload: '0x123',
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
      })
      it('should dispatch setTransactionStage if transaction state changes', async () => {
        mockUseRecentTransactions.mockReturnValue([
          {
            hash: '0x123',
            status: 'confirmed',
          },
        ])
        await renderHelper({
          transaction: {
            ...mockTransaction,
            hash: '0x123',
            stage: 'sent',
          },
        })
        await waitFor(() =>
          expect(mockDispatch).toHaveBeenCalledWith({
            name: 'setTransactionStage',
            payload: 'complete',
          }),
        )
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
        mockEstimateGas.mockResolvedValue(1)
        const mockSendTransaction = jest.fn()
        mockUseSendTransaction.mockReturnValue({
          sendTransaction: mockSendTransaction,
        })
        mockSendTransaction.mockResolvedValue({
          hash: '0x0',
        })
        await renderHelper({ transaction: { ...mockTransaction, hash: '0x123', stage: 'failed' } })
        await act(async () => {
          await waitFor(() =>
            expect(screen.getByTestId('transaction-modal-failed-button')).toBeEnabled(),
          )
          fireEvent.click(screen.getByTestId('transaction-modal-failed-button'))
        })
        expect(mockSendTransaction).toHaveBeenCalled()
      })
    })
  })
})
