import {
  fireEvent,
  render,
  screen,
  mockFunction,
  waitFor,
} from '@app/test-utils'

import { useRouter } from 'next/router'
import { useAccount } from 'wagmi'

import { NFTWithPlaceholder } from '@app/components/NFTWithPlaceholder'
import { NameSnippetMobile } from '@app/components/pages/profile/NameSnippetMobile'
import { OwnerButton } from '@app/components/pages/profile/OwnerButton'
import More from '@app/components/pages/profile/[name]/details/AdvancedTab/AdvancedTab'
import { RecordsTab } from '@app/components/pages/profile/[name]/details/RecordsTab'
import { SubnamesTab } from '@app/components/pages/profile/[name]/details/SubnamesTab'
import { useBreakpoint } from '@app/utils/BreakpointProvider'

import { useChainId } from '@app/hooks/useChainId'
import { useNameDetails } from '@app/hooks/useNameDetails'

import Page, { calculateSelfAbilities, Details } from './details'

// setting up jest mocks
jest.mock('@app/components/NFTWithPlaceholder')
jest.mock('@app/components/pages/profile/NameSnippetMobile')
jest.mock('@app/components/pages/profile/OwnerButton')
jest.mock('@app/components/pages/profile/[name]/details/MoreTab/MoreTab')
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

describe('calculateSelfAbilities', () => {
  it('should return all false if there is no address or ownerData', () => {
    const result = calculateSelfAbilities()
    expect(result).toEqual({
      canEdit: false,
      canSend: false,
      canChangeOwner: false,
      canChangeRegistrant: false,
    })
  })
  it('should return true for all abilites is self is registrant AND owner', () => {
    const result = calculateSelfAbilities('0x123', {
      registrant: '0x123',
      owner: '0x123',
    })
    expect(result).toEqual({
      canEdit: true,
      canSend: true,
      canChangeOwner: true,
      canChangeRegistrant: true,
    })
  })
  it('should return correct values if self is registrant but NOT owner', () => {
    const result = calculateSelfAbilities('0x123', {
      registrant: '0x123',
      owner: '0x456',
    })
    expect(result).toEqual({
      canEdit: false,
      canSend: true,
      canChangeOwner: true,
      canChangeRegistrant: true,
    })
  })
  it('should return correct values if self is owner but NOT registrant', () => {
    const result = calculateSelfAbilities('0x456', {
      registrant: '0x123',
      owner: '0x456',
    })
    expect(result).toEqual({
      canEdit: true,
      canSend: false,
      canChangeOwner: true,
      canChangeRegistrant: false,
    })
  })
  it('should return correct values there is no registrant but the user is the owner', () => {
    const result = calculateSelfAbilities('0x456', {
      owner: '0x456',
    })
    expect(result).toEqual({
      canEdit: true,
      canSend: true,
      canChangeOwner: true,
      canChangeRegistrant: true,
    })
  })
})

describe('Details', () => {
  // default props for <Details /> component
  const defaultProps = {
    expiryDate: new Date(),
    breakpoints: {
      xs: false,
      sm: false,
      md: false,
      lg: false,
      xl: false,
    },
    address: '0x123',
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
    const props = { ...defaultProps }
    props.breakpoints.md = true
    props.ownerData.registrant = ''
    props.ownerData.owner = ''

    render(<Details {...props} />)
    expect(screen.getByText('NFTWithPlaceholder')).toBeInTheDocument()
  })
  it('should display mobile name snippet on smaller screens', () => {
    // render Details component with breakpoint.md === false (smaller than md)
    const props = { ...defaultProps }
    props.breakpoints.md = false

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

    // mock implementation of useRouter that returns default data
    mockUseRouter.mockImplementation(() => ({
      query: {
        name: '',
      },
      push: jest.fn(),
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
    }))

    render(<Page />)

    // click more tab on Page
    fireEvent.click(screen.getByText('details.tabs.more.label'))

    await waitFor(() => {
      expect(screen.getByText('MoreTab')).toBeInTheDocument()
    })
  })
})
