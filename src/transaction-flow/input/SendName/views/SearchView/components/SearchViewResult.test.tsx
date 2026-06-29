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
    expect(message).toHaveTextContent('roles.owner.title')
  })

  it('exposes the reason via an accessible name on the disabled control', () => {
    render(<SearchViewResult address={owner} excludeRole="owner" roles={roles} />)

    const button = screen.getByTestId(`search-result-${owner}`)
    expect(button).toHaveAttribute('aria-label', expect.stringContaining('roles.owner.title'))
    expect(button).toHaveAttribute('title', expect.stringContaining('roles.owner.title'))
  })

  it('names the role that caused the disable, not the address first role, for a multi-role address', () => {
    // multi holds owner (first) and manager; editing the manager role disables the row
    render(<SearchViewResult address={multi} excludeRole="manager" roles={roles} />)

    expect(screen.getByTestId(`search-result-${multi}`)).toBeDisabled()
    const message = screen.getByTestId(`search-result-already-set-${multi}`)
    expect(message).toHaveTextContent('roles.manager.title')
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
})
