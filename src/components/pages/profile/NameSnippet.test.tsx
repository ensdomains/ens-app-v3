import { render, screen } from '@app/test-utils'

import { NameDetailSnippet } from './NameSnippet'

jest.mock('@app/utils/BreakpointProvider')

jest.setTimeout(5000)

jest.mock('@app/utils/EnsProvider', () => ({
  useEns: () => ({
    getName: jest.fn(),
  }),
}))

describe('NameSnippetMobile', () => {
  const baseMockData = {
    name: 'nick.eth',
    network: 1,
  }

  it('should show the expiry date if given', () => {
    const mockData = {
      ...baseMockData,
      expiryDate: new Date(1654782805000),
      ownerData: {},
    }
    render(<NameDetailSnippet {...mockData} />)
    expect(screen.getByText('June 9, 2022')).toBeVisible()
  })
  it('should show owner if given', () => {
    const mockData = {
      ...baseMockData,
      ownerData: {
        owner: '0x983110309620D911731Ac0932219af06091b6744',
      },
    }
    render(<NameDetailSnippet {...mockData} />)
    expect(screen.getByText('0x983...b6744')).toBeVisible()
  })
  it('should show registrant if given', () => {
    const mockData = {
      ...baseMockData,
      ownerData: {
        registrant: '0x983110309620D911731Ac0932219af06091b6744',
      },
    }
    render(<NameDetailSnippet {...mockData} />)
    expect(screen.getByText('0x983...b6744')).toBeVisible()
  })
  it('should show dnsOwner if given', () => {
    const mockData = {
      ...baseMockData,
      ownerData: {},
      dnsOwner: '0x983110309620D911731Ac0932219af06091b6744',
    }
    render(<NameDetailSnippet {...mockData} />)
    expect(screen.getByText('0x983...b6744')).toBeVisible()
  })
  it('should show button if showButton is true', () => {
    const mockData = {
      ...baseMockData,
      ownerData: {},
      showButton: true,
    }
    render(<NameDetailSnippet {...mockData} />)
    expect(screen.getByText('wallet.viewDetails')).toBeVisible()
  })
})
