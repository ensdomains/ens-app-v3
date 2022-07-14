import { TransactionModal } from '@app/components/@molecules/TransactionModal/TransactionModal'
import { useChainName } from '@app/hooks/useChainName'
import { useLocalStorage } from '@app/hooks/useLocalStorage'
import { act, mockFunction, render, screen } from '@app/test-utils'
import { useEffect } from 'react'
import {
  TransactionProvider,
  TxStateType,
  useTransaction,
} from './TransactionProvider'

jest.mock('@app/hooks/useChainName')
jest.mock('@app/components/@molecules/TransactionModal/TransactionModal')
jest.mock('@app/hooks/useLocalStorage')

const mockUseChainName = mockFunction(useChainName)
const mockTransactionModal = mockFunction(TransactionModal)
const mockUseLocalStorage = mockFunction(useLocalStorage)

const renderHelper = (tx: TxStateType) => {
  const TestComponent = () => {
    const { setCurrentTransaction } = useTransaction()

    useEffect(() => {
      if (setCurrentTransaction) {
        setCurrentTransaction(tx)
      }
    }, [setCurrentTransaction])

    return <div />
  }

  render(
    <TransactionProvider>
      <TestComponent />
    </TransactionProvider>,
  )
}

const mockOnDismiss = jest.fn()
const mockOnSuccess = jest.fn()

let mockStepStorage = {} as Record<string, number>
const mockSetStepStorage = jest.fn(
  (
    func: (prevStepStorage: Record<string, number>) => Record<string, number>,
  ) => {
    mockStepStorage = func(mockStepStorage)
  },
)

describe('TransactionProvider', () => {
  beforeEach(() => {
    mockStepStorage = {}
    mockUseLocalStorage.mockReturnValue([mockStepStorage, mockSetStepStorage])
  })
  mockTransactionModal.mockImplementation(({ open, onDismiss, onSuccess }) => {
    mockOnDismiss.mockImplementation(onDismiss)
    mockOnSuccess.mockImplementation(onSuccess)
    return open ? <div data-testid="open" /> : <div data-testid="closed" />
  })
  mockUseChainName.mockReturnValue('ethereum')
  it('should initially render with the modal closed', () => {
    renderHelper(null)
    expect(screen.queryByTestId('closed')).toBeVisible()
  })
  it('should open when there is a transaction set', () => {
    renderHelper({
      data: [
        {
          actionName: 'test',
          displayItems: [],
          generateTx: jest.fn(),
        },
      ],
      key: 'test',
    })
    expect(screen.queryByTestId('open')).toBeVisible()
  })
  it('should close when the transaction is dismissed', () => {
    renderHelper({
      data: [
        {
          actionName: 'test',
          displayItems: [],
          generateTx: jest.fn(),
        },
      ],
      key: 'test',
    })
    act(() => {
      mockOnDismiss()
    })
    expect(screen.queryByTestId('closed')).toBeVisible()
  })
  it('should increase current step on success when there are further steps', () => {
    renderHelper({
      data: [
        {
          actionName: 'test',
          displayItems: [],
          generateTx: jest.fn(),
        },
        {
          actionName: 'test',
          displayItems: [],
          generateTx: jest.fn(),
        },
      ],
      key: 'test',
    })
    act(() => {
      mockOnSuccess()
    })
    expect(mockSetStepStorage).toHaveBeenCalled()
    expect(mockStepStorage).toStrictEqual({
      test: 1,
    })
  })
  it('should keep previous data on step increase', () => {
    mockStepStorage = {
      otherTest: 2,
    }
    renderHelper({
      data: [
        {
          actionName: 'test',
          displayItems: [],
          generateTx: jest.fn(),
        },
        {
          actionName: 'test',
          displayItems: [],
          generateTx: jest.fn(),
        },
      ],
      key: 'test',
    })
    act(() => {
      mockOnSuccess()
    })
    expect(mockSetStepStorage).toHaveBeenCalled()
    expect(mockStepStorage.otherTest).toBe(2)
  })
  it('should delete step status when all steps are completed', () => {
    mockStepStorage = {
      test: 1,
    }
    mockUseLocalStorage.mockReturnValue([mockStepStorage, mockSetStepStorage])
    renderHelper({
      data: [
        {
          actionName: 'test',
          displayItems: [],
          generateTx: jest.fn(),
        },
        {
          actionName: 'test',
          displayItems: [],
          generateTx: jest.fn(),
        },
      ],
      key: 'test',
    })
    act(() => {
      mockOnSuccess()
    })
    expect(mockSetStepStorage).toHaveBeenCalled()
    expect(mockStepStorage).toStrictEqual({})
  })
})
