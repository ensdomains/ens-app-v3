import { useChainName } from '@app/hooks/useChainName'
import { act, fireEvent, mockFunction, render, screen, waitFor } from '@app/test-utils'
import { isIOS } from '@app/utils/isIOS'
import { useAddRecentTransaction } from '@rainbow-me/rainbowkit'
import { ComponentProps } from 'react'
import { useAccount, useSigner } from 'wagmi'
import { TransactionModal } from '../TransactionDialogManager/stage/Transaction'

jest.mock('@app/hooks/useChainName')
jest.mock('@rainbow-me/rainbowkit')
jest.mock('wagmi')
jest.mock('@app/utils/isIOS')

const mockUseChainName = mockFunction(useChainName)
const mockUseAddRecentTransaction = mockFunction(useAddRecentTransaction)
const mockUseAccount = mockFunction(useAccount)
const mockUseSigner = mockFunction(useSigner)
const mockIsIOS = mockFunction(isIOS)

const mockOnComplete = jest.fn()
const mockSendTransaction = jest.fn()
const mockSendUncheckedTransaction = jest.fn()
const mockEstimateGas = jest.fn()

const renderHelper = async ({
  actionName,
  displayItems,
  currentStep,
  stepCount,
  transaction,
  ...props
}: Partial<ComponentProps<typeof TransactionModal>> = {}) => {
  render(
    <TransactionModal
      {...props}
      open
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

const goToRequest = () => {
  fireEvent.click(screen.getByTestId('transaction-modal-preSteps-trailing-btn'))
}

const goToConfirm = async () => {
  fireEvent.click(screen.getByTestId('transaction-modal-request-trailing-btn'))
  await act(async () => {
    await waitFor(() => expect(mockSendTransaction).toHaveBeenCalled())
  })
}

describe('TransactionModal', () => {
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
    expect(screen.getByText('transaction.modal.request.title')).toBeVisible()
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
    describe('preSteps', () => {
      it('should bypass stage if preSteps not specified', async () => {
        await renderHelper()
        expect(screen.getByText('transaction.modal.request.title')).toBeVisible()
      })
      it('should render preSteps', async () => {
        await renderHelper({
          stepCount: 2,
          preSteps: {
            title: 'preStepsTitle',
            content: <div>preStepsContent</div>,
            steps: ['testStep1', 'testStep2'],
          },
        })
        expect(screen.getByText('preStepsTitle')).toBeVisible()
        expect(screen.getByText('preStepsContent')).toBeVisible()
        expect(screen.getAllByText('transaction.modal.preSteps.step')).toHaveLength(2)
        expect(screen.getByText('transaction.description.testStep1')).toBeVisible()
        expect(screen.getByText('transaction.description.testStep2')).toBeVisible()
      })
      it('should use custom leading and trailing button labels', async () => {
        await renderHelper({
          stepCount: 2,
          preSteps: {
            title: 'preStepsTitle',
            content: <div>preStepsContent</div>,
            steps: ['testStep1', 'testStep2'],
            leadingLabel: 'leadingTest',
            trailingLabel: 'trailingTest',
          },
        })
        expect(screen.getByTestId('transaction-modal-dismiss-btn')).toHaveTextContent('leadingTest')
        expect(screen.getByTestId('transaction-modal-preSteps-trailing-btn')).toHaveTextContent(
          'trailingTest',
        )
      })
      it('should only show preSteps on open', async () => {
        mockSendTransaction.mockResolvedValue({
          hash: 'mock-hash',
        })
        mockUseAddRecentTransaction.mockReturnValue(() => {})
        mockEstimateGas.mockResolvedValue(1)
        await renderHelper({
          stepCount: 2,
          preSteps: {
            title: 'preStepsTitle',
            content: <div>preStepsContent</div>,
            steps: ['testStep1', 'testStep2'],
          },
        })
        goToRequest()
        expect(screen.queryByText('preStepsTitle')).not.toBeInTheDocument()
        await goToConfirm()
        expect(screen.queryByText('preStepsTitle')).not.toBeInTheDocument()
        fireEvent.click(screen.getByTestId('transaction-modal-complete-trailing-btn'))
        expect(screen.queryByText('preStepsTitle')).not.toBeInTheDocument()
      })
    })
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
        await renderHelper()
        expect(screen.getByTestId('transaction-modal-request-trailing-btn')).toBeEnabled()
      })
      it('should go to the confirm stage and run the transaction when the confirm button is clicked', async () => {
        mockSendTransaction.mockImplementation(async () => new Promise(() => {}))
        mockUseAddRecentTransaction.mockReturnValue(() => {})
        await renderHelper()
        await goToConfirm()
        expect(screen.getByText('transaction.modal.confirm.title')).toBeVisible()
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
        await renderHelper()
        await goToConfirm()
        expect(screen.getByTestId('transaction-modal-confirm-trailing-btn')).toBeDisabled()
      })
      it('should show the error message and enable the try again button if there is an error', async () => {
        mockSendTransaction.mockImplementation(async () => {
          throw new Error('error123')
        })
        mockUseAddRecentTransaction.mockReturnValue(() => {})
        await renderHelper()
        await goToConfirm()
        expect(screen.getByText('error123')).toBeVisible()
        expect(screen.getByTestId('transaction-modal-confirm-trailing-btn')).toBeEnabled()
      })
      it('should pass the transaction to send transaction', async () => {
        mockSendTransaction.mockImplementation(async () => {})
        mockUseAddRecentTransaction.mockReturnValue(() => {})
        mockEstimateGas.mockResolvedValue(1)
        await renderHelper({
          transaction: { data: 'test123' },
        })
        await goToConfirm()
        expect(mockSendTransaction).toHaveBeenCalledWith({
          gasLimit: 1,
          data: 'test123',
        })
      })
      it('should pass the transaction to send unchecked transaction is iOS', async () => {
        mockSendTransaction.mockImplementation(async () => {})
        mockUseAddRecentTransaction.mockReturnValue(() => {})
        mockEstimateGas.mockResolvedValue(1)
        mockIsIOS.mockReturnValue(true)
        await renderHelper({
          transaction: { data: 'test123' },
        })
        await goToConfirm()
        expect(mockSendTransaction).toHaveBeenCalledWith({
          gasLimit: 1,
          data: 'test123',
        })
        mockIsIOS.mockReturnValue(false)
      })
      it('should go to the complete stage if there is no error from the transaction', async () => {
        mockSendTransaction.mockImplementation(async () => ({
          hash: '0x123',
        }))
        mockUseAddRecentTransaction.mockReturnValue(() => {})
        await renderHelper()
        await goToConfirm()
        expect(screen.getByText('transaction.modal.complete.title')).toBeVisible()
      })
      it('should add transaction to recent transactions on success', async () => {
        mockSendTransaction.mockImplementation(async () => ({
          hash: '0x123',
        }))
        const mockAddTransaction = jest.fn()
        mockUseAddRecentTransaction.mockReturnValue(mockAddTransaction)

        await renderHelper()
        await goToConfirm()
        expect(mockAddTransaction).toHaveBeenCalledWith({
          description: JSON.stringify({ action: 'test', key: 'test' }),
          hash: '0x123',
          confirmations: undefined,
        })
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
          onSuccess,
          onDismiss,
        })
        await goToConfirm()
        fireEvent.click(screen.getByTestId('transaction-modal-complete-trailing-btn'))
        expect(onSuccess).toHaveBeenCalled()
        expect(onDismiss).toHaveBeenCalled()
      })
      it('should use the complete title if available', async () => {
        mockSendTransaction.mockImplementation(async () => ({
          hash: '0x123',
        }))
        mockUseAddRecentTransaction.mockReturnValue(() => {})
        await renderHelper({
          completeTitle: 'test-title-123',
        })
        await goToConfirm()
        expect(screen.getByText('test-title-123')).toBeVisible()
      })
      it('should use the complete button label if available', async () => {
        mockSendTransaction.mockImplementation(async () => ({
          hash: '0x123',
        }))
        mockUseAddRecentTransaction.mockReturnValue(() => {})
        await renderHelper({
          completeBtnLabel: 'complete-button-test-123',
        })
        await goToConfirm()
        expect(screen.getByText('complete-button-test-123')).toBeVisible()
      })
    })
  })
})
