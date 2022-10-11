import { fireEvent, mockFunction, render, screen, waitFor } from '@app/test-utils'

import { useRouter } from 'next/router'
import { ComponentProps } from 'react'
import { useAccount } from 'wagmi'

import { NFTWithPlaceholder } from '@app/components/NFTWithPlaceholder'
import { NameSnippetMobile } from '@app/components/pages/profile/NameSnippetMobile'
import { OwnerButton } from '@app/components/pages/profile/OwnerButton'
import More from '@app/components/pages/profile/[name]/details/AdvancedTab/AdvancedTab'
import { RecordsTab } from '@app/components/pages/profile/[name]/details/RecordsTab'
import { SubnamesTab } from '@app/components/pages/profile/[name]/details/SubnamesTab'
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
  }

  // default mock component implementations
  mockNameSnippetMobile.mockImplementation(() => <div>NameSnippetMobile</div>)
  mockNFTWithPlaceholder.mockImplementation(() => <div>NFTWithPlaceholder</div>)
  mockOwnerButton.mockImplementation(({ label }) => <div>{label}</div>)
  mockMore.mockImplementation(() => <div>MoreTab</div>)
  mockSubnamesTab.mockImplementation(() => <div>SubnamesTab</div>)
  mockRecordsTab.mockImplementation(() => <div>RecordsTab</div>)

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

  it('should display controller button if user is controller', () => {
    const props = { ...defaultProps }
    props.ownerData.ownershipLevel = 'controller'

    render(<Details {...props} />)
    expect(screen.getByText('name.controller')).toBeInTheDocument()
  })

  it('should display registrant button if user is registrant', () => {
    const props = { ...defaultProps }
    props.ownerData.ownershipLevel = 'registrant'

    render(<Details {...props} />)
    expect(screen.getByText('name.registrant')).toBeInTheDocument()
  })
})

describe('Page', () => {
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

    // mock implementation of useRouter that returns default data
    mockUseRouter.mockImplementation(() => ({
      query: {
        name: '',
      },
      push: mockPush,
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

    expect(mockPush).toHaveBeenCalled()

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
