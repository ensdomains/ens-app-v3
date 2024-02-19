import { mockFunction, render, screen } from '@app/test-utils'

import { describe, expect, it, vi } from 'vitest'
import { useAccount } from 'wagmi'

import { useAbilities } from '@app/hooks/abilities/useAbilities'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'

import { ExtendButton } from './ExtendButton'

vi.mock('@app/hooks/abilities/useAbilities')
vi.mock('@app/transaction-flow/TransactionFlowProvider')

const mockUseAccount = mockFunction(useAccount)
const mockUseAbilities = mockFunction(useAbilities)
const mockUseTransactionFlow = mockFunction(useTransactionFlow)

const mockusePreparedDataInput = vi.fn()

mockUseAccount.mockReturnValue({ address: '0x123' })
mockUseAbilities.mockReturnValue({})
mockUseTransactionFlow.mockReturnValue({ usePreparedDataInput: () => mockusePreparedDataInput })

describe('ExtendButton', () => {
  it('should not render if canExtend is false', () => {
    mockUseAbilities.mockReturnValue({ data: { canExtend: false } })
    render(<ExtendButton name="test.eth" />)
    const element = screen.queryByText('action.extend')
    expect(element).not.toBeInTheDocument()
  })
  it('should render if canExtend is true', () => {
    mockUseAbilities.mockReturnValue({ data: { canExtend: true } })
    render(<ExtendButton name="test.eth" />)
    const element = screen.queryByText('action.extend')
    expect(element).toBeInTheDocument()
  })
  it('should call showExtendNamesInput with correct arguments', () => {
    render(<ExtendButton name="test.eth" />)
    screen.queryByText('action.extend')?.click()
    expect(mockusePreparedDataInput).toHaveBeenCalledWith('extend-names-test.eth', {
      isSelf: undefined,
      names: ['test.eth'],
    })
  })
})
