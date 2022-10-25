import { mockFunction, render, screen } from '@app/test-utils'

import { useProfileActions } from '@app/hooks/useProfileActions'
import { useBreakpoint } from '@app/utils/BreakpointProvider'

import { NameSnippetMobile } from './NameSnippetMobile'

jest.mock('@app/utils/BreakpointProvider')
jest.mock('@app/hooks/useProfileActions')

const mockUseBreakpoint = mockFunction(useBreakpoint)
const mockUseProfileActions = mockFunction(useProfileActions)

describe('NameSnippetMobile', () => {
  mockUseBreakpoint.mockReturnValue({
    xs: true,
    sm: false,
    md: false,
    lg: false,
    xl: false,
  })

  const baseMockData = {
    name: 'nick.eth',
    network: 1,
  }

  mockUseProfileActions.mockReturnValue({
    profileActions: undefined,
  })

  it('should show the expiry date if given', () => {
    const mockData = {
      ...baseMockData,
      expiryDate: new Date(1654782805000),
      canSend: false,
    }
    render(<NameSnippetMobile {...mockData} />)
    expect(screen.getByText('June 9, 2022')).toBeVisible()
  })
  it('should not show the expiry date if none given', () => {
    const mockData = {
      ...baseMockData,
      canSend: false,
    }
    render(<NameSnippetMobile {...mockData} />)
    expect(screen.queryByText('June 9, 2022')).not.toBeInTheDocument()
  })
  it('should show the extend button if expiry date is given', () => {
    const mockData = {
      ...baseMockData,
      expiryDate: new Date('1654782805000'),
      canSend: false,
    }
    render(<NameSnippetMobile {...mockData} />)
    expect(screen.getByTestId('extend-button')).toBeVisible()
  })
  it('should show the send button if canSend is true', () => {
    const mockData = {
      ...baseMockData,
      expiryDate: new Date('1654782805000'),
      canSend: true,
    }
    render(<NameSnippetMobile {...mockData} />)
    expect(screen.getByTestId('send-button')).toBeVisible()
  })
  it('should show the send button if canSend is true and there is no expiry date given', () => {
    const mockData = {
      ...baseMockData,
      canSend: true,
    }
    render(<NameSnippetMobile {...mockData} />)
    expect(screen.getByTestId('send-button')).toBeVisible()
  })
})
