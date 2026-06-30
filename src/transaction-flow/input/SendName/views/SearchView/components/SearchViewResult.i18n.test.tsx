import { render, screen } from '@testing-library/react'
import { ReactElement } from 'react'
import { I18nextProvider } from 'react-i18next'
import { ThemeProvider } from 'styled-components'
import { Address } from 'viem'
import { describe, expect, it, vi } from 'vitest'

import { lightTheme } from '@ensdomains/thorin'

import i18n from '@app/i18n'
import type { RoleRecord } from '@app/hooks/ownership/useRoles/useRoles'

import { SearchViewResult } from './SearchViewResult'

// This suite deliberately renders with the REAL i18n resources (en/transactionFlow.json +
// en/common.json) rather than the key-echo mock used by the sibling SearchViewResult.test.tsx.
// It verifies the user-visible copy and the code<->JSON placeholder/namespace binding the mock
// cannot exercise: a deleted/renamed `alreadySet` key, a renamed `{{value}}` placeholder, or a
// wrong/missing `ns: 'common'` on the role title would all change the rendered text and fail here.

vi.mock('@app/components/@molecules/AvatarWithIdentifier/AvatarWithIdentifier', () => ({
  AvatarWithIdentifier: ({ name, address }: any) => (
    <div>
      <span>{name}</span>
      <span>{address}</span>
    </div>
  ),
}))

const owner = '0xowner' as Address
const manager = '0xmanager' as Address
const ethRecord = '0xethrecord' as Address
const multi = '0xmulti' as Address
const fresh = '0xfresh' as Address

const roles: RoleRecord[] = [
  { role: 'owner', address: owner },
  { role: 'manager', address: manager },
  { role: 'eth-record', address: ethRecord },
  // multi holds owner (listed first) and manager
  { role: 'owner', address: multi },
  { role: 'manager', address: multi },
]

const renderWithRealI18n = (ui: ReactElement) =>
  render(
    <ThemeProvider theme={lightTheme}>
      <I18nextProvider i18n={i18n}>{ui}</I18nextProvider>
    </ThemeProvider>,
  )

describe('SearchViewResult (real i18n copy)', () => {
  it('renders the real localized message naming the owner role', () => {
    renderWithRealI18n(<SearchViewResult address={owner} excludeRole="owner" roles={roles} />)

    expect(screen.getByTestId(`search-result-already-set-${owner}`)).toHaveTextContent(
      'This address is already the owner',
    )
  })

  it('renders the real localized message naming the manager role', () => {
    renderWithRealI18n(<SearchViewResult address={manager} excludeRole="manager" roles={roles} />)

    expect(screen.getByTestId(`search-result-already-set-${manager}`)).toHaveTextContent(
      'This address is already the manager',
    )
  })

  it('renders the real localized message naming the eth-record role', () => {
    renderWithRealI18n(
      <SearchViewResult address={ethRecord} excludeRole="eth-record" roles={roles} />,
    )

    expect(screen.getByTestId(`search-result-already-set-${ethRecord}`)).toHaveTextContent(
      'This address is already the ETH record',
    )
  })

  it('names the role that caused the disable, not the address first role, in real copy', () => {
    // multi holds owner (first) and manager; disabling the manager role must say "manager".
    renderWithRealI18n(<SearchViewResult address={multi} excludeRole="manager" roles={roles} />)

    const message = screen.getByTestId(`search-result-already-set-${multi}`)
    expect(message).toHaveTextContent('This address is already the manager')
    expect(message).not.toHaveTextContent('owner')
  })

  it('renders no already-set copy for a non-conflicting address', () => {
    renderWithRealI18n(<SearchViewResult address={fresh} excludeRole="owner" roles={roles} />)

    expect(screen.queryByTestId(`search-result-already-set-${fresh}`)).toBeNull()
    expect(screen.queryByText(/This address is already/)).toBeNull()
  })

  it('preserves the real localized role Tag for a non-conflicting address holding another role', () => {
    // manager holds the 'manager' role; sending the 'owner' role does not disable it, so the
    // existing role Tag must still render the real localized title (common:roles.manager.title).
    // Exercises the Tag's real i18n binding a key-echo mock cannot — a missing key or dropped
    // `ns: 'common'` would surface a raw key here instead of "manager".
    renderWithRealI18n(<SearchViewResult address={manager} excludeRole="owner" roles={roles} />)

    expect(screen.queryByTestId(`search-result-already-set-${manager}`)).toBeNull()
    expect(screen.getByText('manager')).toBeVisible()
  })
})
