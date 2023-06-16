import { mockFunction, render, screen } from '@app/test-utils'

import { usePrimary } from '@app/hooks/usePrimary'
import { useBreakpoint } from '@app/utils/BreakpointProvider'
import { formatExpiry, shortenAddress } from '@app/utils/utils'

import { OwnerProfileButton } from './ProfileButton'

jest.mock('@app/utils/BreakpointProvider')
jest.mock('@app/hooks/usePrimary')

const mockUseBreakpoint = mockFunction(useBreakpoint)
mockUseBreakpoint.mockReturnValue({
  xs: true,
  sm: true,
  md: true,
  lg: false,
  xl: false,
})

const ADDRESS_TYPE = {
  NoPrimary: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
  Primary: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
}
const mockUsePrimary = mockFunction(usePrimary)
mockUsePrimary.mockImplementation((address, skip) => {
  const isNoPrimary = ADDRESS_TYPE.NoPrimary === address
  return {
    data: {
      // eslint-disable-next-line no-nested-ternary
      name: skip ? undefined : isNoPrimary ? undefined : 'primary.eth',
      beautifiedName: isNoPrimary ? undefined : 'primary.eth',
    },
    isLoading: false,
  }
})

describe('<OwnerProfileButton/>', () => {
  it('renders', () => {
    render(<OwnerProfileButton iconKey="name.owner" value="name.eth" />)
    expect(screen.getByTestId('owner-profile-button-name.owner')).toBeInTheDocument()
  })

  describe('expiry', () => {
    it('should show date if expiry exists', () => {
      const date = new Date()
      const dateStr = formatExpiry(date)
      const timestamp = date.getTime()
      render(<OwnerProfileButton iconKey="name.expiry" value={dateStr} timestamp={timestamp} />)
      const element = screen.getByTestId('owner-profile-button-name.expiry')
      expect(element).toBeInTheDocument()
      expect(element).toHaveTextContent(`name.expiry${dateStr}`)
      expect(element).toHaveAttribute('data-timestamp', timestamp.toString())
    })

    it('should show no expiry if expiry does not exist', () => {
      render(<OwnerProfileButton iconKey="name.expiry" value="" timestamp={0} />)
      const element = screen.getByTestId('owner-profile-button-name.expiry')
      expect(element).toBeInTheDocument()
      expect(element).toHaveTextContent(`name.expiryname.noexpiry`)
      expect(element).toHaveAttribute('data-timestamp', '0')
    })
  })

  describe('address', () => {
    it('should display no owner if there no address exists', () => {
      render(<OwnerProfileButton iconKey="name.owner" value="" />)
      const element = screen.getByTestId('owner-profile-button-name.owner')
      expect(element).toBeInTheDocument()
      expect(element).toHaveTextContent(`name.ownername.notowned`)
    })

    it('should display address if address does not have primary name', () => {
      render(<OwnerProfileButton iconKey="name.owner" value={ADDRESS_TYPE.NoPrimary} />)
      const element = screen.getByTestId('owner-profile-button-name.owner')
      expect(element).toBeInTheDocument()
      expect(element).toHaveTextContent(`name.owner${shortenAddress(ADDRESS_TYPE.NoPrimary)}`)
    })

    it('should display primary if address does have primary name', async () => {
      render(<OwnerProfileButton iconKey="name.owner" value={ADDRESS_TYPE.Primary} />)
      const element = screen.getByTestId('owner-profile-button-name.owner')
      expect(element).toBeInTheDocument()
      expect(element).toHaveTextContent(`name.ownerprimary.eth`)
    })
  })

  describe('parent', () => {
    it('should display no parent if value does not exist', () => {
      render(<OwnerProfileButton iconKey="name.parent" value="" />)
      const element = screen.getByTestId('owner-profile-button-name.parent')
      expect(element).toBeInTheDocument()
      expect(element).toHaveTextContent(`name.parentname.noparent`)
    })

    it('should display link to /tld/eth if value is tld', () => {
      render(<OwnerProfileButton iconKey="name.parent" value="eth" />)
      const element = screen.getByTestId('owner-profile-button-name.parent')
      expect(element).toBeInTheDocument()
      expect(element).toHaveTextContent(`name.parenteth`)
      expect(element).toHaveAttribute('href', '/tld/eth')
    })

    it('should display link to /name.eth if value is not tld', () => {
      render(<OwnerProfileButton iconKey="name.parent" value="name.eth" />)
      const element = screen.getByTestId('owner-profile-button-name.parent')
      expect(element).toBeInTheDocument()
      expect(element).toHaveTextContent(`name.parentname.eth`)
      expect(element).toHaveAttribute('href', '/name.eth')
    })
  })
})
