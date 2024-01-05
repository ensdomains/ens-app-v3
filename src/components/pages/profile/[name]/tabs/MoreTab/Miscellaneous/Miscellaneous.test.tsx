import { mockFunction, render, screen, userEvent, waitFor } from '@app/test-utils'

import { useAccount } from 'wagmi'

import { useAbilities } from '@app/hooks/abilities/useAbilities'
import { useChainName } from '@app/hooks/useChainName'
import useRegistrationData from '@app/hooks/useRegistrationData'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'

import Miscellaneous from './Miscellaneous'

jest.mock('@app/hooks/useChainName')
jest.mock('@app/hooks/useRegistrationData')
jest.mock('@app/hooks/abilities/useAbilities')
jest.mock('@app/transaction-flow/TransactionFlowProvider')

jest.mock('./EarnifiDialog', () => ({
  ...jest.requireActual('./EarnifiDialog'),
  EarnifiDialog: jest.fn(({ onDismiss, open }) => (
    <div>
      <button type="button" onClick={onDismiss}>
        Dismiss
      </button>
      {open ? 'open' : 'closed'}
    </div>
  )),
}))

const mockSetStateFunction = jest.fn()
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  // @ts-expect-error
  useState: (defaultState) => [defaultState, mockSetStateFunction],
}))

const mockUseAccount = mockFunction(useAccount)
const mockUseChainName = mockFunction(useChainName)
const mockUseRegistrationData = mockFunction(useRegistrationData)
const mockUseAbilities = mockFunction(useAbilities)
const mockUseTransactionFlow = mockFunction(useTransactionFlow)

mockUseAccount.mockReturnValue({ address: '0x123' })
mockUseChainName.mockReturnValue('mainnet')
mockUseRegistrationData.mockReturnValue({ data: undefined })
mockUseAbilities.mockReturnValue({ data: {} })
mockUseTransactionFlow.mockReturnValue({ prepareDataInput: () => () => {} })

describe('Miscellaneous', () => {
  it('should not render anything if no expiryDate provided', () => {
    render(<Miscellaneous name="x.test.eth" expiryDate={undefined} isCachedData={false} />)
    expect(screen.queryByText('name.expires')).not.toBeInTheDocument()
  })
  it('should only show expiry date if no registratioon data', () => {
    render(<Miscellaneous name="x.test.eth" expiryDate={new Date()} isCachedData={false} />)
    expect(screen.getByText('name.expires')).toBeVisible()
    expect(screen.queryByText('name.registered')).not.toBeInTheDocument()
  })
  it('should show registration date, expiry date, and grace end date if registration data is available', () => {
    mockUseRegistrationData.mockReturnValue({
      data: { registrationDate: new Date(), transactionHash: '0x123' },
    })
    render(<Miscellaneous name="test.eth" expiryDate={new Date()} isCachedData={false} />)
    expect(screen.getByText('name.expires')).toBeVisible()
    expect(screen.getByText('name.registered')).toBeVisible()
    expect(screen.getByText('name.graceEnd')).toBeVisible()
  })
  it('should not show grace end date for non eth 2ld', () => {
    render(<Miscellaneous name="x.test.eth" expiryDate={new Date()} isCachedData={false} />)
    expect(screen.getByText('name.expires')).toBeVisible()
    expect(screen.queryByText('name.graceEnd')).not.toBeInTheDocument()
  })
  it('should show correct etherscan link for registration transaction', () => {
    mockUseRegistrationData.mockReturnValue({
      data: { registrationDate: new Date(), transactionHash: '0x123' },
    })
    render(<Miscellaneous name="x.test.eth" expiryDate={new Date()} isCachedData={false} />)
    expect(screen.getByTestId('etherscan-registration-link')).toHaveAttribute(
      'href',
      'https://etherscan.io/tx/0x123',
    )
  })
  it('should return null if there is no expiryDate', () => {
    const { container } = render(
      <Miscellaneous name="x.test.eth" expiryDate={undefined} isCachedData={false} />,
    )
    expect(container.firstChild).toBeNull()
  })
  it('should set showEarnifiDialog to false when EarnifiDialog is dismissed', async () => {
    render(<Miscellaneous name="x.test.eth" expiryDate={new Date()} isCachedData={false} />)
    expect(screen.getByText('closed')).toBeVisible()
    const dismissButton = screen.getByText('Dismiss')
    await userEvent.click(dismissButton)
    await waitFor(() => expect(mockSetStateFunction).toHaveBeenCalledWith(false))
  })
})
