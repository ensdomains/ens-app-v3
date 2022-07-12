import { useChainName } from '@app/hooks/useChainName'
import {
  fireEvent,
  mockFunction,
  render,
  screen,
  waitFor,
} from '@app/test-utils'
import { useEffect } from 'react'
import { TransactionProvider, useTransaction } from './TransactionProvider'

jest.mock('@app/hooks/useChainName')

const mockUseChainName = mockFunction(useChainName)

describe('TransactionProvider', () => {
  mockUseChainName.mockReturnValue('ethereum')
  it('should initially render with the modal closed', () => {
    render(
      <TransactionProvider>
        <div />
      </TransactionProvider>,
    )
    expect(
      screen.queryByTestId('transaction-modal-inner'),
    ).not.toBeInTheDocument()
  })
  it('should open when there is a transaction set', async () => {
    const TestComponent = () => {
      const { setCurrentTransaction } = useTransaction()

      useEffect(() => {
        if (setCurrentTransaction) {
          setCurrentTransaction({
            actionName: 'test',
            displayItems: [],
            generateTx: jest.fn(),
          })
        }
      }, [setCurrentTransaction])

      return <div />
    }

    render(
      <TransactionProvider>
        <TestComponent />
      </TransactionProvider>,
    )

    await waitFor(
      () =>
        expect(screen.queryByTestId('transaction-modal-inner')).toBeVisible(),
      {
        timeout: 350,
      },
    )
  })
  it('should close when the transaction is dismissed', async () => {
    const TestComponent = () => {
      const { setCurrentTransaction } = useTransaction()

      useEffect(() => {
        if (setCurrentTransaction) {
          setCurrentTransaction({
            actionName: 'test',
            displayItems: [],
            generateTx: jest.fn(),
          })
        }
      }, [setCurrentTransaction])

      return <div />
    }

    render(
      <TransactionProvider>
        <TestComponent />
      </TransactionProvider>,
    )

    await waitFor(
      () =>
        expect(screen.queryByTestId('transaction-modal-inner')).toBeVisible(),
      {
        timeout: 350,
      },
    )

    fireEvent.click(screen.getByTestId('transaction-modal-dismiss-btn'))

    await waitFor(
      () =>
        expect(
          screen.queryByTestId('transaction-modal-inner'),
        ).not.toBeInTheDocument(),
      {
        timeout: 350,
      },
    )
  })
})
