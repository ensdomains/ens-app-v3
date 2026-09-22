import { mockFunction, render, screen } from '@app/test-utils'

import type { ReactNode } from 'react'
import { labelhash } from 'viem'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { Mock } from 'vitest'

import { useAbilities } from '@app/hooks/abilities/useAbilities'
import { useIsOffchainName } from '@app/hooks/ensjs/dns/useIsOffchainName'
import { usePrimaryName } from '@app/hooks/ensjs/public/usePrimaryName'
import { useProfileActions } from '@app/hooks/pages/profile/[name]/profile/useProfileActions/useProfileActions'
import { useBasicName } from '@app/hooks/useBasicName'
import { useNameDetails } from '@app/hooks/useNameDetails'
import { useOwners } from '@app/hooks/useOwners'
import { useProfile } from '@app/hooks/useProfile'
import { useVerifiedRecords } from '@app/hooks/verification/useVerifiedRecords/useVerifiedRecords'
import { makeAppendVerificationProps } from '@app/hooks/verification/useVerifiedRecords/utils/makeAppendVerificationProps'
import { useBreakpoint } from '@app/utils/BreakpointProvider'

import ProfileContent, { NameAvailableBanner } from './Profile'

vi.mock('@app/hooks/useBasicName')
vi.mock('@app/hooks/useProfile')
vi.mock('@app/hooks/useNameDetails')
vi.mock('@app/hooks/abilities/useAbilities')
vi.mock('@app/hooks/ensjs/dns/useIsOffchainName')
vi.mock('@app/hooks/ensjs/public/usePrimaryName')
vi.mock('@app/hooks/pages/profile/[name]/profile/useProfileActions/useProfileActions')
vi.mock('@app/hooks/useOwners')
vi.mock('@app/hooks/verification/useVerifiedRecords/useVerifiedRecords')
vi.mock('@app/hooks/pages/profile/useRenew/useRenew')
vi.mock('@app/components/ProfileSnippet', () => ({
  ProfileSnippet: ({
    button,
    children,
    name,
  }: {
    button?: string
    children?: ReactNode
    name: string
  }) => (
    <section aria-label="Name profile">
      <h2>{name}</h2>
      {button ? <button type="button">{button}</button> : null}
      {children}
    </section>
  ),
}))
vi.mock('@app/components/pages/profile/ProfileDetails', () => ({
  ProfileDetails: ({
    addresses,
    expiryDate,
    owners,
  }: {
    addresses: { value: string }[]
    expiryDate?: Date
    owners: { address: string }[]
  }) => (
    <section aria-label="Profile details">
      {owners.map(({ address }) => (
        <div key={address}>Owner: {address}</div>
      ))}
      {addresses.map(({ value }) => (
        <div key={value}>Address: {value}</div>
      ))}
      {expiryDate ? <div>Name expires: {expiryDate.toISOString()}</div> : null}
    </section>
  ),
}))
vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(),
}))
vi.mock('@app/hooks/useProtectedRoute', () => ({
  useProtectedRoute: vi.fn(),
}))
vi.mock('@app/utils/BreakpointProvider')
vi.mock('next/router', async () => await vi.importActual('next-router-mock'))
const mockUseBreakpoint = mockFunction(useBreakpoint)
const baseBreakpoints: ReturnType<typeof useBreakpoint> = {
  xs: true,
  sm: true,
  md: true,
  lg: false,
  xl: false,
}
const mockUseBasicName = mockFunction(useBasicName)
const mockUseProfile = mockFunction(useProfile)
const mockUseNameDetails = mockFunction(useNameDetails)
const mockUseAbilities = mockFunction(useAbilities)
const mockUseIsOffchainName = mockFunction(useIsOffchainName)
const mockUsePrimaryName = mockFunction(usePrimaryName)
const mockUseProfileActions = mockFunction(useProfileActions)
const mockUseOwners = mockFunction(useOwners)
const mockUseVerifiedRecords = mockFunction(useVerifiedRecords)
const appendVerificationProps = makeAppendVerificationProps([])

const setupDesktopLayout = () => {
  window.ResizeObserver = vi.fn()
  ;(window.ResizeObserver as Mock).mockImplementation(() => ({
    observe: vi.fn(),
    disconnect: vi.fn(),
  }))
  mockUseBreakpoint.mockReturnValue({ ...baseBreakpoints, lg: true, xl: true })
}

beforeEach(() => {
  mockUseAbilities.mockReturnValue({ data: {}, isLoading: false })
  mockUseIsOffchainName.mockReturnValue(false)
  mockUsePrimaryName.mockReturnValue({ data: undefined, isLoading: false })
  mockUseProfileActions.mockReturnValue({ profileActions: undefined, isLoading: false })
  mockUseOwners.mockReturnValue([])
  mockUseVerifiedRecords.mockReturnValue({
    data: [],
    appendVerificationProps,
  })
})

describe('ProfileContent - Unsupported TLDs', () => {
  it('should display the expiry date of the name', () => {
    const date = new Date(0)
    render(<NameAvailableBanner {...{ normalisedName: 'nick.eth', expiryDate: date }} />)
    expect(
      screen.getByText('1970', {
        exact: false,
      }),
    ).toBeVisible()
  })
  it('should show only the "profile" tab for unsupported TLDs', () => {
    setupDesktopLayout()
    mockUseBasicName.mockReturnValue({
      isValid: true,
      name: 'test',
      normalisedName: 'test',
    })
    mockUseProfile.mockReturnValue({
      data: undefined,
      isLoading: false,
    })
    mockUseNameDetails.mockReturnValue({
      unsupported: true,
      name: 'test.unsupportedTLD',
      is2LD: false,
      isValid: true,
      normalisedName: 'test.unsupportedTLD',
    })

    render(<ProfileContent isSelf={false} isLoading={false} name={'test.unsupportedTLD'} />)

    // Check for the visibility of tabs
    expect(screen.queryByTestId('profile-tab')).toBeInTheDocument()
    expect(screen.queryByTestId('records-tab')).not.toBeInTheDocument()
    expect(screen.queryByTestId('ownership-tab')).not.toBeInTheDocument()
    expect(screen.queryByTestId('subnames-tab')).not.toBeInTheDocument()
    expect(screen.queryByTestId('permissions-tab')).not.toBeInTheDocument()
    expect(screen.queryByTestId('more-tab')).not.toBeInTheDocument()
  })
})

describe('ProfileContent - short .eth names', () => {
  it('should not flash an error or profile while short-name ownership is loading', () => {
    setupDesktopLayout()
    mockUseNameDetails.mockReturnValue({
      unsupported: false,
      error: null,
      profile: undefined,
      name: '12.eth',
      normalisedName: '12.eth',
      beautifiedName: '12.eth',
      isValid: true,
      isShort: true,
      isETH: true,
      is2LD: true,
      isCachedData: false,
      isWrapped: false,
      registrationStatus: undefined,
      isBasicLoading: true,
    })

    render(<ProfileContent isSelf={false} isLoading name="12.eth" />)

    expect(screen.queryByText('errors.shortName')).not.toBeInTheDocument()
    expect(screen.queryByTestId('profile-tab')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('Name profile')).not.toBeInTheDocument()
  })

  it('should show only the minimum-length error for an unregistered short name', () => {
    setupDesktopLayout()
    mockUseNameDetails.mockReturnValue({
      unsupported: false,
      error: { content: 'errors.shortName', type: 'error' },
      profile: undefined,
      name: '12.eth',
      normalisedName: '12.eth',
      beautifiedName: '12.eth',
      isValid: true,
      isShort: true,
      isETH: true,
      is2LD: true,
      isCachedData: false,
      isWrapped: false,
      registrationStatus: 'short',
      isBasicLoading: false,
    })
    mockUseAbilities.mockReturnValue({ data: { canExtend: false }, isLoading: false })

    render(<ProfileContent isSelf={false} isLoading={false} name="12.eth" />)

    expect(screen.getByText('errors.shortName')).toBeVisible()
    expect(screen.queryByTestId('profile-tab')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /extend/i })).not.toBeInTheDocument()
    expect(screen.queryByText(/available/i)).not.toBeInTheDocument()
    expect(screen.queryByLabelText('Name profile')).not.toBeInTheDocument()
  })

  // on.eth has a real registrar expiry, so the profile shows it. Only the renewal affordances go,
  // because the app deliberately does not offer to extend a short name.
  it('should render an on.eth-shaped registered short profile with its expiry but no extend', () => {
    setupDesktopLayout()
    const owner = '0x1234567890123456789012345678901234567890'
    const expiry = new Date('2036-03-08T00:00:00.000Z')
    mockUseNameDetails.mockReturnValue({
      unsupported: false,
      error: null,
      profile: {
        texts: [],
        coins: [{ id: 60, name: 'eth', value: owner }],
      },
      ownerData: {
        owner,
        registrant: owner,
        ownershipLevel: 'registrar',
      },
      wrapperData: {
        owner,
        expiry: { date: expiry, value: BigInt(expiry.getTime()) },
      },
      expiryDate: expiry,
      name: 'on.eth',
      normalisedName: 'on.eth',
      beautifiedName: 'on.eth',
      isValid: true,
      isShort: true,
      isETH: true,
      is2LD: true,
      isCachedData: false,
      isWrapped: false,
      registrationStatus: 'registered',
      isBasicLoading: false,
      pccExpired: false,
    })
    mockUseAbilities.mockReturnValue({ data: { canExtend: true }, isLoading: false })
    mockUsePrimaryName.mockReturnValue({ data: undefined, isLoading: false })
    mockUseOwners.mockReturnValue([
      {
        address: owner,
        canTransfer: false,
        transferType: 'owner',
        label: 'name.owner',
        description: 'details.descriptions.owner',
        testId: 'owner-button-owner',
      },
    ])
    mockUseProfileActions.mockReturnValue({ profileActions: undefined, isLoading: false })
    mockUseVerifiedRecords.mockReturnValue({
      data: [],
      appendVerificationProps,
    })
    mockUseIsOffchainName.mockReturnValue(false)

    render(<ProfileContent isSelf={false} isLoading={false} name="on.eth" />)

    expect(screen.getByRole('heading', { name: 'on.eth' })).toBeVisible()
    expect(screen.getByText(`Owner: ${owner}`)).toBeVisible()
    expect(screen.getByText(`Address: ${owner}`)).toBeVisible()
    expect(screen.getByText(`Name expires: ${expiry.toISOString()}`)).toBeVisible()
    expect(screen.queryByRole('button', { name: /extend/i })).not.toBeInTheDocument()
  })

  // The status model gives an unhealed label no registerability answer, so an unowned one arrives
  // here as `notOwned` with no error to show. The error and the hiding are decided separately — the
  // error by the status, the hiding by the short-name state — and this is the case that told them
  // apart: it used to render the whole profile underneath a minimum-length error meant for `12.eth`.
  it('should render an unowned encoded-labelhash profile with no error and nothing hidden', () => {
    setupDesktopLayout()
    const encodedName = `[${labelhash('nick').slice(2)}].eth`
    mockUseNameDetails.mockReturnValue({
      unsupported: false,
      error: null,
      profile: {
        texts: [],
        coins: [],
      },
      ownerData: null,
      name: encodedName,
      normalisedName: encodedName,
      beautifiedName: encodedName,
      isValid: true,
      isShort: true,
      isETH: true,
      is2LD: true,
      isCachedData: false,
      isWrapped: false,
      registrationStatus: 'notOwned',
      isBasicLoading: false,
      pccExpired: false,
    })

    render(<ProfileContent isSelf={false} isLoading={false} name={encodedName} />)

    expect(screen.queryByText('errors.shortName')).not.toBeInTheDocument()
    expect(screen.getByLabelText('Name profile')).toBeVisible()
    expect(screen.getByTestId('profile-tab')).toBeVisible()
  })

  // A label the subgraph has not healed is reported short by `parseInput` because there is nothing
  // to measure. The name behind it is an ordinary one and keeps an ordinary profile, extend and all.
  it('should render an ordinary profile for a name whose label is still an encoded labelhash', () => {
    setupDesktopLayout()
    const encodedName = `[${labelhash('nick').slice(2)}].eth`
    const owner = '0x1234567890123456789012345678901234567890'
    const expiry = new Date('2036-03-08T00:00:00.000Z')
    mockUseNameDetails.mockReturnValue({
      unsupported: false,
      error: null,
      profile: {
        texts: [],
        coins: [{ id: 60, name: 'eth', value: owner }],
      },
      ownerData: {
        owner,
        registrant: owner,
        ownershipLevel: 'registrar',
      },
      expiryDate: expiry,
      name: encodedName,
      normalisedName: encodedName,
      beautifiedName: encodedName,
      isValid: true,
      isShort: true,
      isETH: true,
      is2LD: true,
      isCachedData: false,
      isWrapped: false,
      registrationStatus: 'registered',
      isBasicLoading: false,
      pccExpired: false,
    })
    mockUseAbilities.mockReturnValue({ data: { canExtend: true }, isLoading: false })
    mockUsePrimaryName.mockReturnValue({ data: undefined, isLoading: false })
    mockUseOwners.mockReturnValue([
      {
        address: owner,
        canTransfer: false,
        transferType: 'owner',
        label: 'name.owner',
        description: 'details.descriptions.owner',
        testId: 'owner-button-owner',
      },
    ])
    mockUseProfileActions.mockReturnValue({ profileActions: undefined, isLoading: false })
    mockUseVerifiedRecords.mockReturnValue({
      data: [],
      appendVerificationProps,
    })
    mockUseIsOffchainName.mockReturnValue(false)

    render(<ProfileContent isSelf={false} isLoading={false} name={encodedName} />)

    expect(screen.getByRole('heading', { name: encodedName })).toBeVisible()
    expect(screen.getByTestId('profile-tab')).toBeVisible()
    expect(screen.queryByText('errors.shortName')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /extend/i })).toBeVisible()
  })
})
