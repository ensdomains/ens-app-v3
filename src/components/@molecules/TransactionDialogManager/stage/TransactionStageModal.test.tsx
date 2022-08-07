import { useChainName } from '@app/hooks/useChainName'
import { act, fireEvent, mockFunction, render, screen, waitFor } from '@app/test-utils'
import { isIOS } from '@app/utils/isIOS'
import { useAddRecentTransaction } from '@rainbow-me/rainbowkit'
import { ComponentProps } from 'react'
import { useAccount, useSigner } from 'wagmi'
import { GenericTransaction } from '@app/transaction-flow/types'
import { TransactionStageModal } from './TransactionStageModal'

jest.mock('@app/hooks/useChainName')
jest.mock('@rainbow-me/rainbowkit')
jest.mock('wagmi')
jest.mock('@app/utils/isIOS')

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

const mockUseChainName = mockFunction(useChainName)
const mockUseAddRecentTransaction = mockFunction(useAddRecentTransaction)
const mockUseAccount = mockFunction(useAccount)
const mockUseSigner = mockFunction(useSigner)
const mockIsIOS = mockFunction(isIOS)

const mockOnComplete = jest.fn()
const mockSendTransaction = jest.fn()
const mockSendUncheckedTransaction = jest.fn()
const mockEstimateGas = jest.fn()

window.scroll = jest.fn()

const renderHelper = async ({
  actionName,
  displayItems,
  currentStep,
  stepCount,
  transaction,
  ...props
}: Partial<ComponentProps<typeof TransactionStageModal>> = {}) => {
  render(
    <TransactionStageModal
      {...props}
      currentStep={currentStep || 0}
      stepCount={stepCount || 1}
      actionName={actionName || 'test'}
      displayItems={displayItems || []}
      transaction={transaction || ({} as any)}
      onComplete={mockOnComplete}
      txKey="test"
    />,
  )
  await waitFor(() => expect(screen.getByTestId('transaction-modal-inner')).toBeVisible(), {
    timeout: 350,
  })
}

describe('TransactionStageModal', () => {
  mockUseChainName.mockReturnValue('ethereum')
  mockUseAccount.mockReturnValue({ data: { address: 'mock-address' } })
  mockUseSigner.mockReturnValue({
    data: {
      sendTransaction: mockSendTransaction,
      sendUncheckedTransaction: mockSendUncheckedTransaction,
      estimateGas: mockEstimateGas,
    } as any,
  })
  mockIsIOS.mockReturnValue(false)

  it('should render on open', async () => {
    await renderHelper()
    expect(screen.getByText('transaction.dialog.request.title')).toBeVisible()
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
    describe('request', () => {
      it('should only show confirm button as disabled if gas is not estimated', async () => {
        mockSendTransaction.mockImplementation(async () => new Promise(() => {}))
        mockUseAddRecentTransaction.mockReturnValue(() => {})
        mockEstimateGas.mockResolvedValue(undefined)
        await renderHelper()
        expect(screen.getByTestId('transaction-modal-request-trailing-btn')).toBeDisabled()
      })
      it('should only show confirm button as enabled if gas is estimated', async () => {
        mockSendTransaction.mockImplementation(async () => new Promise(() => {}))
        mockUseAddRecentTransaction.mockReturnValue(() => {})
        mockEstimateGas.mockResolvedValue(1)
        await renderHelper({ transaction: mockTransaction })
        expect(screen.getByTestId('transaction-modal-request-trailing-btn')).toBeEnabled()
      })
      it('should go to the confirm stage and run the transaction when the confirm button is clicked', async () => {
        mockSendTransaction.mockImplementation(async () => new Promise(() => {}))
        mockUseAddRecentTransaction.mockReturnValue(() => {})
        await renderHelper({ transaction: mockTransaction })
        fireEvent.click(screen.getByTestId('transaction-modal-request-trailing-btn'))
        await waitFor(() =>
          expect(screen.getByText('transaction.dialog.confirm.title')).toBeVisible(),
        )
        expect(screen.getByTestId('transaction-waiting-container')).toBeVisible()
      })
      it('should run dismiss callback on dismiss button click', async () => {
        const onDismiss = jest.fn()
        await renderHelper({
          onDismiss,
        })
        await act(async () => {
          screen.getByTestId('transaction-modal-dismiss-btn').click()
        })
        expect(onDismiss).toHaveBeenCalled()
      })
      it('should use the dismiss button label if available', async () => {
        await renderHelper({
          dismissBtnLabel: 'Dismiss123',
        })
        expect(screen.getByText('Dismiss123')).toBeVisible()
      })
    })
    describe('confirm', () => {
      it('should show the try again button as disabled if there is no error', async () => {
        mockSendTransaction.mockImplementation(async () => new Promise(() => {}))
        mockUseAddRecentTransaction.mockReturnValue(() => {})
        await renderHelper({ transaction: mockTransaction })
        fireEvent.click(screen.getByTestId('transaction-modal-request-trailing-btn'))
        expect(screen.getByTestId('transaction-modal-confirm-trailing-btn')).toBeDisabled()
      })
      it('should show the error message and enable the try again button if there is an error', async () => {
        mockSendTransaction.mockImplementation(async () => {
          throw new Error('error123')
        })
        mockUseAddRecentTransaction.mockReturnValue(() => {})
        await renderHelper({ transaction: mockTransaction })
        fireEvent.click(screen.getByTestId('transaction-modal-request-trailing-btn'))
        await waitFor(() => expect(screen.getByText('error123')).toBeVisible())
        expect(screen.getByTestId('transaction-modal-confirm-trailing-btn')).toBeEnabled()
      })
      it('should pass the transaction to send transaction', async () => {
        mockSendTransaction.mockImplementation(async () => {})
        mockUseAddRecentTransaction.mockReturnValue(() => {})
        mockEstimateGas.mockResolvedValue(1)
        await renderHelper({
          transaction: mockTransaction,
        })
        fireEvent.click(screen.getByTestId('transaction-modal-request-trailing-btn'))
        await waitFor(() =>
          expect(mockSendTransaction).toHaveBeenCalledWith({
            data: '0x1896f70a516f53deb2dac3f055f1db1fbd64c12640aa29059477103c3ef28806f15929250000000000000000000000004976fb03c32e5b8cfe2b6ccb31c09ba78ebaba41',
            from: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
            to: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
            gasLimit: 1,
          }),
        )
      })
      it('should go to the complete stage if there is no error from the transaction', async () => {
        mockSendTransaction.mockImplementation(async () => ({
          hash: '0x123',
        }))
        mockUseAddRecentTransaction.mockReturnValue(() => {})
        await renderHelper({
          transaction: mockTransaction,
        })
        fireEvent.click(screen.getByTestId('transaction-modal-request-trailing-btn'))
        await waitFor(() =>
          expect(screen.getByText('transaction.dialog.complete.title')).toBeVisible(),
        )
      })
      it('should add transaction to recent transactions on success', async () => {
        mockSendTransaction.mockImplementation(async () => ({
          hash: '0x123',
        }))
        const mockAddTransaction = jest.fn()
        mockUseAddRecentTransaction.mockReturnValue(mockAddTransaction)

        await renderHelper({
          transaction: mockTransaction,
        })
        fireEvent.click(screen.getByTestId('transaction-modal-request-trailing-btn'))
        await waitFor(() =>
          expect(mockAddTransaction).toHaveBeenCalledWith({
            description: JSON.stringify({ action: 'test', key: 'test' }),
            hash: '0x123',
            confirmations: undefined,
          }),
        )
      })
    })
    describe('complete', () => {
      it('should run success callback and dismiss callback on success button click', async () => {
        mockSendTransaction.mockImplementation(async () => ({
          hash: '0x123',
        }))
        mockUseAddRecentTransaction.mockReturnValue(() => {})
        const onSuccess = jest.fn()
        const onDismiss = jest.fn()

        await renderHelper({
          transaction: mockTransaction,
          onSuccess,
          onDismiss,
        })
        fireEvent.click(screen.getByTestId('transaction-modal-request-trailing-btn'))
        await waitFor(() =>
          expect(screen.getByText('transaction.dialog.complete.title')).toBeVisible(),
        )

        fireEvent.click(screen.getByTestId('transaction-modal-complete-trailing-btn'))
        await waitFor(() => expect(onSuccess).toHaveBeenCalled())
        expect(onDismiss).toHaveBeenCalled()
      })
      it('should use the complete title if available', async () => {
        mockSendTransaction.mockImplementation(async () => ({
          hash: '0x123',
        }))
        mockUseAddRecentTransaction.mockReturnValue(() => {})

        await renderHelper({
          transaction: mockTransaction,
          completeTitle: 'test-title-123',
        })
        fireEvent.click(screen.getByTestId('transaction-modal-request-trailing-btn'))
        await waitFor(() => expect(screen.getByText('test-title-123')).toBeVisible())
      })
      it('should use the complete button label if available', async () => {
        mockSendTransaction.mockImplementation(async () => ({
          hash: '0x123',
        }))
        mockUseAddRecentTransaction.mockReturnValue(() => {})

        await renderHelper({
          transaction: mockTransaction,
          completeBtnLabel: 'complete-button-test-123',
        })
        fireEvent.click(screen.getByTestId('transaction-modal-request-trailing-btn'))
        await waitFor(() => {
          expect(screen.getByText('complete-button-test-123')).toBeVisible()
        })
      })
    })
  })
})
