import { mockFunction, render, screen } from '@app/test-utils'

import { useAccount } from 'wagmi'

import { useChainName } from '@app/hooks/useChainName'
import useRegistrationData from '@app/hooks/useRegistrationData'
import { useSelfAbilities } from '@app/hooks/useSelfAbilities'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'

import Miscellaneous from './Miscellaneous'

jest.mock('@app/hooks/useChainName')
jest.mock('@app/hooks/useRegistrationData')
jest.mock('@app/hooks/useSelfAbilities')
jest.mock('@app/transaction-flow/TransactionFlowProvider')

const mockUseAccount = mockFunction(useAccount)
const mockUseChainName = mockFunction(useChainName)
const mockUseRegistrationData = mockFunction(useRegistrationData)
const mockUseSelfAbilities = mockFunction(useSelfAbilities)
const mockUseTransactionFlow = mockFunction(useTransactionFlow)

mockUseAccount.mockReturnValue({ address: '0x123' })
mockUseChainName.mockReturnValue('mainnet')
mockUseRegistrationData.mockReturnValue({ data: undefined })
mockUseSelfAbilities.mockReturnValue({})
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
  it('should show registration date and expiry date if registration data is available', () => {
    mockUseRegistrationData.mockReturnValue({
      data: { registrationDate: new Date(), transactionHash: '0x123' },
    })
    render(<Miscellaneous name="x.test.eth" expiryDate={new Date()} isCachedData={false} />)
    expect(screen.getByText('name.expires')).toBeVisible()
    expect(screen.getByText('name.registered')).toBeVisible()
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
})
