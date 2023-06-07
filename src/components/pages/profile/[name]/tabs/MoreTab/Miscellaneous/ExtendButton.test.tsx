import { mockFunction, render, screen } from '@app/test-utils'

import { useAccount } from 'wagmi'

import { useSelfAbilities } from '@app/hooks/useSelfAbilities'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'

import { ExtendButton } from './ExtendButton'

jest.mock('@app/hooks/useSelfAbilities')
jest.mock('@app/transaction-flow/TransactionFlowProvider')

const mockUseAccount = mockFunction(useAccount)
const mockUseSelfAbilities = mockFunction(useSelfAbilities)
const mockUseTransactionFlow = mockFunction(useTransactionFlow)

const mockPrepareDataInput = jest.fn()

mockUseAccount.mockReturnValue({ address: '0x123' })
mockUseSelfAbilities.mockReturnValue({})
mockUseTransactionFlow.mockReturnValue({ prepareDataInput: () => mockPrepareDataInput })

describe('ExtendButton', () => {
  it('should not render if canExtend is false', () => {
    mockUseSelfAbilities.mockReturnValue({ canExtend: false })
    render(<ExtendButton name="test.eth" />)
    const element = screen.queryByText('action.extend')
    expect(element).not.toBeInTheDocument()
  })
  it('should render if canExtend is true', () => {
    mockUseSelfAbilities.mockReturnValue({ canExtend: true })
    render(<ExtendButton name="test.eth" />)
    const element = screen.queryByText('action.extend')
    expect(element).toBeInTheDocument()
  })
  it('should call showExtendNamesInput with correct arguments', () => {
    render(<ExtendButton name="test.eth" />)
    screen.queryByText('action.extend')?.click()
    expect(mockPrepareDataInput).toHaveBeenCalledWith('extend-names-test.eth', {
      isSelf: undefined,
      names: ['test.eth'],
    })
  })
})
