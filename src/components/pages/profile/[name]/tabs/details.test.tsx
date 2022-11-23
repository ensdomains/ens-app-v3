import { fireEvent, mockFunction, render, screen, waitFor } from '@app/test-utils'

import { useRouter } from 'next/router'
import { ComponentProps } from 'react'
import { useAccount } from 'wagmi'

import { NFTWithPlaceholder } from '@app/components/NFTWithPlaceholder'
import { NameSnippetMobile } from '@app/components/pages/profile/NameSnippetMobile'
import { OwnerButton } from '@app/components/pages/profile/OwnerButton'
import More from '@app/components/pages/profile/[name]/tabs/MoreTab/MoreTab'
import { RecordsTab } from '@app/components/pages/profile/[name]/tabs/RecordsTab'
import { SubnamesTab } from '@app/components/pages/profile/[name]/tabs/SubnamesTab'
import { useChainId } from '@app/hooks/useChainId'
import { useNameDetails } from '@app/hooks/useNameDetails'
import Page, { Details } from '@app/pages/profile/details'
import { useBreakpoint } from '@app/utils/BreakpointProvider'

// setting up jest mocks
jest.mock('@app/components/NFTWithPlaceholder')
jest.mock('@app/components/pages/profile/NameSnippetMobile')
jest.mock('@app/components/pages/profile/OwnerButton')
jest.mock('@app/components/pages/profile/[name]/details/AdvancedTab/AdvancedTab')
jest.mock('@app/components/pages/profile/[name]/details/SubnamesTab')
jest.mock('@app/components/pages/profile/[name]/details/RecordsTab')
jest.mock('@app/utils/BreakpointProvider')
jest.mock('next/router')
jest.mock('@app/hooks/useChainId')
jest.mock('@app/hooks/useNameDetails')
jest.mock('wagmi')

const mockNFTWithPlaceholder = mockFunction(NFTWithPlaceholder)
const mockNameSnippetMobile = mockFunction(NameSnippetMobile)
const mockOwnerButton = mockFunction(OwnerButton)
const mockMore = mockFunction(More)
const mockSubnamesTab = mockFunction(SubnamesTab)
const mockRecordsTab = mockFunction(RecordsTab)
const mockUseBreakpoint = mockFunction(useBreakpoint)
const mockUseRouter = mockFunction(useRouter)
const mockUseChainId = mockFunction(useChainId)
const mockUseNameDetails = mockFunction(useNameDetails)
const mockUseAccount = mockFunction(useAccount)

type DetailsProps = ComponentProps<typeof Details>

describe('Details', () => {
  const mockRouterObject = {
    query: {
      name: 'nick.eth',
    },
  }

  // default props for <Details /> component
  const defaultProps: DetailsProps = {
    expiryDate: new Date(),
    breakpoints: {
      xs: false,
      sm: false,
      md: false,
      lg: false,
      xl: false,
    },
    ownerData: {
      registrant: '0xregistrant',
      owner: '0xowner',
      ownershipLevel: 'nameWrapper',
    },
    normalisedName: 'nick.eth',
    chainId: 1,
    selfAbilities: {
      canEdit: true,
      canSend: true,
      canChangeOwner: true,
      canChangeRegistrant: true,
    },
    wrapperData: {
      fuseObj: {
        PARENT_CANNOT_CONTROL: true,
      },
    },
  }

  // default mock component implementations
  mockNameSnippetMobile.mockImplementation(() => <div>NameSnippetMobile</div>)
  mockNFTWithPlaceholder.mockImplementation(() => <div>NFTWithPlaceholder</div>)
  mockOwnerButton.mockImplementation(({ label }) => <div>{label}</div>)
  mockMore.mockImplementation(() => <div>MoreTab</div>)
  mockSubnamesTab.mockImplementation(() => <div>SubnamesTab</div>)
  mockRecordsTab.mockImplementation(() => <div>RecordsTab</div>)
  mockUseAccount.mockReturnValue({ address: '0x123' })
  mockUseNameDetails.mockReturnValue({
    ownerData: { owner: '0x123' },
    profile: { resolverAddress: '0x456' },
    isLoading: false,
  })

  it('should display NFT on its own on larger screens', () => {
    // render Details component with breakpoint.md === true (larger than md)
    const props: DetailsProps = {
      ...defaultProps,
      breakpoints: { md: true },
      ownerData: { registrant: '', owner: '', ownershipLevel: 'registrar' },
    }
    mockUseRouter.mockReturnValue(mockRouterObject)

    render(<Details {...props} />)
    expect(screen.getByText('NFTWithPlaceholder')).toBeInTheDocument()
  })
  it('should display mobile name snippet on smaller screens', () => {
    // render Details component with breakpoint.md === false (smaller than md)
    const props: DetailsProps = {
      ...defaultProps,
      breakpoints: { md: false },
      ownerData: undefined,
    }

    render(<Details {...props} />)
    expect(screen.getByText('NameSnippetMobile')).toBeInTheDocument()
  })
  it('should display owner button if user is nameWrapper owner', () => {
    const props = { ...defaultProps }
    render(<Details {...props} />)
    expect(screen.getByText('name.owner')).toBeInTheDocument()
  })

  it('should display manager button if user is manager', () => {
    const props = { ...defaultProps }
    props.ownerData.ownershipLevel = 'registrar'

    render(<Details {...props} />)
    expect(screen.getByText('name.manager')).toBeInTheDocument()
  })

  it('should display owner button if user is registrant', () => {
    const props = { ...defaultProps }
    props.ownerData.ownershipLevel = 'registrar'

    render(<Details {...props} />)
    expect(screen.getByText('name.manager')).toBeInTheDocument()
  })
})

describe('Page', () => {
  window.ResizeObserver = jest.fn()
  ;(window.ResizeObserver as jest.Mock).mockImplementation(() => ({
    observe: jest.fn(),
    disconnect: jest.fn(),
  }))
  it('should set the correct tab when clicked', async () => {
    // mock useBreakpoint implementation that returns default breakpoint values
    mockUseBreakpoint.mockImplementation(() => ({
      xs: false,
      sm: false,
      md: false,
      lg: false,
      xl: false,
    }))

    const mockPush = jest.fn()
    const mockReplace = jest.fn()

    // mock implementation of useRouter that returns default data
    mockUseRouter.mockImplementation(() => ({
      query: {
        name: '',
      },
      push: mockPush,
      replace: mockReplace,
    }))

    // mock useChainId, useNameDetails and useAccount
    mockUseChainId.mockImplementation(() => 1)
    mockUseNameDetails.mockImplementation(() => ({
      name: '',
      owner: '',
      registrant: '',
      isLoading: false,
      error: null,
    }))
    mockUseAccount.mockImplementation(() => ({
      address: '0x123',
      isLoggedIn: true,
      isLoading: false,
    }))

    const { rerender } = render(<Page />)

    // click more tab on Page
    fireEvent.click(screen.getByText('details.tabs.advanced.label'))

    expect(mockReplace).toHaveBeenCalled()

    mockUseRouter.mockImplementation(() => ({
      query: {
        name: '',
        tab: 'advanced',
      },
      push: mockPush,
    }))

    rerender(<Page />)

    await waitFor(() => {
      expect(screen.getByText('MoreTab')).toBeInTheDocument()
    })
  })
  it('should set the correct tab based on router query', () => {
    mockUseRouter.mockImplementation(() => ({
      query: {
        name: '',
        tab: 'advanced',
      },
      push: jest.fn(),
    }))

    render(<Page />)

    expect(screen.getByText('MoreTab')).toBeInTheDocument()
  })
})
