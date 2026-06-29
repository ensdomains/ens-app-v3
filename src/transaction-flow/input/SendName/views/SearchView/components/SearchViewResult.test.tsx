import { render, screen } from '@app/test-utils'

import { describe, expect, it, vi } from 'vitest'
import { Address } from 'viem'

import type { RoleRecord } from '@app/hooks/ownership/useRoles/useRoles'

import { SearchViewResult } from './SearchViewResult'

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
const multi = '0xmulti' as Address
const fresh = '0xfresh' as Address

const roles: RoleRecord[] = [
  { role: 'owner', address: owner },
  { role: 'manager', address: manager },
  // multi holds both owner and manager, owner listed first (so primaryRole === owner)
  { role: 'owner', address: multi },
  { role: 'manager', address: multi },
]

describe('SearchViewResult', () => {
  it('disables the row and shows a message naming the excluded role when the address already holds it', () => {
    render(<SearchViewResult address={owner} excludeRole="owner" roles={roles} />)

    expect(screen.getByTestId(`search-result-${owner}`)).toBeDisabled()
    const message = screen.getByTestId(`search-result-already-set-${owner}`)
    expect(message).toBeVisible()
    // Assert the full explanatory copy (the alreadySet stem + the role name), not just the
    // role-title fragment — a bare role Tag would also contain 'roles.owner.title'.
    expect(message).toHaveTextContent('input.sendName.views.search.alreadySet.roles.owner.title')
  })

  it('describes the disabled reason without overriding the row identity (AC6)', () => {
    render(<SearchViewResult address={owner} excludeRole="owner" roles={roles} />)

    const button = screen.getByTestId(`search-result-${owner}`)
    // An aria-label would replace the avatar/address accessible name; instead the reason
    // is linked via aria-describedby (pointing at the visible message) and the title tooltip.
    expect(button).not.toHaveAttribute('aria-label')
    const describedBy = button.getAttribute('aria-describedby')
    expect(describedBy).toBe(`search-result-already-set-${owner}`)
    expect(document.getElementById(describedBy as string)).toHaveTextContent(
      'input.sendName.views.search.alreadySet.roles.owner.title',
    )
    expect(button).toHaveAttribute(
      'title',
      'input.sendName.views.search.alreadySet.roles.owner.title',
    )
  })

  it('names the role that caused the disable, not the address first role, for a multi-role address', () => {
    // multi holds owner (first) and manager; editing the manager role disables the row
    render(<SearchViewResult address={multi} excludeRole="manager" roles={roles} />)

    expect(screen.getByTestId(`search-result-${multi}`)).toBeDisabled()
    const message = screen.getByTestId(`search-result-already-set-${multi}`)
    expect(message).toHaveTextContent('input.sendName.views.search.alreadySet.roles.manager.title')
    expect(message).not.toHaveTextContent('roles.owner.title')
  })

  it('stays enabled with no message when the address holds a different role than excludeRole', () => {
    render(<SearchViewResult address={manager} excludeRole="owner" roles={roles} />)

    expect(screen.getByTestId(`search-result-${manager}`)).toBeEnabled()
    expect(screen.queryByTestId(`search-result-already-set-${manager}`)).toBeNull()
    // the existing role badge is preserved for non-conflicting results
    expect(screen.getByText('roles.manager.title')).toBeVisible()
  })

  it('stays enabled with no message for an address that holds no roles', () => {
    render(<SearchViewResult address={fresh} excludeRole="owner" roles={roles} />)

    expect(screen.getByTestId(`search-result-${fresh}`)).toBeEnabled()
    expect(screen.queryByTestId(`search-result-already-set-${fresh}`)).toBeNull()
  })

  it('matches the role-holder address case-insensitively on BOTH sides (AC7)', () => {
    // Production addresses arrive EIP-55 checksummed (mixed-case) from on-chain reads on
    // BOTH the stored role record and the searched address. Use two differently-cased
    // forms of the same address so the match relies on lowercasing each side — removing
    // `.toLowerCase()` from either side of the comparison would fail this test.
    const storedChecksummed = '0xAbCdEf' as Address
    const searchedDifferentCase = '0xaBcDeF' as Address
    const caseRoles: RoleRecord[] = [{ role: 'owner', address: storedChecksummed }]
    render(<SearchViewResult address={searchedDifferentCase} excludeRole="owner" roles={caseRoles} />)

    expect(screen.getByTestId(`search-result-${searchedDifferentCase}`)).toBeDisabled()
    expect(
      screen.getByTestId(`search-result-already-set-${searchedDifferentCase}`),
    ).toHaveTextContent('input.sendName.views.search.alreadySet.roles.owner.title')
  })

  it('ignores role records with an undefined address without disabling or crashing (AC7)', () => {
    // e.g. eth-record is undefined when no ETH address is set — must not match or throw.
    const undefinedAddressRoles: RoleRecord[] = [
      { role: 'eth-record', address: undefined },
      { role: 'owner', address: owner },
    ]
    render(
      <SearchViewResult address={fresh} excludeRole="eth-record" roles={undefinedAddressRoles} />,
    )

    expect(screen.getByTestId(`search-result-${fresh}`)).toBeEnabled()
    expect(screen.queryByTestId(`search-result-already-set-${fresh}`)).toBeNull()
  })
})
