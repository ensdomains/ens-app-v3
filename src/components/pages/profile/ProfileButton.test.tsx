import { mockFunction, render, screen } from '@app/test-utils'

import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { useCoinChain } from '@app/hooks/chain/useCoinChain'
import { usePrimaryName } from '@app/hooks/ensjs/public/usePrimaryName'
import { useBreakpoint } from '@app/utils/BreakpointProvider'
import { formatExpiry, shortenAddress } from '@app/utils/utils'

import { AddressProfileButton, OwnerProfileButton } from './ProfileButton'

vi.mock('@app/utils/BreakpointProvider')
vi.mock('@app/hooks/ensjs/public/usePrimaryName')
vi.mock('@app/hooks/chain/useCoinChain')

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
const mockUsePrimaryName = mockFunction(usePrimaryName)
mockUsePrimaryName.mockImplementation(({ address, enabled }) => {
  const isNoPrimary = ADDRESS_TYPE.NoPrimary === address
  return {
    data: enabled
      ? {
          // eslint-disable-next-line no-nested-ternary
          name: isNoPrimary ? undefined : 'primary.eth',
          beautifiedName: isNoPrimary ? undefined : 'primary.eth',
        }
      : undefined,
    isLoading: false,
  }
})

const mockUseCoinChain = mockFunction(useCoinChain)
mockUseCoinChain.mockImplementation(({ coinName }) => {
  if (coinName !== 'eth') {
    return {
      data: null,
    }
  }
  return {
    data: {
      id: 1,
      name: 'Ethereum',
      blockExplorers: {
        default: {
          name: 'Etherscan',
          url: 'https://etherscan.io',
          apiUrl: 'https://api.etherscan.io/api',
        },
      },
    },
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
    })

    it('should display link to /name.eth if value is not tld', () => {
      render(<OwnerProfileButton iconKey="name.parent" value="name.eth" />)
      const element = screen.getByTestId('owner-profile-button-name.parent')
      expect(element).toBeInTheDocument()
      expect(element).toHaveTextContent(`name.parentname.eth`)
    })
  })
})

describe('<AddressProfileButton/>', () => {
  it('renders', () => {
    render(<AddressProfileButton iconKey="eth" value={ADDRESS_TYPE.NoPrimary} />)
    expect(screen.getByTestId('address-profile-button-eth')).toBeInTheDocument()
  })

  describe('dropdown', () => {
    const user = userEvent.setup()

    it('should render dropdown on click', async () => {
      render(<AddressProfileButton iconKey="eth" value={ADDRESS_TYPE.NoPrimary} />)
      const addressProfileBtn = screen.getByTestId('address-profile-button-eth')

      await user.click(addressProfileBtn)
      expect(screen.getByTestId('dropdown-menu')).toBeInTheDocument()
    })

    it('should have view address', async () => {
      render(<AddressProfileButton iconKey="eth" value={ADDRESS_TYPE.NoPrimary} />)
      const addressProfileBtn = screen.getByTestId('address-profile-button-eth')
      await user.click(addressProfileBtn)

      const viewAddressButton = screen.getAllByText((content, element) => {
        return element?.tagName?.toLowerCase() === 'a' && content?.toLowerCase() === 'view address'
      })

      expect(viewAddressButton.length).toBe(1)
    })

    it('should have copy address', async () => {
      render(<AddressProfileButton iconKey="eth" value={ADDRESS_TYPE.NoPrimary} />)
      const addressProfileBtn = screen.getByTestId('address-profile-button-eth')
      await user.click(addressProfileBtn)

      const copyButton = screen.getAllByText((content, element) => {
        return (
          element?.tagName?.toLowerCase() === 'button' && content?.toLowerCase() === 'copy address'
        )
      })

      expect(copyButton.length).toBe(1)
    })

    it('should have view on block explorer', async () => {
      render(<AddressProfileButton iconKey="eth" value={ADDRESS_TYPE.NoPrimary} />)
      const addressProfileBtn = screen.getByTestId('address-profile-button-eth')
      await user.click(addressProfileBtn)

      const viewBlockExplorerBtn = screen.getAllByText((content, element) => {
        return (
          element?.tagName?.toLowerCase() === 'a' && content?.toLowerCase() === 'view on etherscan'
        )
      })

      expect(viewBlockExplorerBtn.length).toBe(1)
    })

    it('should not have view address', async () => {
      render(<AddressProfileButton iconKey="doge" value={ADDRESS_TYPE.NoPrimary} />)
      const addressProfileBtn = screen.getByTestId('address-profile-button-doge')
      await user.click(addressProfileBtn)

      const viewAddressButton = screen.queryByText('view address')

      expect(viewAddressButton).not.toBeInTheDocument()
    })

    it('should not have view on { block explorer }', async () => {
      render(<AddressProfileButton iconKey="doge" value={ADDRESS_TYPE.NoPrimary} />)
      const addressProfileBtn = screen.getByTestId('address-profile-button-doge')
      await user.click(addressProfileBtn)

      const viewBlockExplorerButton = screen.queryByText('view on')

      expect(viewBlockExplorerButton).not.toBeInTheDocument()
    })
  })
})
