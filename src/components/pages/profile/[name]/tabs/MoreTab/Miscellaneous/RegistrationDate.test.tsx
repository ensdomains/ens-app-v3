import { mockFunction, render, screen } from '@app/test-utils'

import { describe, expect, it, vi } from 'vitest'

import { useChainName } from '@app/hooks/chain/useChainName'
import { formatDateTime } from '@app/utils/utils'

import { RegistrationDate } from './RegistrationDate'

vi.mock('@app/hooks/chain/useChainName')

const mockUseChainName = mockFunction(useChainName)

describe('RegistrationDate', () => {
  mockUseChainName.mockReturnValue('mainnet')

  it('should render the registration date', () => {
    const registrationDate = new Date('2021-01-01T00:00:00.000Z')
    // @ts-expect-error
    render(<RegistrationDate {...{ registrationData: { registrationDate } }} />)
    const element = screen.getByText('January 1, 2021')
    expect(element).toBeInTheDocument()
  })

  it('should render the registration time correctly', () => {
    const registrationDate = new Date('2021-01-01T00:00:00.000Z')
    // @ts-expect-error
    render(<RegistrationDate {...{ registrationData: { registrationDate } }} />)
    const expectedTime = formatDateTime(registrationDate)
    const element = screen.getByText(expectedTime)
    expect(element).toBeInTheDocument()
  })

  it('should not render the component when registrationData is undefined', () => {
    render(<RegistrationDate {...{ registrationData: undefined }} />)
    const element = screen.queryByText('name.registered')
    expect(element).not.toBeInTheDocument()
  })

  it('should render the correct EtherScan link', () => {
    const registrationDate = new Date('2021-01-01T00:00:00.000Z')
    const transactionHash = '0x1234567890abcdef'
    render(<RegistrationDate {...{ registrationData: { registrationDate, transactionHash } }} />)
    const element = screen.getByText('action.view')
    expect(element).toHaveAttribute('href', `https://etherscan.io/tx/0x1234567890abcdef`)
  })
})
