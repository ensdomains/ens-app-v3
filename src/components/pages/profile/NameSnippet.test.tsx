import { render, screen } from '@app/test-utils'

import { ComponentProps } from 'react'

import { NameDetailSnippet } from './NameSnippet'

type NameDetailSnippetProps = ComponentProps<typeof NameDetailSnippet>

jest.mock('next/router', () => jest.requireActual('next-router-mock'))
jest.mock('@app/utils/BreakpointProvider')

jest.setTimeout(5000)
describe('NameSnippetMobile', () => {
  const baseMockData = {
    name: 'nick.eth',
    network: 1,
  }

  it('should show the expiry date if given', () => {
    const mockData = {
      ...baseMockData,
      expiryDate: new Date(1654782805000),
      ownerData: {
        owner: '0x983110309620D911731Ac0932219af06091b6744',
        ownershipLevel: 'registry',
      },
      wrapperData: {} as any,
    } as NameDetailSnippetProps
    render(<NameDetailSnippet {...mockData} />)
    expect(screen.getByText('June 9, 2022')).toBeVisible()
  })
  it('should show owner if given', () => {
    const mockData = {
      ...baseMockData,
      ownerData: {
        owner: '0x983110309620D911731Ac0932219af06091b6744',
        ownershipLevel: 'registry',
      },
      wrapperData: {} as any,
    } as NameDetailSnippetProps
    render(<NameDetailSnippet {...mockData} />)
    expect(screen.getByText('0x983...b6744')).toBeVisible()
  })
  it('should show registrant if given', () => {
    const mockData = {
      ...baseMockData,
      ownerData: {
        owner: '0x983110309620D911731Ac0932219af06091b6744',
        registrant: '0x983110309620D911731Ac0932219af06091b6744',
        ownershipLevel: 'registrar',
      },
      wrapperData: {} as any,
    } as NameDetailSnippetProps
    render(<NameDetailSnippet {...mockData} />)
    expect(screen.getAllByText('0x983...b6744')).toHaveLength(2)
  })
  it('should show dnsOwner if given', () => {
    const mockData = {
      ...baseMockData,
      ownerData: {} as any,
      wrapperData: {} as any,
      dnsOwner: '0x983110309620D911731Ac0932219af06091b6744',
    } as NameDetailSnippetProps
    render(<NameDetailSnippet {...mockData} />)
    expect(screen.getByText('0x983...b6744')).toBeVisible()
  })
  it('should show button if showButton is true', () => {
    const mockData = {
      ...baseMockData,
      ownerData: {} as any,
      wrapperData: {} as any,
      showButton: true,
    } as NameDetailSnippetProps
    render(<NameDetailSnippet {...mockData} />)
    expect(screen.getByText('wallet.viewDetails')).toBeVisible()
  })
})
