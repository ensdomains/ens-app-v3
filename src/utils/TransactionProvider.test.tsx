import { TransactionModal } from '@app/components/@molecules/TransactionModal/TransactionModal'
import { useChainName } from '@app/hooks/useChainName'
import { useLocalStorage } from '@app/hooks/useLocalStorage'
import { act, mockFunction, render, screen, waitFor } from '@app/test-utils'
import { StepStorageItem } from '@app/types'
import { useEffect } from 'react'
import { useAccount, useSigner } from 'wagmi'
import {
  TransactionProvider,
  TxFunc,
  useTransaction,
} from './TransactionProvider'

jest.mock('@app/hooks/useChainName')
jest.mock('@app/components/@molecules/TransactionModal/TransactionModal')
jest.mock('@app/hooks/useLocalStorage')
jest.mock('wagmi')

const mockUseChainName = mockFunction(useChainName)
const mockTransactionModal = mockFunction(TransactionModal)
const mockUseLocalStorage = mockFunction(useLocalStorage)
const mockUseSigner = mockFunction(useSigner)
const mockUseAccount = mockFunction(useAccount)

const renderHelper = (key: string, tx?: TxFunc) => {
  const TestComponent = () => {
    const { setCurrentTransaction } = useTransaction()

    useEffect(() => {
      if (setCurrentTransaction) {
        setCurrentTransaction(key, tx)
      }
    }, [setCurrentTransaction])

    return <div />
  }

  act(() => {
    render(
      <TransactionProvider>
        <TestComponent />
      </TransactionProvider>,
    )
  })
}

const mockOnDismiss = jest.fn()
const mockOnSuccess = jest.fn()

let mockStepStorage = {} as Record<string, StepStorageItem>
const mockSetStepStorage = jest.fn(
  (
    func: (
      prevStepStorage: Record<string, StepStorageItem>,
    ) => Record<string, StepStorageItem>,
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
  mockUseSigner.mockReturnValue({ data: 'mock-signer' as any })
  mockUseAccount.mockReturnValue({ data: { address: 'mock-address' } })
  it('should initially render with the modal closed', () => {
    renderHelper('test')
    expect(screen.queryByTestId('closed')).toBeVisible()
  })
  it('should call the tx func with signer and address', async () => {
    renderHelper('test', async (signer, address) => {
      expect(signer).toBe('mock-signer')
      expect(address).toBe('mock-address')
      return true as any
    })
    await waitFor(() => expect(screen.queryByTestId('closed')).toBeVisible())
  })
  it('should open when there is a transaction set', async () => {
    mockStepStorage = {
      test: {
        currentStep: 0,
        currentStepComplete: false,
        data: [
          {
            actionName: 'test',
            displayItems: [],
            transaction: {},
          },
        ],
      },
    }
    mockUseLocalStorage.mockReturnValue([mockStepStorage, mockSetStepStorage])
    renderHelper('test', async () => ({
      data: [
        {
          actionName: 'test',
          displayItems: [],
          transaction: {},
        },
      ],
    }))
    await waitFor(() => expect(screen.queryByTestId('open')).toBeVisible())
  })
  it('should close when the transaction is dismissed', async () => {
    renderHelper('test', async () => ({
      data: [
        {
          actionName: 'test',
          displayItems: [],
          transaction: {},
        },
      ],
    }))
    act(() => {
      mockOnDismiss()
    })
    await waitFor(() => expect(screen.queryByTestId('closed')).toBeVisible())
  })
  it('should increase current step on success when there are further steps', async () => {
    mockStepStorage = {
      test: {
        currentStep: 0,
        currentStepComplete: false,
        data: [
          {
            actionName: 'test',
            displayItems: [],
            transaction: {},
          },
          {
            actionName: 'test',
            displayItems: [],
            transaction: {},
          },
        ],
      },
    }
    mockUseLocalStorage.mockReturnValue([mockStepStorage, mockSetStepStorage])
    renderHelper('test', async () => ({
      data: [
        {
          actionName: 'test',
          displayItems: [],
          transaction: {},
        },
        {
          actionName: 'test',
          displayItems: [],
          transaction: {},
        },
      ],
    }))
    await waitFor(() => expect(mockSetStepStorage).toHaveBeenCalled())
    act(() => {
      mockOnSuccess()
    })
    await waitFor(() => expect(mockSetStepStorage).toHaveBeenCalled())
    await waitFor(() =>
      expect(mockStepStorage).toStrictEqual({
        test: {
          currentStep: 1,
          currentStepComplete: false,
          data: [
            {
              actionName: 'test',
              displayItems: [],
              transaction: {},
            },
            {
              actionName: 'test',
              displayItems: [],
              transaction: {},
            },
          ],
          preSteps: undefined,
        },
      }),
    )
  })
  it('should keep previous data on step increase', async () => {
    mockStepStorage = {
      otherTest: {
        currentStep: 2,
        currentStepComplete: false,
        data: [
          {
            actionName: 'test',
            displayItems: [],
            transaction: {},
          },
          {
            actionName: 'test',
            displayItems: [],
            transaction: {},
          },
        ],
      } as any,
      test: {
        currentStep: 0,
        currentStepComplete: false,
        data: [
          {
            actionName: 'test',
            displayItems: [],
            transaction: {},
          },
          {
            actionName: 'test',
            displayItems: [],
            transaction: {},
          },
        ],
      },
    }
    renderHelper('test', async () => ({
      data: [
        {
          actionName: 'test',
          displayItems: [],
          transaction: {},
        },
        {
          actionName: 'test',
          displayItems: [],
          transaction: {},
        },
      ],
    }))
    await waitFor(() => expect(mockSetStepStorage).toHaveBeenCalled())
    act(() => {
      mockOnSuccess()
    })
    await waitFor(() => expect(mockSetStepStorage).toHaveBeenCalled())
    await waitFor(() =>
      expect(mockStepStorage.otherTest).toStrictEqual({
        currentStep: 2,
        currentStepComplete: false,
        data: [
          {
            actionName: 'test',
            displayItems: [],
            transaction: {},
          },
          {
            actionName: 'test',
            displayItems: [],
            transaction: {},
          },
        ],
      }),
    )
  })
  it('should delete step status when all steps are completed', async () => {
    mockStepStorage = {
      test: {
        currentStep: 1,
        currentStepComplete: false,
        data: [
          {
            actionName: 'test',
            displayItems: [],
            transaction: {},
          },
          {
            actionName: 'test',
            displayItems: [],
            transaction: {},
          },
        ],
      } as any,
    }
    mockUseLocalStorage.mockReturnValue([mockStepStorage, mockSetStepStorage])
    renderHelper('test', async () => ({
      data: [
        {
          actionName: 'test',
          displayItems: [],
          transaction: {},
        },
        {
          actionName: 'test',
          displayItems: [],
          transaction: {},
        },
      ],
    }))
    await waitFor(() => expect(mockSetStepStorage).toHaveBeenCalled())
    act(() => {
      mockOnSuccess()
    })
    await waitFor(() => expect(mockSetStepStorage).toHaveBeenCalled())
    await waitFor(() => expect(mockStepStorage).toStrictEqual({}))
  })
  it('should use existing data if no tx function is specified', async () => {
    mockStepStorage = {
      test: {
        currentStep: 0,
        currentStepComplete: false,
        data: [
          {
            actionName: 'test',
            displayItems: [],
            transaction: {},
          },
          {
            actionName: 'test',
            displayItems: [],
            transaction: {},
          },
        ],
      } as any,
    }
    mockUseLocalStorage.mockReturnValue([mockStepStorage, mockSetStepStorage])
    renderHelper('test')
    await waitFor(() => expect(mockSetStepStorage).toHaveBeenCalled())
    act(() => {
      mockOnSuccess()
    })
    await waitFor(() => expect(mockSetStepStorage).toHaveBeenCalled())
    await waitFor(() =>
      expect(mockStepStorage).toStrictEqual({
        test: {
          currentStep: 1,
          currentStepComplete: false,
          data: [
            {
              actionName: 'test',
              displayItems: [],
              transaction: {},
            },
            {
              actionName: 'test',
              displayItems: [],
              transaction: {},
            },
          ],
          preSteps: undefined,
        },
      }),
    )
  })
})
