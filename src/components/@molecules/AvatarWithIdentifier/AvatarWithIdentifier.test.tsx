import { render, screen } from '@app/test-utils'

import { afterEach, describe, expect, it, vi } from 'vitest'

import { AvatarWithIdentifier } from './AvatarWithIdentifier'

const mockUsePrimary = vi.fn().mockImplementation(({ address }) => {
  return {
    data:
      address === '0xaddressWithoutAPrimaryName'
        ? undefined
        : { beautifiedName: 'test.eth', name: 'test.eth' },
    isLoading: false,
  }
})
vi.mock('@app/hooks/ensjs/public/usePrimaryName', () => ({
  usePrimaryName: ({ address, enabled }: { address: unknown; enabled?: boolean }) =>
    !enabled ? { isLoading: false } : mockUsePrimary({ address }),
}))

vi.mock('@app/components/AvatarWithZorb', () => ({
  AvatarWithZorb: () => <div>ZORB</div>,
}))

afterEach(() => {
  vi.clearAllMocks()
})

describe('AvatarWithIdentifier', () => {
  it('should render', async () => {
    render(<AvatarWithIdentifier address="0x1234" />)
  })

  it('should render name and address', async () => {
    render(<AvatarWithIdentifier address="0x1234" />)
    expect(screen.getByText('test.eth')).toBeVisible()
    expect(screen.getByText('0x1234')).toBeVisible()
  })

  it('should overwrite subtitle if prop is provided', async () => {
    render(<AvatarWithIdentifier address="0x1234" subtitle="subtitle" />)
    expect(screen.getByText('test.eth')).toBeVisible()
    expect(screen.getByText('subtitle')).toBeVisible()
    expect(screen.queryByText('0x1234')).toEqual(null)
  })

  it('should display shortened address as title if address does not have primary name', async () => {
    render(<AvatarWithIdentifier address="0xaddressWithoutAPrimaryName" />)
    expect(screen.getByTestId('avatar-label-title')).toHaveTextContent('0xadd...yName')
  })

  it('should display full address as title if address does not have primary name and shortenAddressAsTitle is false', async () => {
    render(
      <AvatarWithIdentifier address="0xaddressWithoutAPrimaryName" shortenAddressAsTitle={false} />,
    )
    expect(screen.getByTestId('avatar-label-title')).toHaveTextContent(
      '0xaddressWithoutAPrimaryName',
    )
  })

  it('should display subtitle and address as title if address does not have primary name and subtitle is provided', async () => {
    render(<AvatarWithIdentifier address="0xaddressWithoutAPrimaryName" subtitle="subtitle" />)
    expect(screen.getByTestId('avatar-label-title')).toHaveTextContent('0xadd...yName')
    expect(screen.getByText('subtitle')).toBeVisible()
  })

  it('should not call usePrimary if name is provided', async () => {
    render(<AvatarWithIdentifier address="0x1234" name="name.eth" />)
    expect(mockUsePrimary).not.toHaveBeenCalled()
    expect(screen.getByText('name.eth')).toBeVisible()
  })
})
